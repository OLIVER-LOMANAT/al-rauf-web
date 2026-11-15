import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function IllustrativeNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'flex w-fit items-center gap-2 border border-olive/30 bg-background/60 px-3 py-2 text-xs text-muted-foreground',
        className,
      )}
    >
      <Info className="size-3.5 shrink-0 text-olive" aria-hidden="true" />
      Sample dishes for illustration only — Al Rauf&apos;s menu and prices are yet to be confirmed.
    </p>
  )
}
