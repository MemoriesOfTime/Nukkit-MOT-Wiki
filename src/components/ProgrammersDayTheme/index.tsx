import { ReactNode, useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getDateParts } from '@site/src/utils/dateParts';

// День программиста: 256-й день года (2⁸) — 13 сентября, в високосный год 12 сентября.
// Официально в России с 2009 года, отмечается ИТ-сообществом во всех русскоязычных странах.
function isProgrammersDay(): boolean {
  const { month, day, year } = getDateParts('Europe/Moscow');
  // Date(year, 0, 256) — 256-й день года, високосность учитывается автоматически
  const target = new Date(year, 0, 256);
  return month === target.getMonth() + 1 && day === target.getDate();
}

// Символьный дождь: фиксированные параметры, чтобы разметка не зависела от случайности
const GLYPHS = [
  { left: '2%', glyph: '0', color: '#79c0ff', size: 12, duration: 16, delay: 0 },
  { left: '9%', glyph: '{', color: '#7ee787', size: 14, duration: 12, delay: -7 },
  { left: '16%', glyph: '1', color: '#d2a8ff', size: 9, duration: 19, delay: -3 },
  { left: '23%', glyph: ';', color: '#ffa657', size: 11, duration: 14, delay: -11 },
  { left: '30%', glyph: '}', color: '#79c0ff', size: 10, duration: 17, delay: -5 },
  { left: '37%', glyph: '=', color: '#7ee787', size: 13, duration: 13, delay: -9 },
  { left: '44%', glyph: '0', color: '#d2a8ff', size: 8, duration: 21, delay: -14 },
  { left: '51%', glyph: '<', color: '#ffa657', size: 12, duration: 15, delay: -2 },
  { left: '58%', glyph: '1', color: '#79c0ff', size: 14, duration: 11, delay: -8 },
  { left: '65%', glyph: '>', color: '#7ee787', size: 9, duration: 18, delay: -12 },
  { left: '72%', glyph: '#', color: '#d2a8ff', size: 11, duration: 16, delay: -4 },
  { left: '79%', glyph: '0', color: '#ffa657', size: 12, duration: 13, delay: -10 },
  { left: '86%', glyph: '{', color: '#79c0ff', size: 10, duration: 20, delay: -6 },
  { left: '93%', glyph: '1', color: '#7ee787', size: 13, duration: 12, delay: -13 },
  { left: '97%', glyph: '}', color: '#d2a8ff', size: 9, duration: 17, delay: -1 },
];

export default function ProgrammersDayTheme(): ReactNode {
  const { i18n } = useDocusaurusContext();
  // Проверяем дату только на клиенте после монтирования:
  // SSG-HTML собирается заранее, дата визита в нём не совпадает с датой сборки
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ?programmers-day — предпросмотр вне праздничной даты; работает только
    // на dev-сервере: в продакшен-сборке NODE_ENV вшит как production, параметр игнорируется
    const preview =
      process.env.NODE_ENV === 'development' &&
      new URLSearchParams(window.location.search).has('programmers-day');
    setVisible(i18n.currentLocale === 'ru' && (preview || isProgrammersDay()));
  }, [i18n.currentLocale]);

  if (!visible) return null;

  return (
    <>
      <div
        className="programmers-day-banner"
        role="note"
        title="256 = 100000000₂ — не влезает в один байт">
        <span className="programmers-day-banner-tag" aria-hidden="true">{'</>'}</span>
        С Днём программиста!
        <span className="programmers-day-banner-extra">2⁸ = 256 · 100000000₂ · 256-й день года</span>
        <span className="programmers-day-banner-tag" aria-hidden="true">{'</>'}</span>
        <span className="programmers-day-cursor" aria-hidden="true">▊</span>
      </div>
      <div className="programmers-day-rain" aria-hidden="true">
        {GLYPHS.map((glyph, index) => (
          <span
            key={index}
            style={{
              left: glyph.left,
              color: glyph.color,
              fontSize: glyph.size,
              animationDuration: `${glyph.duration}s`,
              animationDelay: `${glyph.delay}s`,
            }}>
            {glyph.glyph}
          </span>
        ))}
      </div>
    </>
  );
}
