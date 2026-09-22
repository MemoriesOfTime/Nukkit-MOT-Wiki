import {
  GH_ENDPOINTS,
  countContributors,
  ghApiFetch,
  normalizeCommits,
  normalizeRepo,
  normalizeTags,
  type GhEndpointKey,
  type NkmotActivityData,
} from '@site/src/utils/githubActivityData';

/**
 * 浏览器端自动刷新 Nukkit-MOT GitHub 动态：
 * - localStorage 缓存（CACHE_TTL_MS 内直接使用缓存，不发请求）；
 * - ETag 条件请求：GitHub 对 304 响应不消耗速率配额，匿名限流下也能长期轮询；
 * - commits 为必需数据，repo/tags/contributors 失败时逐项回退到 fallback（构建时快照）。
 */

const STORAGE_KEY = 'nkmot-activity-cache-v1';
export const CACHE_TTL_MS = 10 * 60 * 1000;

export type LocalActivityCache = {
  version: 1;
  savedAt: number;
  etags: Partial<Record<GhEndpointKey, string>>;
  data: NkmotActivityData;
};

export function readLocalActivityCache(): LocalActivityCache | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as LocalActivityCache;
    if (parsed?.version !== 1 || !parsed.data || !Array.isArray(parsed.data.commits)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeLocalActivityCache(cache: LocalActivityCache): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // 隐私模式等存储不可用场景：静默跳过
  }
}

export type LiveFetchResult = {
  data: NkmotActivityData;
  /** 供下次条件请求使用的缓存 */
  cache: LocalActivityCache;
};

export async function fetchLiveActivity(
  fallback: NkmotActivityData,
  cache: LocalActivityCache | null,
  signal?: AbortSignal,
): Promise<LiveFetchResult> {
  const token = undefined; // 公开站点绝不携带凭据
  const settled = await Promise.allSettled([
    ghApiFetch(GH_ENDPOINTS.repo, {etag: cache?.etags.repo, token, signal}),
    ghApiFetch(GH_ENDPOINTS.commits, {etag: cache?.etags.commits, token, signal}),
    ghApiFetch(GH_ENDPOINTS.tags, {etag: cache?.etags.tags, token, signal}),
    ghApiFetch(GH_ENDPOINTS.contributors, {etag: cache?.etags.contributors, token, signal}),
  ]);

  const [repo, commits, tags, contributors] = settled;
  // 提交列表是页面核心；其获取失败（限流/断网）视为整体失败，由调用方回退
  if (commits.status === 'rejected') {
    throw commits.reason instanceof Error ? commits.reason : new Error('commits unavailable');
  }

  const etags: LocalActivityCache['etags'] = {...cache?.etags};
  const pick = <T,>(
    result: PromiseSettledResult<{status: 200 | 304; json?: unknown; etag?: string}>,
    parse: (json: unknown) => T,
    previous: T,
    key: GhEndpointKey,
  ): T => {
    if (result.status === 'fulfilled') {
      etags[key] = result.value.etag;
      if (result.value.status === 200) {
        return parse(result.value.json);
      }
      return previous;
    }
    return previous;
  };

  const data: NkmotActivityData = {
    repo: pick(repo, normalizeRepo, fallback.repo, 'repo'),
    commits: normalizeCommits(commits.value.json) || (cache?.data.commits ?? fallback.commits),
    tags: pick(tags, normalizeTags, fallback.tags, 'tags'),
    contributorsTotal: pick(
      contributors,
      countContributors,
      fallback.contributorsTotal,
      'contributors',
    ),
    fetchedAt: new Date().toISOString(),
    stale: false,
  };

  return {
    data,
    cache: {version: 1, savedAt: Date.now(), etags, data},
  };
}
