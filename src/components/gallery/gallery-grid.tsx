'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryImage } from '@/lib/gallery-data'
import { cn } from '@/lib/utils'

const shapeClass: Record<GalleryImage['shape'], string> = {
  wide: 'col-span-2',
  tall: 'row-span-2',
  square: '',
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (index !== null && !dialog.open) dialog.showModal()
    if (index === null && dialog.open) dialog.close()
  }, [index])

  const step = (delta: number) =>
    setIndex((current) => (current === null ? null : (current + delta + images.length) % images.length))

  const current = index !== null ? images[index] : null

  return (
    <>
      <ul className="grid grid-flow-dense auto-rows-[44vw] grid-cols-2 gap-3 md:auto-rows-[17rem] md:grid-cols-4 md:gap-4">
        {images.map((image, i) => (
          <li key={image.src} className={cn('relative', shapeClass[image.shape])}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block size-full overflow-hidden bg-muted"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0 h-full w-full" />
              <span className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="eyebrow absolute bottom-4 left-4 translate-y-2 text-[0.62rem] text-espresso-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {image.caption}
              </span>
              <span className="sr-only">Open image: {image.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Image viewer"
        onClose={() => setIndex(null)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1)
          if (event.key === 'ArrowLeft') step(-1)
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-espresso/95 p-0 text-espresso-foreground backdrop:bg-espresso/80"
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <p className="eyebrow text-[0.62rem] text-champagne">
                {String((index ?? 0) + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </p>
              <button
                type="button"
                onClick={() => setIndex(null)}
                className="inline-flex size-11 items-center justify-center border border-espresso-foreground/25 transition-colors hover:border-champagne"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Close viewer</span>
              </button>
            </div>
            <figure className="relative flex-1">
              <img src={current.src} alt={current.alt} className="object-contain p-4 md:p-10 absolute inset-0 h-full w-full" />
            </figure>
            <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-8">
              <button
                type="button"
                onClick={() => step(-1)}
                className="inline-flex size-11 items-center justify-center border border-espresso-foreground/25 transition-colors hover:border-champagne"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
                <span className="sr-only">Previous image</span>
              </button>
              <figcaption className="text-center font-serif text-xl italic" aria-live="polite">
                {current.caption}
              </figcaption>
              <button
                type="button"
                onClick={() => step(1)}
                className="inline-flex size-11 items-center justify-center border border-espresso-foreground/25 transition-colors hover:border-champagne"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
                <span className="sr-only">Next image</span>
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  )
}
