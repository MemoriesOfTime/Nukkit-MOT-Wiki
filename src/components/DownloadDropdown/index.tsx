import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import {useEffect, useRef, useState} from 'react';

import styles from './styles.module.css';

const FALLBACK_FULL_URL =
  'https://motci.cn/job/Nukkit-MOT/job/master/lastSuccessfulBuild/artifact/target/Nukkit-MOT-SNAPSHOT.jar';
const FALLBACK_LITE_URL =
  'https://motci.cn/job/Nukkit-MOT/job/master/lastSuccessfulBuild/artifact/target/Nukkit-MOT-SNAPSHOT-Lite.jar';

const JENKINS_API_URL =
  'https://motci.cn/job/Nukkit-MOT/job/master/lastSuccessfulBuild/api/json?tree=url,number,artifacts[relativePath]';
const SNAPSHOT_CACHE_KEY = 'download-snapshot:v1';
const SNAPSHOT_CACHE_TTL_MS = 10 * 60 * 1000;

type SnapshotInfo = {
  buildNumber: number | null;
  fullUrl: string;
  liteUrl: string;
  fullSizeBytes: number | null;
  liteSizeBytes: number | null;
};

const FALLBACK_INFO: SnapshotInfo = {
  buildNumber: null,
  fullUrl: FALLBACK_FULL_URL,
  liteUrl: FALLBACK_LITE_URL,
  fullSizeBytes: null,
  liteSizeBytes: null,
};

/** 从 Jenkins 构建 JSON 解析两种 jar 的工件地址；按后缀匹配以容忍命名变化，
 *  主 jar 排除 -sources/-javadoc 等常见附属工件，避免多工件时误抓；
 *  缺任一工件视为解析失败（返回 null，走回退）。 */
export function parseSnapshotUrls(data: unknown): {
  buildNumber: number;
  fullUrl: string;
  liteUrl: string;
} | null {
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  const {url, number, artifacts} = data as Record<string, unknown>;
  if (
    typeof url !== 'string' ||
    typeof number !== 'number' ||
    !Number.isFinite(number) ||
    !Array.isArray(artifacts)
  ) {
    return null;
  }
  const paths = artifacts
    .map((a) =>
      typeof a === 'object' && a !== null
        ? (a as Record<string, unknown>).relativePath
        : null,
    )
    .filter((p): p is string => typeof p === 'string');
  const litePath = paths.find((p) => /lite\.jar$/i.test(p));
  const fullPath = paths.find(
    (p) => /\.jar$/i.test(p) && !/(lite|sources|javadoc)\.jar$/i.test(p),
  );
  if (!litePath || !fullPath) {
    return null;
  }
  return {
    buildNumber: number,
    fullUrl: `${url}artifact/${fullPath}`,
    liteUrl: `${url}artifact/${litePath}`,
  };
}

/** 字节数 → 展示文本（如 "93.9 MB"）；单位走 i18n（ru 为 МБ）。 */
function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  const text = mb.toLocaleString(undefined, {maximumFractionDigits: 1});
  return `${text} ${translate({id: 'homepage.download.sizeUnit', message: 'MB'})}`;
}

/** 拉取最新构建信息；HEAD 读 Content-Length（CORS safelist 头，可直接读）。 */
async function fetchSnapshotInfo(
  signal: AbortSignal,
): Promise<SnapshotInfo | null> {
  const res = await fetch(JENKINS_API_URL, {signal});
  if (!res.ok) {
    return null;
  }
  const parsed = parseSnapshotUrls(await res.json());
  if (!parsed) {
    return null;
  }
  const readSize = async (jarUrl: string): Promise<number | null> => {
    try {
      const head = await fetch(jarUrl, {method: 'HEAD', signal});
      const raw = head.ok ? head.headers.get('content-length') : null;
      const n = raw === null ? NaN : Number(raw);
      return Number.isFinite(n) && n >= 0 ? n : null;
    } catch {
      return null;
    }
  };
  const [fullSizeBytes, liteSizeBytes] = await Promise.all([
    readSize(parsed.fullUrl),
    readSize(parsed.liteUrl),
  ]);
  return {...parsed, fullSizeBytes, liteSizeBytes};
}

function readSnapshotCache(): SnapshotInfo | null {
  try {
    const cached = sessionStorage.getItem(SNAPSHOT_CACHE_KEY);
    if (!cached) {
      return null;
    }
    const {ts, ...info} = JSON.parse(cached) as Record<string, unknown>;
    if (
      typeof ts !== 'number' ||
      Date.now() - ts > SNAPSHOT_CACHE_TTL_MS ||
      typeof info !== 'object' ||
      info === null
    ) {
      return null;
    }
    const {buildNumber, fullUrl, liteUrl, fullSizeBytes, liteSizeBytes} =
      info as SnapshotInfo;
    if (typeof fullUrl !== 'string' || typeof liteUrl !== 'string') {
      return null;
    }
    return {
      buildNumber: typeof buildNumber === 'number' ? buildNumber : null,
      fullUrl,
      liteUrl,
      fullSizeBytes: typeof fullSizeBytes === 'number' ? fullSizeBytes : null,
      liteSizeBytes: typeof liteSizeBytes === 'number' ? liteSizeBytes : null,
    };
  } catch {
    return null;
  }
}

function writeSnapshotCache(info: SnapshotInfo): void {
  try {
    sessionStorage.setItem(
      SNAPSHOT_CACHE_KEY,
      JSON.stringify({...info, ts: Date.now()}),
    );
  } catch {
    // 隐私模式等场景下 sessionStorage 不可写，忽略即可
  }
}

// 菜单里的回退体积为写作时的近似值；动态数据可用时由精确体积替代
export default function DownloadDropdown(): React.ReactElement {
  const [info, setInfo] = useState<SnapshotInfo>(FALLBACK_INFO);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = readSnapshotCache();
    if (cached) {
      setInfo(cached);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetchSnapshotInfo(controller.signal)
      .then((result) => {
        if (result) {
          setInfo(result);
          writeSnapshotCache(result);
        }
        // result 为 null 时保持回退值，不打扰用户
      })
      .catch(() => {});
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // 打开期间监听 Esc / 点击外部关闭；Esc 额外把焦点还给触发按钮
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        rootRef.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className="button button--secondary button--lg"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}>
        <Translate
          id="homepage.downloadNukkitMot"
          description="The homepage message to ask the user to download nukkit-mot">
          🌐 Download
        </Translate>
        <svg
          className={clsx(styles.caret, open && styles.caretOpen)}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className={styles.menu}>
          <Link
            className={styles.item}
            href={info.fullUrl}
            onClick={() => setOpen(false)}>
            <span className={styles.itemIcon} aria-hidden="true">
              📦
            </span>
            <span className={styles.itemBody}>
              <span className={styles.itemTitleRow}>
                <span className={styles.itemTitle}>
                  <Translate
                    id="homepage.download.fullTitle"
                    description="Download menu: full jar title">
                    Standard
                  </Translate>
                </span>
                <span className={styles.itemSize}>
                  {info.fullSizeBytes !== null ? (
                    formatSize(info.fullSizeBytes)
                  ) : (
                    <Translate
                      id="homepage.download.fullSize"
                      description="Download menu: full jar approximate size badge">
                      ≈ 90 MB
                    </Translate>
                  )}
                </span>
              </span>
              <span className={styles.itemDesc}>
                <Translate
                  id="homepage.download.fullDesc"
                  description="Download menu: full jar description">
                  Self-contained with all dependencies — ready to run
                </Translate>
              </span>
            </span>
            <svg
              className={styles.itemArrow}
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
          </Link>
          <Link
            className={styles.item}
            href={info.liteUrl}
            onClick={() => setOpen(false)}>
            <span className={styles.itemIcon} aria-hidden="true">
              🪶
            </span>
            <span className={styles.itemBody}>
              <span className={styles.itemTitleRow}>
                <span className={styles.itemTitle}>
                  <Translate
                    id="homepage.download.liteTitle"
                    description="Download menu: Lite jar title">
                    Lite
                  </Translate>
                </span>
                <span className={styles.itemSize}>
                  {info.liteSizeBytes !== null ? (
                    formatSize(info.liteSizeBytes)
                  ) : (
                    <Translate
                      id="homepage.download.liteSize"
                      description="Download menu: Lite jar approximate size badge">
                      ≈ 14 MB
                    </Translate>
                  )}
                </span>
              </span>
              <span className={styles.itemDesc}>
                <Translate
                  id="homepage.download.liteDesc"
                  description="Download menu: Lite jar description">
                  Downloads dependencies on first start (internet required)
                </Translate>
              </span>
            </span>
            <svg
              className={styles.itemArrow}
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
          </Link>
          {info.buildNumber !== null && (
            <div className={styles.menuFooter}>
              master · #{info.buildNumber}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
