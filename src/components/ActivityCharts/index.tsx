import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import type {NkmotCommit} from '@site/src/utils/githubActivityData';
import {localeTag} from '@site/src/utils/dateParts';
import styles from './index.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;
/** 采集数据最多 100 条提交，窗口兜底 120 天，防止极端稀疏提交把横轴拉到失控 */
const MAX_WINDOW_DAYS = 120;

type DayBucket = {
  /** UTC 天序号（epoch 天数） */
  day: number;
  count: number;
};

/**
 * 将提交按 UTC 天分桶。窗口起点取最旧一条提交，终点取采集时间（均为构建期固定值），
 * 保证 SSR 与客户端渲染结果一致。
 */
function bucketCommitsByDay(
  commits: NkmotCommit[],
  fetchedAt: string,
): {buckets: DayBucket[]; total: number} {
  const newestMs = Date.parse(commits[0]?.date ?? '');
  const oldestMs = Date.parse(commits[commits.length - 1]?.date ?? '');
  const fetchedMs = Date.parse(fetchedAt);
  if (!Number.isFinite(newestMs) || !Number.isFinite(oldestMs)) {
    return {buckets: [], total: 0};
  }
  const endMs = Number.isFinite(fetchedMs) ? Math.max(fetchedMs, newestMs) : newestMs;
  const startDay = Math.floor(oldestMs / DAY_MS);
  const endDay = Math.floor(endMs / DAY_MS);
  const days = Math.min(Math.max(endDay - startDay + 1, 1), MAX_WINDOW_DAYS);
  const counts = new Array<number>(days).fill(0);
  let total = 0;
  for (const commit of commits) {
    const ms = Date.parse(commit.date);
    if (!Number.isFinite(ms)) {
      continue;
    }
    const idx = Math.floor(ms / DAY_MS) - startDay;
    if (idx >= 0 && idx < days) {
      counts[idx] += 1;
      total += 1;
    }
  }
  return {
    buckets: counts.map((count, i) => ({day: startDay + i, count})),
    total,
  };
}

function dayDate(dayNumber: number): Date {
  return new Date(dayNumber * DAY_MS);
}

/** 提交趋势：纯 SVG 柱状图（与首页 UsageSvg 同风格），悬浮经 <title> 显示数值 */
function CommitTrendChart({
  commits,
  fetchedAt,
  locale,
}: {
  commits: NkmotCommit[];
  fetchedAt: string;
  locale: string;
}) {
  const {buckets, total} = bucketCommitsByDay(commits, fetchedAt);
  if (buckets.length === 0) {
    return null;
  }

  const VIEW_W = 720;
  const VIEW_H = 220;
  const pad = {top: 12, right: 8, bottom: 26, left: 34};
  const plotW = VIEW_W - pad.left - pad.right;
  const plotH = VIEW_H - pad.top - pad.bottom;
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const midCount = Math.round(maxCount / 2);
  const y = (v: number) => pad.top + plotH * (1 - v / maxCount);
  const slot = plotW / buckets.length;
  const barW = Math.max(1.5, slot * 0.68);

  const dayFmt = new Intl.DateTimeFormat(localeTag(locale), {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  // 横轴只标 ~4 个刻度，避免拥挤
  const labelStep = Math.max(1, Math.ceil(buckets.length / 4));
  const labelIdx = buckets
    .map((_, i) => i)
    .filter((i) => i % labelStep === 0 || i === buckets.length - 1);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={styles.trend}
      role="img"
      aria-label={translate({
        id: 'activity.chart.commitsAria',
        message: 'Bar chart of commits per day',
      })}>
      {[0, midCount, maxCount].map((v) => (
        <g key={v}>
          <line
            x1={pad.left}
            x2={VIEW_W - pad.right}
            y1={y(v)}
            y2={y(v)}
            className={v === 0 ? styles.axis : styles.grid}
          />
          <text
            x={pad.left - 6}
            y={y(v) + 3}
            textAnchor="end"
            className={styles.axisText}>
            {v}
          </text>
        </g>
      ))}
      {buckets.map((bucket, i) => {
        if (bucket.count === 0) {
          return null;
        }
        const x = pad.left + (i + 0.5) * slot - barW / 2;
        const barH = plotH * (bucket.count / maxCount);
        return (
          <rect
            key={bucket.day}
            className={styles.bar}
            x={x}
            y={y(bucket.count)}
            width={barW}
            height={barH}
            rx={Math.min(1.5, barW / 2)}>
            <title>
              {translate(
                {id: 'activity.chart.barTip', message: '{count} commits · {date}'},
                {
                  count: bucket.count,
                  date: dayFmt.format(dayDate(bucket.day)),
                },
              )}
            </title>
          </rect>
        );
      })}
      {labelIdx.map((i) => (
        <text
          key={i}
          x={pad.left + (i + 0.5) * slot}
          y={VIEW_H - 8}
          textAnchor={
            i === 0 ? 'start' : i === buckets.length - 1 ? 'end' : 'middle'
          }
          className={styles.axisText}>
          {dayFmt.format(dayDate(buckets[i].day))}
        </text>
      ))}
    </svg>
  );
}

/** 活跃贡献者：采集窗口内按提交数排序的横向条形榜（Top 5，其余聚合为“其他”） */
function ContributorsChart({commits}: {commits: NkmotCommit[]}) {
  type Entry = {login: string | null; count: number};
  const tally = new Map<string, Entry>();
  for (const commit of commits) {
    const key = commit.authorLogin ?? '@@anon';
    const entry = tally.get(key) ?? {login: commit.authorLogin, count: 0};
    entry.count += 1;
    tally.set(key, entry);
  }
  const sorted = [...tally.values()].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, 5);
  const restCount = sorted.slice(5).reduce((sum, e) => sum + e.count, 0);
  const rows = restCount > 0 ? [...top, {login: null, count: restCount}] : top;
  if (rows.length === 0) {
    return null;
  }
  const maxCount = rows[0].count;

  return (
    <ul className={styles.authorList}>
      {rows.map((row) => {
        const isOthers = row.login === null;
        const label = isOthers ? (
          <Translate id="activity.chart.others" description="Aggregated row for remaining authors">
            Others
          </Translate>
        ) : (
          row.login
        );
        const name = (
          <span className={styles.authorName}>
            {isOthers ? (
              label
            ) : (
              <Link
                className={styles.authorLink}
                href={`https://github.com/${row.login}`}>
                {label}
              </Link>
            )}
          </span>
        );
        return (
          <li key={row.login ?? 'others'} className={styles.authorRow}>
            {isOthers ? (
              <span className={styles.avatarMore} aria-hidden="true">
                +
              </span>
            ) : (
              <img
                className={styles.avatar}
                src={`https://github.com/${row.login}.png?size=48`}
                width={24}
                height={24}
                loading="lazy"
                alt=""
              />
            )}
            <div className={styles.rowMain}>
              <div className={styles.rowTop}>
                {name}
                <span className={styles.authorCount}>{row.count}</span>
              </div>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{width: `${(row.count / maxCount) * 100}%`}}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** /activity 页图表区：左“提交趋势”柱状图 + 右“活跃贡献者”条形榜，窄屏纵向堆叠 */
export default function ActivityCharts({
  commits,
  fetchedAt,
  locale,
}: {
  commits: NkmotCommit[];
  fetchedAt: string;
  locale: string;
}) {
  if (commits.length === 0 || !fetchedAt) {
    return null;
  }
  const {total} = bucketCommitsByDay(commits, fetchedAt);
  const windowDays = bucketWindowDays(commits, fetchedAt);
  return (
    <div className={styles.chartsGrid}>
      <div className={styles.card}>
        <Heading as="h2" className={styles.cardTitle}>
          <Translate id="activity.chart.commitsTitle" description="Commit activity chart title">
            Commit activity
          </Translate>
        </Heading>
        <p className={styles.cardSubtitle}>
          {translate(
            {
              id: 'activity.chart.commitsSubtitle',
              message: '{total} commits in the last {days} days',
            },
            {total, days: windowDays},
          )}
        </p>
        <CommitTrendChart commits={commits} fetchedAt={fetchedAt} locale={locale} />
      </div>
      <div className={styles.card}>
        <Heading as="h2" className={styles.cardTitle}>
          <Translate id="activity.chart.authorsTitle" description="Top contributors chart title">
            Top contributors
          </Translate>
        </Heading>
        <p className={styles.cardSubtitle}>
          <Translate
            id="activity.chart.authorsSubtitle"
            description="Top contributors chart subtitle">
            Ranked by commits in the same window
          </Translate>
        </p>
        <ContributorsChart commits={commits} />
      </div>
    </div>
  );
}

/** 与图表一致的窗口天数（含首尾），供副标题文案使用 */
function bucketWindowDays(commits: NkmotCommit[], fetchedAt: string): number {
  const {buckets} = bucketCommitsByDay(commits, fetchedAt);
  return buckets.length;
}
