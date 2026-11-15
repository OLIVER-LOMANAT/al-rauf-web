import { StarMark } from './primitives'

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
}: {
  eyebrow: string
  title: React.ReactNode
  intro?: string
  image: string
  imageAlt: string
}) {
  return (
    <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-espresso text-espresso-foreground">
      <img
        src={image}
        alt={imageAlt}
        className="animate-slow-zoom -z-10 object-cover opacity-55 absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/30" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:px-8 md:pb-20">
        <p className="eyebrow animate-rise flex items-center gap-3 text-champagne">
          <StarMark className="size-3.5" />
          {eyebrow}
        </p>
        <h1 className="animate-rise mt-5 max-w-4xl text-balance font-serif text-5xl font-normal leading-[1.02] [animation-delay:120ms] md:text-7xl">
          {title}
        </h1>
        {intro ? (
          <p className="animate-rise mt-6 max-w-xl text-pretty leading-relaxed text-espresso-foreground/75 [animation-delay:240ms]">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  )
}
