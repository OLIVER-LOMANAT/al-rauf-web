import { MenuTabs } from '@/components/menu/menu-tabs'
import { IllustrativeNotice } from '@/components/menu/illustrative-notice'
import { CtaLink, Eyebrow } from '@/components/site/primitives'
import { getMenu } from '@/lib/server-data'

export async function MenuPreview() {
  const { categories: menuCategories, live } = await getMenu()
  return (
    <section aria-labelledby="menu-preview-title" className="bg-limestone py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">From the Kitchen</Eyebrow>
          <h2 id="menu-preview-title" className="mt-6 text-balance font-serif text-5xl leading-[1.02] md:text-6xl">
            A table worth <em className="text-olive">sharing</em>
          </h2>
          {live ? null : <IllustrativeNotice className="mx-auto mt-6" />}
        </div>

        <div className="mt-14">
          <MenuTabs categories={menuCategories} idPrefix="preview" />
        </div>

        <div className="mt-16 flex justify-center">
          <CtaLink href="/menu" variant="olive">
            View Full Menu
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
