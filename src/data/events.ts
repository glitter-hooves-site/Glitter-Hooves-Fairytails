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
}

export const EVENTS: Event[] = [
  { month: 'June',            day: '27',  title: 'Founders Fairy & Folklore Farm Day', time: '10am-2pm',       price: '$25/person, or family 4 pack for $75',                  seats: '25 spots left' },
  { month: 'June',            day: '30',  title: 'Gentle Hooves 4 Week Pilot Programs', time: 'Varies by date', price: '$99',                                                   seats: 'ALMOST FULL!' },
  { month: 'Year-Round',      day: 'Weekly', title: 'Farm Connection Visits',           time: 'Varies',         price: '$45/person, $10/additional child, $5 additional adult', seats: 'Private Experience' },
];
