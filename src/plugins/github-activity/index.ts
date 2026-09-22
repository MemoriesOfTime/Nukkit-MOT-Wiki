import fs from 'node:fs/promises';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';
import {
  EMPTY_DATA,
  GH_ENDPOINTS,
  countContributors,
  ghApiFetch,
  normalizeCommits,
  normalizeRepo,
  normalizeTags,
  type NkmotActivityData,
} from '../../utils/githubActivityData';

/**
 * 构建时采集 Nukkit-MOT 仓库（GitHub API）的近期开发动态快照。
 *
 * 现在页面数据以浏览器端自动刷新为主（见 src/utils/githubActivityClient.ts），
 * 本插件提供的构建时快照用于：
 * - SSR 首屏内容与 SEO（无 JS 环境也有完整数据）；
 * - 访客触发 GitHub 限流 / 断网时的兜底展示。
 *
 * - 支持 GITHUB_TOKEN 环境变量提高速率上限（仅直连 api.github.com 时生效；
 *   GH_API_BASE 指向中转时 Token 由 Worker 注入，客户端携带的凭证不会转发）；
 * - 每次成功采集后写入 .docusaurus/github-activity-cache.json，
 *   构建机网络失败（离线构建 / 触发限流）时回退到上次缓存。
 */

export default function githubActivityPlugin(
  context: LoadContext,
): Plugin<NkmotActivityData> {
  const cachePath = path.join(
    context.siteDir,
    '.docusaurus',
    'github-activity-cache.json',
  );

  return {
    name: 'github-activity',
    async loadContent() {
      const token = process.env.GITHUB_TOKEN;
      try {
        const [repo, commitsRaw, tagsRaw, contributorsRaw] = await Promise.all([
          ghApiFetch(GH_ENDPOINTS.repo, {token}),
          ghApiFetch(GH_ENDPOINTS.commits, {token}),
          ghApiFetch(GH_ENDPOINTS.tags, {token}),
          ghApiFetch(GH_ENDPOINTS.contributors, {token}),
        ]);
        const data: NkmotActivityData = {
          repo: normalizeRepo(repo.json),
          commits: normalizeCommits(commitsRaw.json),
          tags: normalizeTags(tagsRaw.json),
          contributorsTotal: countContributors(contributorsRaw.json),
          fetchedAt: new Date().toISOString(),
          stale: false,
        };
        await writeCache(cachePath, data);
        return data;
      } catch (err) {
        console.warn(
          '[github-activity] GitHub API 采集失败，尝试使用上次缓存：',
          err instanceof Error ? err.message : err,
        );
        const cached = await readCache(cachePath);
        if (cached) {
          return {...cached, stale: true};
        }
        console.warn('[github-activity] 无可用缓存，/activity 页面将展示空状态。');
        return {...EMPTY_DATA, fetchedAt: new Date().toISOString()};
      }
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
}

async function readCache(file: string): Promise<NkmotActivityData | null> {
  try {
    const raw = await fs.readFile(file, 'utf8');
    const data = JSON.parse(raw) as NkmotActivityData;
    if (!data || !Array.isArray(data.commits)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

async function writeCache(file: string, data: NkmotActivityData): Promise<void> {
  try {
    await fs.mkdir(path.dirname(file), {recursive: true});
    await fs.writeFile(file, JSON.stringify(data), 'utf8');
  } catch {
    // 缓存写失败不影响构建
  }
}
