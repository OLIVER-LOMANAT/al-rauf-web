import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { PageHero } from '@/components/site/page-hero'
import { getGalleryImages } from '@/lib/server-data'

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages()
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            A table, <em className="text-champagne">in pictures</em>
          </>
        }
        intro="Concept imagery created for this website proposal. It sets the mood and will be replaced with photography of Al Rauf itself."
        image="/images/interior.png"
        imageAlt="Warm restaurant interior with arched alcoves"
      />
      <section aria-label="Image gallery" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <GalleryGrid images={galleryImages} />
      </section>
    </>
  )
}
