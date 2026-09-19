import { ReactNode, useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { languageRedirects } from '@site/src/redirects';
import styles from './index.module.css';

// 浏览器语言与站点语言不一致时，在英文版页面底部弹出的切换引导。
// 与首页 redirectToLanguageVersion 互补：首页自动跳转，其余页面改为提示。

// 文案按目标语言写死，不走 <Translate>：提示条只出现在英文版页面上，
// 翻译组件只会取当前页面语言（en），无法给中文/俄语用户显示母语文案
const HINT_TEXTS: Record<string, { text: string; button: string; close: string }> = {
  zh: {
    text: '本站提供中文版本',
    button: '切换到中文',
    close: '关闭',
  },
  ru: {
    text: 'Сайт доступен на русском языке',
    button: 'Переключиться',
    close: 'Закрыть',
  },
};

const FALLBACK_TEXT = {
  text: 'This site is available in your language',
  button: 'Switch',
  close: 'Close',
};

const DISMISSED_KEY = 'languageSwitchHintDismissed';

// 晚于首页 redirectToLanguageVersion 的整页跳转，避免提示条在跳转前闪现
const SHOW_DELAY_MS = 900;

function matchTargetLanguage(): string | null {
  const userLanguage = navigator.language;
  const target = Object.keys(languageRedirects).find((lang) =>
    userLanguage.startsWith(lang)
  );
  return target ?? null;
}

export default function LanguageSwitchHint(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    // dev 下预览：?language-hint 强制显示中文示例，仅用于调整样式
    const preview =
      process.env.NODE_ENV === 'development' &&
      new URLSearchParams(window.location.search).has('language-hint');
    if (preview) {
      const timer = setTimeout(() => setTarget('zh'), SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
    // 与 redirectToLanguageVersion 一致仅生产构建生效：
    // dev 服务器的 locale 没有路径前缀，跳转会 404
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    // 只在默认英文版提示，zh/ru 版页面不再打扰
    if (i18n.currentLocale !== 'en') {
      return;
    }
    if (localStorage.getItem(DISMISSED_KEY) === 'true') {
      return;
    }
    const matched = matchTargetLanguage();
    if (!matched) {
      return;
    }
    const timer = setTimeout(() => setTarget(matched), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [i18n.currentLocale]);

  if (!target) {
    return null;
  }

  const texts = HINT_TEXTS[target] ?? FALLBACK_TEXT;

  const switchLanguage = () => {
    // 已切换过视为知晓，之后回到英文版不再提示
    localStorage.setItem(DISMISSED_KEY, 'true');
    window.location.assign(
      `/${target}${window.location.pathname}${window.location.search}`
    );
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setTarget(null);
  };

  return (
    <div className={styles.hint} role="status" aria-label={texts.text}>
      <span className={styles.globe} aria-hidden="true">🌐</span>
      <span className={styles.text}>{texts.text}</span>
      <button type="button" className={styles.switchButton} onClick={switchLanguage}>
        {texts.button}
      </button>
      <button
        type="button"
        className={styles.closeButton}
        onClick={dismiss}
        aria-label={texts.close}>
        ✕
      </button>
    </div>
  );
}
