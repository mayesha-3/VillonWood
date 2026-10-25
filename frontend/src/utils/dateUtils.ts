/**
 * UTC / GMT Date utilities for VillonWood
 */

/**
 * Returns today's date in 'YYYY-MM-DD' format using UTC
 */
export function getTodayUTC(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

/**
 * Returns ISO week ID in UTC like '2026-W42'
 */
export function getWeekIdUTC(d: Date = new Date()): string {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = target.getUTCDay() === 0 ? 7 : target.getUTCDay();
  target.setUTCDate(target.getUTCDate() + 4 - dayNr);
  const year = target.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((target.getTime() - jan1.getTime()) / 86400000) + 1;
  const weekNr = Math.ceil(dayOfYear / 7);
  return `${year}-W${String(weekNr).padStart(2, '0')}`;
}

/**
 * Checks if current day is Monday (day 1) in UTC
 */
export function isMondayUTC(d: Date = new Date()): boolean {
  return d.getUTCDay() === 1;
}

/**
 * Formats a YYYY-MM-DD string into a friendly localized display
 */
export function formatDisplayDate(dateStr: string, locale: string = 'fr'): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
