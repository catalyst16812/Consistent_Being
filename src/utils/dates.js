// Date helpers — all local-time based, working with 'YYYY-MM-DD' ISO strings.

export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function parseISO(iso) {
  return new Date(`${iso}T00:00:00`);
}

export function addDaysISO(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Monday of the ISO week containing the given date. */
export function weekStartISO(iso) {
  const d = parseISO(iso);
  const diff = (d.getDay() + 6) % 7; // Mon = 0
  d.setDate(d.getDate() - diff);
  return toISODate(d);
}

/** ISO-8601 week key, e.g. "2026-W36" (thursday-of-week algorithm). */
export function isoWeekKey(iso) {
  const d = parseISO(iso);
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff + 3); // the Thursday of this week
  const year = d.getFullYear();
  const firstThursday = new Date(year, 0, 4);
  const ftDiff = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - ftDiff + 3); // Thursday of week 1
  const week = 1 + Math.round((d - firstThursday) / (7 * 86400000));
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function dayLetter(idx) {
  return 'MTWTFSS'[idx];
}

export function formatShort(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatLong(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateWithYear(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
