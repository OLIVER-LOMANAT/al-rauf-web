import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { Eyebrow, TextLink } from '@/components/site/primitives'
import { getGalleryImages } from '@/lib/server-data'

export async function GalleryPreview() {
  const galleryImages = await getGalleryImages()
  return (
    <section aria-labelledby="gallery-preview-title" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Gallery</Eyebrow>
            <h2 id="gallery-preview-title" className="mt-6 text-balance font-serif text-5xl leading-[1.02] md:text-6xl">
              A glimpse of the <em className="text-olive">table</em>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-xs text-sm text-muted-foreground md:text-right">
              Concept imagery shown — to be replaced with Al Rauf&apos;s own photography.
            </p>
            <TextLink href="/gallery" className="text-olive">
              View Full Gallery
            </TextLink>
          </div>
        </div>
        <div className="mt-14">
          <GalleryGrid images={galleryImages.slice(0, 6)} />
        </div>
      </div>
    </section>
  )
}
