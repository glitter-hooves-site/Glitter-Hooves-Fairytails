// =============================================
// PHOTO DATA — single source of truth for image galleries.
//
// HOW TO ADD A PHOTO:
//   1. Drop the file into the matching subfolder under
//      src/assets/images/ (e.g. src/assets/images/farm/).
//   2. Add one line to the relevant array below.
//
// Files live under src/assets/ (NOT public/) so Astro's <Image>
// component can resize them, convert them to WebP, and stamp
// width/height on the tag. Anything in public/ is served raw at full
// size, which is how the About page once shipped a 4.8 MB photo into a
// 160px slot.
//
// NAMING: lowercase-with-hyphens.jpg, no spaces.
// =============================================

import type { ImageMetadata } from 'astro';

/**
 * Every image under src/assets/images, keyed by its path relative to
 * this file. `eager` resolves them at build time so the arrays below can
 * hold real ImageMetadata rather than promises.
 */
const IMAGES = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

/**
 * Look up an image by its path under src/assets/images/.
 *
 * Throws at build time on a typo or a missing file, and lists what is
 * actually available. A silent miss here would ship a broken <img> to
 * production, so failing the build is the friendlier outcome.
 */
export function image(path: string): ImageMetadata {
  const found = IMAGES[`../assets/images/${path}`];
  if (!found) {
    const available = Object.keys(IMAGES)
      .map(k => k.replace('../assets/images/', ''))
      .sort()
      .join('\n  ');
    throw new Error(
      `Photo not found: src/assets/images/${path}\nAvailable:\n  ${available}`,
    );
  }
  return found.default;
}

export interface Photo {
  src: ImageMetadata;
  alt: string;
}

// Horizontal scroller on the homepage ("Life on the Farm").
// Order matters — the first photo appears leftmost.
export const FARM_PHOTOS: Photo[] = [
  { src: image('farm/petunia-and-piper.jpeg'), alt: 'Petunia and Piper butting heads at play' },
  { src: image('farm/piper-and-emma.jpeg'),    alt: 'Emma snuggling Piper the goat' },
  { src: image('farm/3.jpeg'),                 alt: 'Two goats nose to nose on the roof of their pink playhouse beside a purple picket fence' },
  { src: image('farm/4.jpeg'),                 alt: 'A child and an adult crouching to greet three spotted goats at a farm event' },
];

// Photos on the About page. The first is featured large; the rest fill
// the collage grid below it.
export const ABOUT_PHOTOS: Photo[] = [
  { src: image('about/1.jpeg'), alt: 'The Glitter Hooves family seated on a hay bale beneath a sunflower-draped photo arch' },
  { src: image('about/2.jpeg'), alt: 'Two adults holding baby goats in the barn, with a young visitor standing between them' },
  { src: image('about/3.jpeg'), alt: 'A laughing woman in pink overalls cradling a black baby goat beside a delighted child' },
  { src: image('about/4.jpeg'), alt: 'A woman on a hammock swing cuddling a black-and-white baby goat, pasture behind her' },
];
