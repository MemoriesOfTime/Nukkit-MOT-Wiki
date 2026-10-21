import { ReactNode, useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getDateParts } from '@site/src/utils/dateParts';

// 1024 程序员节：10 月 24 日，取自 2¹⁰ = 1024 = 1 KiB。
// 这是中国开发者社区的非官方节日，因此只在中文页面启用；
function isProgrammersDay1024(): boolean {
  const { month, day } = getDateParts('Asia/Shanghai');
  return month === 10 && day === 24;
}

// 二进制雨：固定参数，保证 SSG 与客户端水合结果一致
const BITS = [
  { left: '2%', glyph: '1', size: 13, duration: 15, delay: 0, color: '#ffb454' },
  { left: '8%', glyph: '0', size: 10, duration: 19, delay: -7, color: '#a86a24' },
  { left: '15%', glyph: '1', size: 9, duration: 12, delay: -3, color: '#f0a04b' },
  { left: '22%', glyph: '0', size: 14, duration: 17, delay: -11, color: '#ffb454' },
  { left: '29%', glyph: '1', size: 11, duration: 14, delay: -5, color: '#d9822b' },
  { left: '36%', glyph: '0', size: 12, duration: 20, delay: -9, color: '#a86a24' },
  { left: '43%', glyph: '1', size: 10, duration: 13, delay: -14, color: '#ffb454' },
  { left: '50%', glyph: '0', size: 13, duration: 16, delay: -2, color: '#f0a04b' },
  { left: '57%', glyph: '1', size: 8, duration: 11, delay: -8, color: '#d9822b' },
  { left: '64%', glyph: '0', size: 12, duration: 18, delay: -12, color: '#a86a24' },
  { left: '71%', glyph: '1', size: 14, duration: 15, delay: -4, color: '#ffb454' },
  { left: '78%', glyph: '0', size: 9, duration: 13, delay: -10, color: '#f0a04b' },
  { left: '85%', glyph: '1', size: 11, duration: 21, delay: -6, color: '#d9822b' },
  { left: '91%', glyph: '0', size: 10, duration: 16, delay: -13, color: '#a86a24' },
  { left: '96%', glyph: '1', size: 13, duration: 12, delay: -1, color: '#ffb454' },
];

export default function ProgrammersDay1024Theme(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ?1024 — 节日当天之外的预览入口，仅开发服务器可用；
    // 生产构建中 NODE_ENV 已内联为 production，访客无法靠查询参数强行触发
    const preview =
      process.env.NODE_ENV === 'development' &&
      new URLSearchParams(window.location.search).has('1024');
    setVisible(i18n.currentLocale === 'zh' && (preview || isProgrammersDay1024()));
  }, [i18n.currentLocale]);

  if (!visible) return null;

  return (
    <>
      <div className="programmers-day-1024-banner" role="note" title="2¹⁰ = 1024 = 0x400 = 1 KiB">
        <span className="programmers-day-1024-prompt" aria-hidden="true">
          $
        </span>
        1024 · 程序员节快乐
        <span className="programmers-day-1024-banner-extra">2¹⁰ = 1024 · 1 KiB = 1024 B</span>
        <span className="programmers-day-1024-cursor" aria-hidden="true">
          ▊
        </span>
      </div>
      <div className="programmers-day-1024-bits" aria-hidden="true">
        {BITS.map((bit, index) => (
          <span
            key={index}
            style={{
              left: bit.left,
              color: bit.color,
              fontSize: bit.size,
              animationDuration: `${bit.duration}s`,
              animationDelay: `${bit.delay}s`,
            }}>
            {bit.glyph}
          </span>
        ))}
      </div>
    </>
  );
}
