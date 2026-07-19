import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import Translate, {translate} from '@docusaurus/Translate';
import {useEffect, useRef, useState} from 'react';
import { redirectToLanguageVersion } from '../redirects';

const BSTATS_CHART_BASE =
  'https://bstats.org/api/v1/plugins/10277/charts';
const BSTATS_MOT_PAGE_URL =
  'https://bstats.org/plugin/server-implementation/Nukkit/10277';

type BStatsPieEntry = {
  name?: unknown;
  y?: unknown;
};

function parseMotServerCount(data: unknown): number | null {
  if (!Array.isArray(data)) {
    return null;
  }
  const motEntry = data.find((entry: BStatsPieEntry) => entry?.name === 'MOT');
  if (!motEntry || typeof motEntry.y !== 'number' || !Number.isFinite(motEntry.y)) {
    return null;
  }
  return Math.max(0, Math.trunc(motEntry.y));
}

// players 图表为 [[timestamp, value], ...]，取最新值
function parseLatestValue(data: unknown): number | null {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  const last = data[data.length - 1];
  if (!Array.isArray(last) || last.length < 2) {
    return null;
  }
  const value = last[1];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.trunc(value));
}

// location 图表为 [{name, y}, ...]，取覆盖国家/地区数量
function parseCountryCount(data: unknown): number | null {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.length;
}

type Stats = {
  motServers: number | null;
  serversTotal: number | null;
  playersTotal: number | null;
  countries: number | null;
};

function fmt(value: number | null): string {
  return value === null ? '—' : value.toLocaleString();
}

const COUNT_UP_DURATION_MS = 600;

/** 数字滚动：start 后从 0 缓动到 target；prefers-reduced-motion 直接到终值。target 为 null（加载中/失败）时返回 null。 */
function useCountUp(target: number | null, start: boolean): number | null {
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (target === null || !start) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - t0) / COUNT_UP_DURATION_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);

  return target === null ? null : (display ?? 0);
}

/** 1:1 动态 SVG：用 bStats 服务器数驱动，与特性区 SVG 同风格（浅灰卡 + 网格 + 标题）。started 后数字滚动递增 */
function UsageSvg({stats, started}: {stats: Stats; started: boolean}) {
  const motServers = useCountUp(stats.motServers, started);
  const serversTotal = useCountUp(stats.serversTotal, started);
  const playersTotal = useCountUp(stats.playersTotal, started);
  const countries = useCountUp(stats.countries, started);

  return (
    <svg viewBox="0 0 200 200" className={styles.usageSvg} role="img" aria-label={translate({id: 'homepage.widelyUsed.ariaLabel', message: 'bStats server statistics'})}>
      <rect width="200" height="200" rx="8" ry="8" style={{fill: 'var(--feat-card-bg)', stroke: 'var(--feat-line)'}} strokeWidth="1" />
      <g style={{stroke: 'var(--feat-line)'}} strokeWidth="0.5" opacity="0.5">
        <line x1="0" y1="60" x2="200" y2="60" />
        <line x1="0" y1="140" x2="200" y2="140" />
        <line x1="60" y1="0" x2="60" y2="200" />
        <line x1="140" y1="0" x2="140" y2="200" />
      </g>
      <text x="100" y="40" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="11" font-weight="bold" text-anchor="middle" style={{fill: 'var(--feat-title)'}}>
        <Translate id="homepage.widelyUsed">Widely Used</Translate>
      </text>
      <text x="100" y="110" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="30" font-weight="bold" text-anchor="middle" style={{fill: '#4facfe', fontVariantNumeric: 'tabular-nums'}}>
        {fmt(motServers)} / {fmt(serversTotal)}
      </text>
      <text x="100" y="130" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="10" text-anchor="middle" style={{fill: 'var(--feat-muted)'}}>
        <Translate id="homepage.widelyUsed.motVsTotal">MOT / Total Servers</Translate>
      </text>
      <text x="100" y="158" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="9" text-anchor="middle" style={{fill: 'var(--feat-muted)'}}>
        <Translate id="homepage.widelyUsed.totalPlayers" values={{count: fmt(playersTotal)}}>
          {'{count} total players'}
        </Translate>
      </text>
      <text x="100" y="172" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="9" text-anchor="middle" style={{fill: 'var(--feat-muted)'}}>
        <Translate id="homepage.widelyUsed.totalCountries" values={{count: fmt(countries)}}>
          {'{count} total countries'}
        </Translate>
      </text>
    </svg>
  );
}

/** 作为第 7 个特性行：左右交叉布局，媒体为 bStats 动态 SVG，文案"Widely Used" */
function WidelyUsedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [stats, setStats] = useState<Stats>({
    motServers: null,
    serversTotal: null,
    playersTotal: null,
    countries: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const opts: RequestInit = {
      headers: {Accept: 'application/json'},
      signal: controller.signal,
    };
    const safe = (p: Promise<unknown>) => p.catch(() => null);
    Promise.all([
      safe(fetch(`${BSTATS_CHART_BASE}/nukkit_version/data`, opts).then((r) => r.json())),
      safe(fetch(`${BSTATS_CHART_BASE}/servers/data`, opts).then((r) => r.json())),
      safe(fetch(`${BSTATS_CHART_BASE}/players/data`, opts).then((r) => r.json())),
      safe(fetch(`${BSTATS_CHART_BASE}/location/data`, opts).then((r) => r.json())),
    ]).then(([ver, sv, pl, loc]) => {
      setStats({
        motServers: parseMotServerCount(ver),
        serversTotal: parseLatestValue(sv),
        playersTotal: parseLatestValue(pl),
        countries: parseCountryCount(loc),
      });
    });
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // 数字滚动等区块进入视口后再触发（与 data-reveal 入场时机一致），一次性
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {rootMargin: '0px 0px -12% 0px', threshold: 0.12}
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.usageSection}>
      <div className="container">
        <div className={styles.usageRow} data-reveal>
          <div className={styles.usageMedia}>
            <UsageSvg stats={stats} started={inView} />
          </div>
          <div className={styles.usageContent}>
            <Heading as="h2">
              <Translate id="homepage.widelyUsed" description="Widely used section title">
                Widely Used
              </Translate>
            </Heading>
            <p>
              <Translate id="homepage.widelyUsedDesc" description="Widely used section description">
                Adopted by Minecraft server communities worldwide. Real-time adoption stats — server count, player activity and geographic reach — are powered by bStats.
              </Translate>
            </p>
            <a
              className={styles.usageLink}
              href={BSTATS_MOT_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer">
              <Translate id="homepage.viewOnBstats" description="View on bStats link">
                View on bStats →
              </Translate>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 80);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    const target = document.getElementById('homepage-main');
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY;
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <button
      type="button"
      className={clsx(styles.scrollHint, !visible && styles.scrollHintHidden)}
      onClick={handleClick}
      aria-label={translate({id: 'homepage.scrollHint.ariaLabel', message: 'Scroll to content'})}>
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const headerRef = useRef<HTMLElement>(null);

  // hero 滚出视口后暂停波浪圆盘旋转，滚回时恢复
  useEffect(() => {
    const header = headerRef.current;
    if (!header || !('IntersectionObserver' in window)) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      header.classList.toggle(styles.heroWavesPaused, !entry.isIntersecting);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContent)}>
        <Heading as="h1" className="hero__title">
          <Translate
            id="homepage.title"
            description="The homepage title"
            values={{}}>
            {siteConfig.title}
          </Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate
            id="homepage.subtitle"
            description="The homepage subtitle"
            values={{}}>
            {siteConfig.tagline}
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://motci.cn/job/Nukkit-MOT/job/master/">
            <Translate
              id="homepage.downloadNukkitMot"
              description="The homepage message to ask the user to download nukkit-mot">
              🌐 Download
            </Translate>
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            <Translate
              id="homepage.visitDocs"
              description="The homepage message to ask the user to visit docs">
              📖 Let's Go
            </Translate>
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="https://plugins.nukkit-mot.com/">
            <Translate
              id="homepage.visitPlugins"
              description="The homepage message to ask the user to visit the plugin platform">
              🧩 Plugins
            </Translate>
          </Link>
        </div>
      </div>
      <ScrollHint />
    </header>
  );
}

export default function Home(): React.ReactElement {
  useEffect(() => {
    redirectToLanguageVersion();
  }, []);

  // 特性行滚动入场：进入视口时淡入上浮，统一与 hero 的运动语言。
  // prefers-reduced-motion 或不支持 IntersectionObserver 时立即显示。
  useEffect(() => {
    const main = document.getElementById('homepage-main');
    if (!main) {
      return;
    }
    const revealEls = main.querySelectorAll<HTMLElement>('[data-reveal]');
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => {
        el.dataset.reveal = 'visible';
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = 'visible';
            observer.unobserve(entry.target);
          }
        });
      },
      {rootMargin: '0px 0px -12% 0px', threshold: 0.12}
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Layout
      title={translate({id: 'homepage.layout.title', message: 'Nukkit-MOT Wiki'})}
      description={translate({
        id: 'homepage.layout.description',
        message:
          'Learn Nukkit-MOT and enjoy multi-version support and a rich plugin ecosystem.',
      })}>
      <HomepageHeader />
      <main id="homepage-main" className={clsx(styles.heroMain)}>
        <HomepageFeatures />
        <WidelyUsedSection />
      </main>
    </Layout>
  );
}
