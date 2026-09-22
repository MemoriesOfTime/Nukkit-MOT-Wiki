// 解析当前日期的年/月/日数字，月份为 1 基（5 月 = 5），区别于 Date#getMonth() 的 0 基。
// 传 timeZone 则按指定时区取值（如 'Asia/Shanghai'），不传则按访客本地时区。
export function getDateParts(timeZone?: string): { month: number; day: number; year: number } {
  const parts = new Intl.DateTimeFormat(
    'en-US',
    timeZone
      ? { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }
      : { year: 'numeric', month: 'numeric', day: 'numeric' },
  ).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { month: get('month'), day: get('day'), year: get('year') };
}

// 站点 locale（en/zh/ru）→ Intl.BCP 47 语言标签
export function localeTag(locale: string): string {
  return locale === 'zh' ? 'zh-CN' : locale === 'ru' ? 'ru-RU' : 'en-US';
}
