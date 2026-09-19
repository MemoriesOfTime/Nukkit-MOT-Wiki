import { ReactNode, useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getDateParts } from '@site/src/utils/dateParts';

// Minecraft 生日：2009 年 5 月 17 日（rd-132211）首次公开发布。
// 全站内容都围绕 Minecraft，因此不分语言，所有语言页面一起庆祝；
// 不指定时区 = 按访客本地日期判断——生日跟着访客走。
function isMinecraftBirthday(): boolean {
  const { month, day } = getDateParts();
  return month === 5 && day === 17;
}

// 像素雨：固定参数，保证渲染输出确定
const PIXELS = [
  { left: '3%', color: '#5D9C3F', size: 12, duration: 14, delay: 0 }, // 草方块
  { left: '10%', color: '#4AEDD9', size: 8, duration: 18, delay: -6 }, // 钻石
  { left: '17%', color: '#F9C638', size: 10, duration: 12, delay: -3 }, // 金锭
  { left: '24%', color: '#E03E3E', size: 8, duration: 20, delay: -12 }, // 红石
  { left: '31%', color: '#345EC3', size: 12, duration: 15, delay: -8 }, // 青金石
  { left: '38%', color: '#41F384', size: 9, duration: 13, delay: -5 }, // 绿宝石
  { left: '45%', color: '#5D9C3F', size: 8, duration: 19, delay: -14 },
  { left: '52%', color: '#4AEDD9', size: 11, duration: 11, delay: -2 },
  { left: '59%', color: '#F9C638', size: 12, duration: 16, delay: -9 },
  { left: '66%', color: '#E03E3E', size: 9, duration: 14, delay: -4 },
  { left: '73%', color: '#345EC3', size: 8, duration: 21, delay: -11 },
  { left: '80%', color: '#41F384', size: 12, duration: 12, delay: -7 },
  { left: '87%', color: '#5D9C3F', size: 10, duration: 17, delay: -13 },
  { left: '93%', color: '#4AEDD9', size: 9, duration: 13, delay: -1 },
  { left: '97%', color: '#F9C638', size: 8, duration: 15, delay: -10 },
];

function ordinalEn(n: number): string {
  const rem10 = n % 10;
  const rem100 = n % 100;
  if (rem10 === 1 && rem100 !== 11) return `${n}st`;
  if (rem10 === 2 && rem100 !== 12) return `${n}nd`;
  if (rem10 === 3 && rem100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function bannerText(locale: string, age: number): { main: string; extra: string } {
  switch (locale) {
    case 'zh':
      return { main: `🎂 Minecraft ${age} 岁生日快乐！`, extra: '2009-05-17 首次公开发布' };
    case 'ru':
      // «С 17-летием» — склонение не зависит от числа, в отличие от «17 лет / 21 год»
      return { main: `🎂 С ${age}-летием, Minecraft!`, extra: 'Первый публичный релиз · 17.05.2009' };
    default:
      return { main: `🎂 Happy ${ordinalEn(age)} birthday, Minecraft!`, extra: 'First public release · 17 May 2009' };
  }
}

// 苦力怕脸：8×8 像素画，经典黑眼 + 凹字形嘴
function CreeperFace(): ReactNode {
  return (
    <svg className="minecraft-birthday-creeper" viewBox="0 0 8 8" aria-hidden="true">
      <rect width="8" height="8" fill="#59A843" />
      <rect x="1" y="2" width="2" height="2" fill="#10160F" />
      <rect x="5" y="2" width="2" height="2" fill="#10160F" />
      <rect x="3" y="4" width="2" height="2" fill="#10160F" />
      <rect x="2" y="5" width="4" height="2" fill="#10160F" />
      <rect x="2" y="7" width="1" height="1" fill="#10160F" />
      <rect x="5" y="7" width="1" height="1" fill="#10160F" />
    </svg>
  );
}

export default function MinecraftBirthdayTheme(): ReactNode {
  const { i18n } = useDocusaurusContext();
  // 与 ProgrammersDayTheme 相同：仅在客户端挂载后判定日期，
  // 避免 SSG 产物固化构建当天的判定结果
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ?minecraft-birthday — 节日当天之外的预览入口，仅在开发服务器可用；
    // 生产构建中 NODE_ENV 已内联为 production，访客无法用查询参数强行触发彩蛋
    const preview =
      process.env.NODE_ENV === 'development' &&
      new URLSearchParams(window.location.search).has('minecraft-birthday');
    setVisible(preview || isMinecraftBirthday());
  }, []);

  if (!visible) return null;

  const age = new Date().getFullYear() - 2009;
  const { main, extra } = bannerText(i18n.currentLocale, age);

  return (
    <>
      <div className="minecraft-birthday-banner" role="note" title="2009-05-17 · rd-132211">
        <CreeperFace />
        <span>{main}</span>
        <span className="minecraft-birthday-banner-extra">{extra}</span>
        <CreeperFace />
      </div>
      <div className="minecraft-birthday-pixels" aria-hidden="true">
        {PIXELS.map((pixel, index) => (
          <span
            key={index}
            style={{
              left: pixel.left,
              width: pixel.size,
              height: pixel.size,
              background: pixel.color,
              boxShadow: `0 0 8px ${pixel.color}8C`,
              animationDuration: `${pixel.duration}s`,
              animationDelay: `${pixel.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
