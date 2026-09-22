import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import {useEffect, useState} from 'react';
import type {NkmotCommit} from '@site/src/utils/githubActivityData';
import type {NkmotActivityData} from '@site/src/utils/githubActivityData';
import {
  CACHE_TTL_MS,
  fetchLiveActivity,
  readLocalActivityCache,
  writeLocalActivityCache,
} from '@site/src/utils/githubActivityClient';
import ActivityCharts from '@site/src/components/ActivityCharts';
import {localeTag} from '@site/src/utils/dateParts';
import styles from './activity.module.css';

const COMMIT_PAGE_SIZE = 30;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const AVATAR_SIZE = 32;

// 所有日期统一按 UTC 展示：采集数据为 UTC ISO 字符串，避免 SSR 与客户端时区不一致导致 hydration 抖动
function formatDay(isoDay: string, locale: string): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(isoDay));
}

function formatDateTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

type CommitGroup = {dayKey: string; commits: NkmotCommit[]};

function groupByDay(commits: NkmotCommit[]): CommitGroup[] {
  const groups: CommitGroup[] = [];
  const byDay = new Map<string, CommitGroup>();
  for (const commit of commits) {
    const dayKey = commit.date.slice(0, 10);
    let group = byDay.get(dayKey);
    if (!group) {
      group = {dayKey, commits: []};
      byDay.set(dayKey, group);
      groups.push(group);
    }
    group.commits.push(commit);
  }
  return groups;
}

function StatCard({
  value,
  labelId,
  labelText,
}: {
  value: string;
  labelId: string;
  labelText: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>
        <Translate id={labelId}>{labelText}</Translate>
      </div>
    </div>
  );
}

function CommitItem({commit}: {commit: NkmotCommit}) {
  const shortSha = commit.sha.slice(0, 7);
  return (
    <li className={styles.commitItem}>
      {commit.authorLogin ? (
        <img
          className={styles.avatar}
          src={`https://github.com/${commit.authorLogin}.png?size=${AVATAR_SIZE * 2}`}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          loading="lazy"
          alt=""
        />
      ) : (
        <span className={clsx(styles.avatar, styles.avatarFallback)} aria-hidden="true">
          *
        </span>
      )}
      <div className={styles.commitBody}>
        <Link className={styles.commitTitle} href={commit.htmlUrl}>
          {commit.title}
        </Link>
        <div className={styles.commitMeta}>
          {commit.authorLogin ? (
            <Link className={styles.commitAuthor} href={commit.authorHtmlUrl ?? undefined}>
              {commit.authorLogin}
            </Link>
          ) : (
            <span className={styles.commitAuthor}>{translate({id: 'activity.commit.anonAuthor', message: 'Unknown author'})}</span>
          )}
          <span className={styles.metaDot} aria-hidden="true">
            ·
          </span>
          <Link className={styles.commitSha} href={commit.htmlUrl}>
            {shortSha}
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function ActivityPage(): React.ReactElement {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const pluginData = usePluginData('github-activity') as
    | NkmotActivityData
    | undefined;

  // 初始渲染使用构建时快照（SSR 与客户端一致），挂载后由浏览器自动拉取最新数据
  const [data, setData] = useState<NkmotActivityData | undefined>(pluginData);
  const [source, setSource] = useState<'snapshot' | 'live' | 'cache'>('snapshot');
  const [refreshing, setRefreshing] = useState(false);

  // 浏览器端自动加载最新数据：
  // 1) localStorage 缓存在 TTL 内 → 直接使用，不发请求；
  // 2) 否则带 ETag 条件请求 GitHub（304 不消耗速率配额）；
  // 3) 任何失败（限流/断网）静默回退：本地缓存 → 构建时快照。
  useEffect(() => {
    if (!pluginData) {
      return undefined;
    }
    let cancelled = false;
    const cached = readLocalActivityCache();
    if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
      setData(cached.data);
      setSource('cache');
      return undefined;
    }
    setRefreshing(true);
    fetchLiveActivity(pluginData, cached)
      .then((result) => {
        if (cancelled) {
          return;
        }
        writeLocalActivityCache(result.cache);
        setData(result.data);
        setSource('live');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        if (cached) {
          setData(cached.data);
          setSource('cache');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRefreshing(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [pluginData]);

  const [visibleCount, setVisibleCount] = useState(COMMIT_PAGE_SIZE);

  const commits = data?.commits ?? [];
  const tags = data?.tags ?? [];
  const repo = data?.repo ?? null;

  // 30 天窗口锚定在构建时的采集时间上，保证 SSR 与客户端结果完全一致
  const fetchedMs = data?.fetchedAt ? Date.parse(data.fetchedAt) : Number.NaN;
  const cutoffMs = Number.isFinite(fetchedMs) ? fetchedMs - THIRTY_DAYS_MS : Number.NaN;
  const recentCommits = Number.isFinite(cutoffMs)
    ? commits.filter((c) => Date.parse(c.date) >= cutoffMs)
    : [];
  const recentAuthors = new Set(
    recentCommits.map((c) => c.authorLogin ?? `anon:${c.sha.slice(0, 7)}`),
  );

  const hasData = commits.length > 0 || repo !== null;
  const visibleGroups = groupByDay(commits.slice(0, visibleCount));
  const hasMore = commits.length > visibleCount;
  const updatedAtDate = data?.fetchedAt
    ? formatDateTime(data.fetchedAt, locale)
    : '';

  return (
    <Layout
      title={translate({id: 'activity.layout.title', message: 'Development Activity'})}
      description={translate({
        id: 'activity.layout.description',
        message:
          'Recent Nukkit-MOT development activity: latest commits, version tags and contributors, collected from GitHub.',
      })}>
      <main className={styles.page}>
        <div className="container">
          <header className={styles.header}>
            <div>
              <Heading as="h1" className={styles.title}>
                <Translate id="activity.title" description="Activity page title">
                  Development Activity
                </Translate>
              </Heading>
              <p className={styles.subtitle}>
                <Translate
                  id="activity.subtitle"
                  description="Activity page subtitle explaining the data source">
                  Recent commits, version tags and contributors of Nukkit-MOT,
                  auto-loaded from GitHub in your browser.
                </Translate>
              </p>
              {hasData && updatedAtDate && (
                <p className={styles.updatedAt}>
                  {source === 'live'
                    ? translate(
                        {
                          id: 'activity.updatedAtLive',
                          message: 'Live · fetched from GitHub at {date} (UTC)',
                        },
                        {date: updatedAtDate},
                      )
                    : source === 'cache'
                      ? translate(
                          {
                            id: 'activity.updatedAtCache',
                            message: 'Cached · fetched from GitHub at {date} (UTC)',
                          },
                          {date: updatedAtDate},
                        )
                      : translate(
                          {
                            id: 'activity.updatedAt',
                            message: 'Data collected at {date} (UTC)',
                          },
                          {date: updatedAtDate},
                        )}
                  {source === 'snapshot' && data?.stale && (
                    <span className={styles.staleNote}>
                      {' — '}
                      <Translate
                        id="activity.staleNote"
                        description="Note shown when build-time collection failed and cached data is shown">
                        live collection failed during this build, showing the last
                        cached snapshot
                      </Translate>
                    </span>
                  )}
                  {refreshing && (
                    <span className={styles.refreshing}>
                      {' · '}
                      <Translate
                        id="activity.refreshing"
                        description="Shown while the browser fetches fresh GitHub data">
                        Fetching latest…
                      </Translate>
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className={styles.headerActions}>
              {repo && (
                <Link
                  className="button button--primary"
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Translate id="activity.viewGithub" description="View repository on GitHub button">
                    View on GitHub
                  </Translate>
                </Link>
              )}
            </div>
          </header>

          {hasData ? (
            <>
              <section className={styles.statsGrid} aria-label="Statistics">
                <StatCard
                  value={tags[0]?.name ?? '—'}
                  labelId="activity.stat.latestVersion"
                  labelText="Latest version"
                />
                <StatCard
                  value={String(recentCommits.length)}
                  labelId="activity.stat.commits30d"
                  labelText="Commits · last 30 days"
                />
                <StatCard
                  value={String(recentAuthors.size)}
                  labelId="activity.stat.contributors30d"
                  labelText="Contributors · last 30 days"
                />
                <StatCard
                  value={
                    data?.contributorsTotal != null ? String(data.contributorsTotal) : '—'
                  }
                  labelId="activity.stat.contributorsTotal"
                  labelText="Contributors · total"
                />
              </section>

              <ActivityCharts
                commits={commits}
                fetchedAt={data?.fetchedAt ?? ''}
                locale={locale}
              />

              {tags.length > 0 && (
                <section className={styles.section}>
                  <Heading as="h2" className={styles.sectionTitle}>
                    <Translate id="activity.versions.title" description="Version tags section title">
                      Version tags
                    </Translate>
                  </Heading>
                  <div className={styles.chipsRow}>
                    {tags.map((tag) => (
                      <Link
                        key={tag.name}
                        className={styles.chip}
                        href={tag.commitHtmlUrl}
                        title={tag.commitSha.slice(0, 7)}>
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section className={styles.section}>
                <Heading as="h2" className={styles.sectionTitle}>
                  <Translate id="activity.commits.title" description="Recent commits section title">
                    Recent commits
                  </Translate>
                </Heading>
                {commits.length === 0 ? (
                  <div className={styles.empty}>
                    <Translate
                      id="activity.commits.empty"
                      description="Shown when no commit data is available">
                      No commit data available right now.
                    </Translate>
                  </div>
                ) : (
                  <div className={styles.timeline}>
                    {visibleGroups.map((group) => (
                      <div key={group.dayKey} className={styles.dayGroup}>
                        <div className={styles.dayHeader}>
                          {formatDay(group.dayKey, locale)}
                          <span className={styles.dayCount}>{group.commits.length}</span>
                        </div>
                        <ul className={styles.commitList}>
                          {group.commits.map((commit) => (
                            <CommitItem key={commit.sha} commit={commit} />
                          ))}
                        </ul>
                      </div>
                    ))}
                    {hasMore && (
                      <div className={styles.moreRow}>
                        <button
                          type="button"
                          className="button button--secondary button--sm"
                          onClick={() => setVisibleCount((n) => n + COMMIT_PAGE_SIZE)}>
                          <Translate id="activity.commits.more" description="Show more commits button">
                            Show more
                          </Translate>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className={styles.empty}>
              <Translate
                id="activity.emptyFallback"
                description="Shown when GitHub data could not be collected at build time">
                Development activity data could not be collected during the last site
                build. Please check back after the next build, or browse the repository
                on GitHub.
              </Translate>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
