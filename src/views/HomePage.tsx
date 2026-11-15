import { Experience } from '@/components/home/experience'
import { GalleryPreview } from '@/components/home/gallery-preview'
import { Hero } from '@/components/home/hero'
import { Introduction } from '@/components/home/introduction'
import { MenuPreview } from '@/components/home/menu-preview'
import { Philosophy } from '@/components/home/philosophy'
import { Visit } from '@/components/home/visit'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <MenuPreview />
      <Experience />
      <GalleryPreview />
      <Philosophy />
      <Visit />
    </>
  )
}
