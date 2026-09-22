/**
 * Nukkit-MOT GitHub 动态数据的共享类型、端点与规整逻辑。
 * 同时被两方使用：
 * - 构建时插件（src/plugins/github-activity，经 jiti 以 Node 运行）
 * - 浏览器端自动刷新（src/utils/githubActivityClient）
 * 因此本文件不得引入 Node 专属或 DOM 专属 API。
 */

const REPO_OWNER = 'MemoriesOfTime';
const REPO_NAME = 'Nukkit-MOT';

export type NkmotCommit = {
  sha: string;
  htmlUrl: string;
  title: string;
  authorLogin: string | null;
  authorHtmlUrl: string | null;
  date: string;
};

export type NkmotTag = {
  name: string;
  commitSha: string;
  commitHtmlUrl: string;
};

export type NkmotRepoStats = {
  fullName: string;
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string;
};

export type NkmotActivityData = {
  repo: NkmotRepoStats | null;
  commits: NkmotCommit[];
  tags: NkmotTag[];
  /** 全部贡献者数量（GitHub /contributors 端点返回的条目数） */
  contributorsTotal: number | null;
  fetchedAt: string;
  /** true 表示数据来自回退（缓存/快照），可能过期 */
  stale: boolean;
};

export const EMPTY_DATA: NkmotActivityData = {
  repo: null,
  commits: [],
  tags: [],
  contributorsTotal: null,
  fetchedAt: '',
  stale: true,
};

/** GitHub API 端点路径 */
export const GH_ENDPOINTS = {
  repo: `/repos/${REPO_OWNER}/${REPO_NAME}`,
  commits: `/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=100`,
  tags: `/repos/${REPO_OWNER}/${REPO_NAME}/tags?per_page=5`,
  contributors: `/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100&anon=1`,
} as const;

export type GhEndpointKey = keyof typeof GH_ENDPOINTS;

export type GhApiResult = {
  /** 200 = 有新内容（json 已解析）；304 = 未变化（命中 ETag，不消耗速率配额） */
  status: 200 | 304;
  json?: unknown;
  etag?: string;
};

/**
 * GitHub API 基址。
 * - 中转（gh-info-api-nkmot，Cloudflare Worker）：注入 Token 提额（5000 次/小时）、
 *   全站访客共享 5 分钟边缘缓存、透传 If-None-Match；自定义域名大陆可达；
 * - 直连 api.github.com（匿名 60 次/小时/IP）作为回退：中转下线时注释对调两行即可。
 */
export const GH_API_BASE = 'https://gh-info-api.nkmot.com/github';
// export const GH_API_BASE = 'https://api.github.com';

/** 调用 GitHub REST API；etag 传入时发送 If-None-Match 条件请求 */
export async function ghApiFetch(
  pathname: string,
  opts: {etag?: string; token?: string; signal?: AbortSignal} = {},
): Promise<GhApiResult> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (opts.etag) {
    headers['If-None-Match'] = opts.etag;
  }
  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`;
  }
  const res = await fetch(`${GH_API_BASE}${pathname}`, {
    headers,
    signal: opts.signal,
  });
  if (res.status === 304) {
    return {status: 304, etag: opts.etag};
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${pathname} -> HTTP ${res.status}`);
  }
  return {status: 200, json: await res.json(), etag: res.headers.get('etag') ?? undefined};
}

export function firstLine(message: unknown): string {
  if (typeof message !== 'string') {
    return '';
  }
  const title = message.split('\n', 1)[0].trim();
  return title.length > 160 ? `${title.slice(0, 159)}…` : title;
}

export function normalizeCommits(raw: unknown): NkmotCommit[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const commits: NkmotCommit[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const c = item as Record<string, unknown>;
    const sha = typeof c.sha === 'string' ? c.sha : null;
    const commit = c.commit as Record<string, unknown> | undefined;
    const message = firstLine(commit?.message);
    const committer = commit?.committer as Record<string, unknown> | undefined;
    const date = typeof committer?.date === 'string' ? committer.date : '';
    if (!sha || !date) {
      continue;
    }
    const author = (c.author ?? null) as Record<string, unknown> | null;
    commits.push({
      sha,
      htmlUrl:
        typeof c.html_url === 'string'
          ? c.html_url
          : `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${sha}`,
      title: message || sha.slice(0, 7),
      authorLogin: typeof author?.login === 'string' ? author.login : null,
      authorHtmlUrl: typeof author?.html_url === 'string' ? author.html_url : null,
      date,
    });
  }
  return commits;
}

export function normalizeTags(raw: unknown): NkmotTag[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const tags: NkmotTag[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const t = item as Record<string, unknown>;
    const name = typeof t.name === 'string' ? t.name : null;
    const commit = t.commit as Record<string, unknown> | undefined;
    const sha = typeof commit?.sha === 'string' ? commit.sha : null;
    if (!name || !sha) {
      continue;
    }
    tags.push({
      name,
      commitSha: sha,
      commitHtmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${sha}`,
    });
  }
  return tags;
}

export function normalizeRepo(raw: unknown): NkmotRepoStats | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const r = raw as Record<string, unknown>;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  return {
    fullName: typeof r.full_name === 'string' ? r.full_name : `${REPO_OWNER}/${REPO_NAME}`,
    htmlUrl:
      typeof r.html_url === 'string'
        ? r.html_url
        : `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
    stars: num(r.stargazers_count),
    forks: num(r.forks_count),
    openIssues: num(r.open_issues_count),
    pushedAt: typeof r.pushed_at === 'string' ? r.pushed_at : '',
  };
}

export function countContributors(raw: unknown): number | null {
  if (!Array.isArray(raw)) {
    return null;
  }
  return raw.length;
}
