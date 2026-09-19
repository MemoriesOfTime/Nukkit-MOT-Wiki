import { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getDateParts } from '@site/src/utils/dateParts';

// 以北京时间判断是否为 10 月 1 日（国庆节）

// 金星飘落：固定参数避免 SSR 与客户端水合不一致
const STARS = [
  { left: '3%', size: 12, duration: 13, delay: 0 },
  { left: '11%', size: 9, duration: 17, delay: -6 },
  { left: '19%', size: 14, duration: 11, delay: -3 },
  { left: '28%', size: 8, duration: 19, delay: -12 },
  { left: '37%', size: 11, duration: 15, delay: -8 },
  { left: '46%', size: 13, duration: 12, delay: -5 },
  { left: '55%', size: 9, duration: 18, delay: -14 },
  { left: '63%', size: 14, duration: 10, delay: -2 },
  { left: '72%', size: 10, duration: 16, delay: -9 },
  { left: '81%', size: 12, duration: 14, delay: -4 },
  { left: '89%', size: 8, duration: 20, delay: -11 },
  { left: '96%', size: 11, duration: 15, delay: -7 },
];

export default function NationalDayTheme(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const isChinese = i18n.currentLocale === 'zh';
  const { month, day, year } = getDateParts('Asia/Shanghai');
  const active = isChinese && month === 10 && day === 1;

  if (!active) return null;

  const anniversary = year - 1949;
  return (
    <>
      <div className="national-day-banner" role="note">
        <span className="national-day-banner-star" aria-hidden="true">★</span>
        国庆快乐！祖国{anniversary}岁生日快乐～
        <span className="national-day-banner-star" aria-hidden="true">★</span>
        <div className="national-day-lantern national-day-lantern--left" aria-hidden="true">
          <div className="national-day-lantern-string" />
          <div className="national-day-lantern-body" />
          <div className="national-day-lantern-tassel" />
        </div>
        <div className="national-day-lantern national-day-lantern--right" aria-hidden="true">
          <div className="national-day-lantern-string" />
          <div className="national-day-lantern-body" />
          <div className="national-day-lantern-tassel" />
        </div>
      </div>
      <div className="national-day-stars" aria-hidden="true">
        {STARS.map((star, index) => (
          <span
            key={index}
            style={{
              left: star.left,
              fontSize: star.size,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}>
            ★
          </span>
        ))}
      </div>
    </>
  );
}
