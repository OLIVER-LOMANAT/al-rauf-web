/**
 * Concept imagery for the prototype. These are illustrative images,
 * not photographs of Al Rauf. Replace with the restaurant's own photography.
 */

export type GalleryImage = {
  src: string
  alt: string
  caption: string
  shape: 'wide' | 'tall' | 'square'
}

export const galleryImages: GalleryImage[] = [
  { src: '/images/hero-feast.png', alt: 'A shared table of grilled dishes, rice, salad and flatbread', caption: 'The shared table', shape: 'wide' },
  { src: '/images/coffee-pour.png', alt: 'Arabic coffee poured from a brass dallah', caption: 'Coffee, poured slowly', shape: 'tall' },
  { src: '/images/mezze.png', alt: 'Mezze spread on a limestone surface', caption: 'Mezze', shape: 'square' },
  { src: '/images/interior.png', alt: 'Warm restaurant interior with arched alcoves and brass lamps', caption: 'An evening mood', shape: 'wide' },
  { src: '/images/bread.png', alt: 'Freshly baked flatbread and zaatar manakish', caption: 'From the oven', shape: 'tall' },
  { src: '/images/grill.png', alt: 'Mixed grill platter with kofta and chicken skewers', caption: 'Over the flame', shape: 'square' },
  { src: '/images/tea-detail.png', alt: 'Mint tea beside a brass teapot near an arched window', caption: 'Mint tea', shape: 'tall' },
  { src: '/images/sharing-table.png', alt: 'Friends passing plates across a table', caption: 'Passing plates', shape: 'wide' },
  { src: '/images/dessert.png', alt: 'Kunafa and baklava with rose petals', caption: 'Something sweet', shape: 'square' },
  { src: '/images/rice.png', alt: 'Saffron rice with lamb and toasted nuts', caption: 'Rice, slow-cooked', shape: 'square' },
]
