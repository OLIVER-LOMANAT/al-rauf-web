import { CtaLink, Eyebrow } from '@/components/site/primitives'

export default function NotFound() {
  return (
    <div className="bg-background pt-28 md:pt-32">
      <div className="mx-auto max-w-xl px-5 pb-24 text-center md:px-8 md:pb-32">
        <Eyebrow className="justify-center">Page not found</Eyebrow>
        <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.02] md:text-6xl">
          This table <em className="text-olive">is not set</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
          We could not find the page you were looking for. It may have moved, or the address may be mistyped.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaLink href="/" variant="olive">
            Back to Home
          </CtaLink>
          <CtaLink href="/menu" variant="outline-dark">
            Explore the Menu
          </CtaLink>
        </div>
      </div>
    </div>
  )
}
