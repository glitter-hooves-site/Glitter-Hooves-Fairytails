// =============================================
// EVENTS DATA — single source of truth.
// Edit here to update both the events list and the booking dropdown.
// =============================================
export interface Event {
  month: string;
  day: string;
  title: string;
  time: string;
  price: string;
  seats: string;
  rsvpUrl?: string;
}

export const EVENTS: Event[] = [
  { month: 'June',            day: '27',  title: 'Founders Fairy & Folklore Farm Day', time: '10am-2pm',       price: '$25/person, or family 4 pack for $75',                  seats: '25 spots left',     rsvpUrl: 'https://www.eventbrite.com/e/founders-fairy-folklore-farm-day-tickets-1990928407461?aff=oddtdtcreator' },
  { month: 'July',            day: '25',  title: 'Witchy Woodland Farm Night',          time: 'TBA',            price: '$45/person',                                            seats: 'Open',              rsvpUrl: 'https://www.eventbrite.com/e/witchy-woodland-farm-night-tickets-1991739150415?aff=oddtdtcreator' },
  { month: 'June',            day: '30',  title: 'Gentle Hooves 4 Week Pilot Programs', time: 'Varies by date', price: '$99',                                                   seats: 'ALMOST FULL!' },
  { month: 'Weekly',          day: '',    title: 'Farm Connection Visits',              time: 'Varies',         price: '$45 includes 1 adult & 1 child · Additional: $30/child, $10/adult', seats: 'Private Experience' },
];
