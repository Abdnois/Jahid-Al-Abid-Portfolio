/**
 * The three portfolio projects shown by the FlexCarousel on mobile/tablet:
 * one entry per project, in the same order as the desktop Projects grid.
 *
 * Paths are document-relative, matching the rest of the static Framer export,
 * and point at the existing local image assets. No remote/placeholder images.
 * Captions follow one pattern: `Title — Section` with a short descriptor.
 */
export const projects = [
  {
    id: 'verde-home',
    src: 'assets/images/verde-home.png',
    alt: 'VERDÉ skincare store home page with the brand hero and featured products',
    title: 'VERDÉ — Home',
    subtitle: 'Skincare storefront',
    href: 'https://abdnois.github.io/verde-skincare-store/'
  },
  {
    id: 'redbull-benefits',
    src: 'assets/images/uG0urJNClQnKoLnxIvW2DdGJvk.png',
    alt: 'Red Bull benefits page pairing hand-drawn illustrations with Stay alert, Reduce fatigue and Kickstart your day',
    title: 'Red Bull — Benefits',
    subtitle: 'Stay alert, reduce fatigue',
    href: 'https://abdnois.github.io/Redbull/'
  },
  {
    id: 'cedrina-farm',
    src: 'assets/images/cedrina-desktop.png',
    alt: 'Cedrina Farm storefront on desktop with small-batch preserves jars and a seasonal hero',
    title: 'Cedrina Farm — Home',
    subtitle: 'Artisan preserves',
    href: 'https://abdnois.github.io/cedrina-farm/'
  }
];
