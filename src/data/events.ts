// =============================================
// EVENTS DATA — single source of truth.
// Edit here to update both the events list and the booking dropdown.
//
// Dated events use `date: new Date('YYYY-MM-DD')` so we can sort,
// filter past events, and emit structured data for search engines.
// Recurring/undated experiences (Weekly, TBA) omit `date` and use
// `displayMonth`/`displayDay` to control the date-box text.
// =============================================

export interface Event {
  /** Real date if known. Omit for recurring/undated experiences. */
  date?: Date;
  /** Override for the small top label in the date box (defaults to short month name from `date`). */
  displayMonth?: string;
  /** Override for the large number in the date box (defaults to day-of-month from `date`; empty string hides it). */
  displayDay?: string;

  title: string;
  time: string;
  price: string;
  seats: string;
  rsvpUrl?: string;
}

/**
 * Parse a 'YYYY-MM-DD' string as LOCAL midnight.
 *
 * Do not use `new Date('2026-06-27')` for event dates. The ES spec parses a
 * date-only ISO string as UTC midnight, but everything else here (and
 * `new Date()` for "today") works in local time. In any timezone west of UTC
 * that mismatch shifts the event back a day — an event happening today reads
 * as yesterday and gets filtered out of the list.
 */
function localDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const RAW_EVENTS: Event[] = [
  { date: localDate('2026-06-27'), title: 'Founders Fairy & Folklore Farm Day', time: '10am-2pm',       price: '$25/person, or family 4 pack for $75',                              seats: '25 spots left',     rsvpUrl: 'https://www.eventbrite.com/e/founders-fairy-folklore-farm-day-tickets-1990928407461?aff=oddtdtcreator' },
  { date: localDate('2026-06-30'), title: 'Gentle Hooves 4 Week Pilot Programs', time: 'Varies by date', price: '$99',                                                               seats: 'ALMOST FULL!' },
  { date: localDate('2026-07-25'), title: 'Witchy Woodland Farm Night',          time: 'TBA',            price: '$45/person',                                                        seats: '19 spots left',     rsvpUrl: 'https://www.eventbrite.com/e/witchy-woodland-farm-night-tickets-1991739150415?aff=oddtdtcreator' },
  { displayMonth: 'Weekly', displayDay: '', title: 'Farm Connection Visits',     time: 'Varies',         price: '$45 includes 1 adult & 1 child · Additional: $30/child, $10/adult', seats: 'Private Experience' },
];

// -------------------- helpers --------------------

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function eventMonthLabel(ev: Event): string {
  if (ev.displayMonth !== undefined) return ev.displayMonth;
  if (ev.date) return MONTHS_SHORT[ev.date.getMonth()];
  return '';
}

export function eventDayLabel(ev: Event): string {
  if (ev.displayDay !== undefined) return ev.displayDay;
  if (ev.date) return String(ev.date.getDate());
  return '';
}

/** Format e.g. "Sat, June 27". Only meaningful for dated events. */
export function eventLongDate(ev: Event): string {
  if (!ev.date) return '';
  return ev.date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
}

/**
 * Format as 'YYYY-MM-DD' from LOCAL date parts, for schema.org startDate.
 * Not `toISOString()` — that converts to UTC first and can land on the
 * wrong day, the same trap `localDate` above exists to avoid.
 */
export function toISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// -------------------- filtering + sorting --------------------

// Events with a date sort chronologically; recurring/undated events go last.
// An event stays listed through the whole of its own day and drops off the
// following day (the comparison is `>=` against local midnight today).
function sortAndFilter(events: Event[]): Event[] {
  const today = startOfDay(new Date());
  return events
    .filter(ev => !ev.date || startOfDay(ev.date) >= today)
    .sort((a, b) => {
      if (a.date && b.date) return a.date.getTime() - b.date.getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });
}

export const EVENTS: Event[] = sortAndFilter(RAW_EVENTS);
