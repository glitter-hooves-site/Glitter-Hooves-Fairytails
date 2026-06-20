// =============================================
// PHOTO DATA — single source of truth for image
// galleries on the site.
//
// HOW TO ADD A PHOTO:
//   1. Drop the file into the matching subfolder
//      under public/images/ (e.g. public/images/farm/).
//   2. Add a new entry below referencing that path
//      with a short descriptive alt text.
//
// NAMING: lowercase-with-hyphens.jpg, no spaces.
// =============================================

export interface Photo {
  src: string;
  alt: string;
}

// Horizontal scroller on the homepage ("Life on the Farm").
// Order matters — first photos appear leftmost.
export const FARM_PHOTOS: Photo[] = [
  { src: '/images/farm/petunia-and-piper.jpeg', alt: 'Petunia and Piper butting heads at play' },
  { src: '/images/farm/piper-and-emma.jpeg',    alt: 'Emma snuggling Piper the goat' },
  { src: '/images/farm/3.jpeg',                 alt: 'Life on the farm' },
  { src: '/images/farm/4.jpeg',                 alt: 'Life on the farm' },
];

// Photos on the About page, rendered as a collage.
// First photo is featured larger; the rest fill a grid below.
// TODO: replace placeholder alt text with descriptions of what's in each photo.
export const ABOUT_PHOTOS: Photo[] = [
  { src: '/images/about/1.jpeg', alt: 'Glitter Hooves & Fairytails moment' },
  { src: '/images/about/2.jpeg', alt: 'Glitter Hooves & Fairytails moment' },
  { src: '/images/about/3.jpeg', alt: 'Glitter Hooves & Fairytails moment' },
  { src: '/images/about/4.jpeg', alt: 'Glitter Hooves & Fairytails moment' },
];
