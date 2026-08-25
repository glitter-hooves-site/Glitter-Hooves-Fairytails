// =============================================
// EVENTS DATA — single source of truth.
// Edit here to update both the events list and the booking dropdown.
//
// Dated events use `date: new Date('YYYY-MM-DD')` so we can sort,
// filter past events, and emit structured data for search engines.
// Recurring/undated experiences (Weekly, TBA) omit `date` and use
// `displayMonth`/`displayDay` to control the date-box text.
// =============================================

/** Where an event happens. Most are at the farm, so this is only set on the
 *  exceptions — the display line and the Event JSON-LD both fall back to
 *  FARM_LOCATION when it is absent. Getting this wrong sends people to the
 *  wrong place and puts false structured data in front of Google. */
export interface EventLocation {
  name: string;
  street?: string;
  locality: string;
  region: string;
  postalCode?: string;
}

export const FARM_LOCATION: EventLocation = {
  name: 'Glitter Hooves Farm',
  locality: 'Kittrell',
  region: 'NC',
  postalCode: '27544',
};

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
  /** Only for events NOT at the farm. Defaults to FARM_LOCATION. */
  location?: EventLocation;
}

/** The farm is in Kittrell, NC. Event dates always mean this timezone, never
 *  the timezone of whatever machine happens to run the build. */
const FARM_TZ = 'America/New_York';

/**
 * Build a Date standing for a calendar day, from its 'YYYY-MM-DD' parts.
 *
 * Do not use `new Date('2026-06-27')` for event dates. The ES spec parses a
 * date-only ISO string as UTC midnight, so in any timezone west of UTC it
 * renders as the previous day. Constructing from parts keeps the calendar day
 * intact wherever the code runs.
 *
 * The resulting Date is machine-local midnight, which is deliberate: it makes
 * the display helpers below (`getMonth`, `getDate`, `toLocaleDateString`)
 * report the intended calendar day on any machine. Only "is this event past?"
 * needs true timezone awareness, and that is `todayAtFarm()`'s job.
 */
function localDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Today's calendar date at the farm, as 'YYYY-MM-DD'.
 *
 * The deploy builds on GitHub Actions in UTC, so a plain `new Date()` rolls
 * over to tomorrow at 8pm ET and would retire an event while it is still
 * happening. Asking Intl for the date in FARM_TZ pins it to the farm's own
 * day and handles DST for free. The 'en-CA' locale formats as YYYY-MM-DD.
 */
function todayAtFarm(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FARM_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

const RAW_EVENTS: Event[] = [
  { date: localDate('2026-06-27'), title: 'Founders Fairy & Folklore Farm Day', time: '10am-2pm',       price: '$25/person, or family 4 pack for $75',                              seats: '25 spots left',     rsvpUrl: 'https://www.eventbrite.com/e/founders-fairy-folklore-farm-day-tickets-1990928407461?aff=oddtdtcreator' },
  { date: localDate('2026-06-30'), title: 'Gentle Hooves 4 Week Pilot Programs', time: 'Varies by date', price: '$99',                                                               seats: 'ALMOST FULL!' },
  { date: localDate('2026-07-25'), title: 'Witchy Woodland Farm Night',          time: 'TBA',            price: '$45/person',                                                        seats: '19 spots left',     rsvpUrl: 'https://www.eventbrite.com/e/witchy-woodland-farm-night-tickets-1991739150415?aff=oddtdtcreator' },
  { date: localDate('2026-08-29'), title: 'Chill Act North Carolina — Durham', time: '8 AM – 6 PM',    price: 'Free',                                                             seats: 'Free admission',    rsvpUrl: 'https://www.chillact.com/event-details/chill-act-north-carolina-durham',
    location: { name: 'Durham Convention Center', street: '301 W Morgan St', locality: 'Durham', region: 'NC', postalCode: '27701' } },
  { date: localDate('2026-09-05'), title: 'Splash Into School',                 time: '12–3 PM',        price: '$20/child · adults & under 2 free',                                 seats: '35 tickets available', rsvpUrl: 'https://www.eventbrite.com/e/splash-into-school-tickets-1997153712516' },
  { displayMonth: 'Sundays', displayDay: '', title: 'Teen Reset',                time: '3–5 PM',         price: '$125/month · $110 founding family rate',                            seats: 'Small Group',                 rsvpUrl: 'https://form.jotform.com/261996546533066' },
  { displayMonth: 'Weekly', displayDay: '', title: 'Farm Connection Visits',     time: 'Varies',         price: '$45 includes 1 adult & 1 child · Additional: $30/child, $10/adult', seats: 'Private Experience' },
];

// -------------------- helpers --------------------

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
 * An event's calendar day as 'YYYY-MM-DD', read from local date parts. Used
 * both for schema.org `startDate` and for the past-event comparison below.
 *
 * Not `toISOString()` — that converts to UTC first and can land on the wrong
 * day, the mirror image of the trap `localDate` above exists to avoid.
 */
export function toISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// -------------------- filtering + sorting --------------------

// Events with a date sort chronologically; recurring/undated events go last.
// An event stays listed through the whole of its own day at the farm and drops
// off the following day. Both sides of the comparison are 'YYYY-MM-DD' strings,
// which sort lexicographically the same way they sort chronologically, so this
// is a plain calendar-day comparison with no clock or timezone left in it.
function sortAndFilter(events: Event[]): Event[] {
  const today = todayAtFarm();
  return events
    .filter(ev => !ev.date || toISODate(ev.date) >= today)
    .sort((a, b) => {
      if (a.date && b.date) return a.date.getTime() - b.date.getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });
}

export const EVENTS: Event[] = sortAndFilter(RAW_EVENTS);
