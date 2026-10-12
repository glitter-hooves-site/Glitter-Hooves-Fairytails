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
  /** Show on the homepage. Keep it to six — the homepage section is sized
   *  for exactly that, and every photo also appears on /gallery/. Prefer
   *  high-resolution files here; they render largest. */
  feature?: boolean;
}

// Every farm photo. All of them appear on /gallery/; the six marked
// `feature: true` also appear on the homepage. Order matters in both places.
export const FARM_PHOTOS: Photo[] = [
  { src: image('farm/golden-hour-hand-feeding.jpeg'),          alt: 'A goat reaching over the fence to eat from an outstretched hand, backlit by the setting sun', feature: true },
  { src: image('farm/goat-peering-through-purple-pickets.jpeg'), alt: 'A black goat peering straight at the camera between purple picket fence posts', feature: true },
  { src: image('farm/hammock-goat-snuggles.jpg'),             alt: 'A child laughing in a striped hammock with two goats curled up alongside', feature: true },
  { src: image('farm/zinnias-at-sunset.jpeg'),                alt: 'Red and orange zinnias blooming in the tire garden at sunset', feature: true },
  { src: image('farm/goat-against-the-sky.jpeg'),             alt: 'A black goat lifting its chin toward a pale blue sky', feature: true },
  { src: image('farm/piper-and-emma.jpeg'),                   alt: 'Emma snuggling Piper the goat', feature: true },
  { src: image('farm/goat-nose-closeup.jpeg'),                alt: 'A curious goat pressing its nose right up to the camera' },
  { src: image('farm/two-goats-by-lavender-fence.jpeg'),      alt: 'Two black-and-white goats standing on a platform beside a lavender picket fence' },
  { src: image('farm/picnic-blanket-goat-visit.jpeg'),        alt: 'A woman kneeling on a checked picnic blanket to greet a young goat, with a visitor relaxing in a hammock behind' },
  { src: image('farm/goat-eating-greens-from-hand.jpeg'),     alt: 'A goat on a wooden platform eating greens from a visitor\'s hand' },
  { src: image('farm/potion-bar.jpeg'),                       alt: 'The potion bar: shelves of coloured jars beside a chalkboard reading "You belong here"' },
  { src: image('farm/fairy-house-in-the-woods.jpeg'),         alt: 'A tiny fairy house with a spotted pink roof surrounded by flowers on the woodland floor' },
  { src: image('farm/dreamcatcher-in-the-pines.jpeg'),        alt: 'A pink dreamcatcher hanging among the pine branches' },
  { src: image('farm/painted-window-fairy-garden.jpeg'),      alt: 'An old window frame painted with flowers, propped in the fairy garden beside a painted stone' },
  { src: image('farm/petunia-and-piper.jpeg'),                alt: 'Petunia and Piper butting heads at play' },
  { src: image('farm/3.jpeg'),                                alt: 'Two goats nose to nose on the roof of their pink playhouse beside a purple picket fence' },
  { src: image('farm/4.jpeg'),                                alt: 'A child and an adult crouching to greet three spotted goats at a farm event' },
  { src: image('farm/child-and-adult-feeding-goat.jpg'),      alt: 'An adult kneeling beside a young child in sunglasses, offering a sprig of greenery to a goat' },
  { src: image('farm/planting-zinnia-tire-garden.jpg'),       alt: 'A child in a white cap tending a red zinnia growing in a bright blue painted-tire planter' },
  { src: image('farm/petting-goat-on-bench.jpg'),             alt: 'A child reaching out to pet a black-and-white goat standing on a wooden bench' },
  { src: image('farm/digging-in-the-tire-garden.jpg'),        alt: 'A child digging with a hand trowel in a yellow painted-tire garden bed' },
  { src: image('farm/offering-feed-to-goat.jpg'),             alt: 'A child in green frog boots offering a handful of feed to a goat in the play yard' },
  { src: image('farm/kids-greeting-goats-by-the-shed.jpg'),   alt: 'Three children feeding and petting two goats beside the flower-painted goat shed' },
];

export const FEATURED_PHOTOS: Photo[] = FARM_PHOTOS.filter(p => p.feature);

// Photos on the About page. The first is featured large; the rest fill
// the collage grid below it.
export const ABOUT_PHOTOS: Photo[] = [
  { src: image('about/1.jpeg'), alt: 'The Glitter Hooves family seated on a hay bale beneath a sunflower-draped photo arch' },
  { src: image('about/2.jpeg'), alt: 'Two adults holding baby goats in the barn, with a young visitor standing between them' },
  { src: image('about/3.jpeg'), alt: 'A laughing woman in pink overalls cradling a black baby goat beside a delighted child' },
  { src: image('about/4.jpeg'), alt: 'A woman on a hammock swing cuddling a black-and-white baby goat, pasture behind her' },
];
