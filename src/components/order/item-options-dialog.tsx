'use client'

import { useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, X } from 'lucide-react'
import { MAX_LINE_QUANTITY, useCart } from '@/lib/cart'
import { formatPrice, getItemOptions, type MenuCategory, type MenuItem, type OptionGroup } from '@/lib/menu-data'
import { useModal } from '@/lib/use-modal'
import { cn } from '@/lib/utils'
import { ctaBase, StarMark } from '@/components/site/primitives'
import { QuantityStepper } from './quantity-stepper'

type Selections = Record<string, string[]>

export function ItemOptionsDialog({
  item,
  category,
  onClose,
}: {
  item: MenuItem
  category: MenuCategory
  onClose: () => void
}) {
  const { addLine, openDrawer } = useCart()
  const groups = getItemOptions(item, category)
  const [selections, setSelections] = useState<Selections>({})
  const [quantity, setQuantity] = useState(1)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useModal(true, onClose, closeRef)

  const missing = groups.filter((group) => group.required && !(selections[group.id]?.length > 0))
  const extras = groups.reduce((total, group) => {
    const chosen = selections[group.id] ?? []
    return total + group.choices.filter((choice) => chosen.includes(choice.id)).reduce((sum, c) => sum + c.price, 0)
  }, 0)
  const unitPrice = item.price + extras
  const total = unitPrice * quantity

  function toggle(group: OptionGroup, choiceId: string) {
    setSelections((current) => {
      const chosen = current[group.id] ?? []
      if (group.max === 1) return { ...current, [group.id]: [choiceId] }
      if (chosen.includes(choiceId)) return { ...current, [group.id]: chosen.filter((id) => id !== choiceId) }
      if (chosen.length >= group.max) return current
      return { ...current, [group.id]: [...chosen, choiceId] }
    })
  }

  function handleAdd() {
    if (missing.length > 0) return
    const labels: string[] = []
    const optionChoiceIds: string[] = []
    const keyParts: string[] = [item.id]
    for (const group of groups) {
      const chosen = selections[group.id] ?? []
      for (const choice of group.choices) {
        if (!chosen.includes(choice.id)) continue
        labels.push(choice.label)
        optionChoiceIds.push(choice.id)
        keyParts.push(`${group.id}:${choice.id}`)
      }
    }
    addLine({
      key: keyParts.join('|'),
      itemId: item.id,
      name: item.name,
      image: category.image,
      imageAlt: category.imageAlt,
      unitPrice,
      quantity,
      selections: labels,
      optionChoiceIds,
    })
    onClose()
    openDrawer()
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-espresso/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-rise relative z-10 flex max-h-[min(92svh,calc(100dvh-1.5rem))] w-full max-w-5xl flex-col overflow-hidden bg-background shadow-2xl sm:max-h-[min(88svh,calc(100dvh-3rem))]"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <span className="flex items-center gap-3 text-champagne" aria-hidden="true">
            <StarMark className="size-3.5" />
            <span className="eyebrow text-olive">Build your order</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-olive hover:text-olive"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-12 md:overflow-hidden">
          <div className="border-b border-border p-6 md:col-span-5 md:overflow-y-auto md:border-b-0 md:border-r md:p-10">
            <div className="arch relative mx-auto aspect-[4/5] w-full max-w-[16rem] overflow-hidden bg-muted">
              <img src={category.image} alt={category.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <p className="eyebrow mt-8 text-olive">{category.label}</p>
            <h2 id={titleId} className="mt-2 font-serif text-4xl leading-tight">
              {item.name}
            </h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
              {formatPrice(item.price)}
            </p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            <div className="mt-8">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={MAX_LINE_QUANTITY}
                label={`Quantity of ${item.name}`}
              />
            </div>
          </div>

          <div className="p-6 md:col-span-7 md:overflow-y-auto md:p-10">
            {groups.length === 0 ? (
              <div className="flex h-full flex-col justify-center">
                <p className="font-serif text-2xl italic text-muted-foreground">
                  Nothing to choose — just pick how many you&apos;d like.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                <h3 className="eyebrow text-foreground">Meal options</h3>
                {groups.map((group) => (
                  <OptionGroupField
                    key={group.id}
                    group={group}
                    selected={selections[group.id] ?? []}
                    onToggle={(choiceId) => toggle(group, choiceId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-card px-6 py-4 md:px-10">
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end md:gap-6">
            {missing.length > 0 ? (
              <p className="text-sm text-muted-foreground" aria-live="polite">
                To continue, complete: <span className="text-foreground">{missing.map((g) => g.title).join(', ')}</span>
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleAdd}
              disabled={missing.length > 0}
              className={cn(
                ctaBase,
                'bg-olive text-primary-foreground hover:bg-olive-deep disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground md:min-w-80',
              )}
            >
              Add {quantity} to order · {formatPrice(total)}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function OptionGroupField({
  group,
  selected,
  onToggle,
}: {
  group: OptionGroup
  selected: string[]
  onToggle: (choiceId: string) => void
}) {
  const single = group.max === 1
  const name = useId()
  return (
    <fieldset>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <legend className="float-left text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
          {group.title}
        </legend>
        <span
          className={cn(
            'eyebrow shrink-0 border px-2 py-1 text-[0.55rem]',
            group.required ? 'border-destructive/40 bg-destructive/10 text-destructive' : 'border-border text-muted-foreground',
          )}
        >
          {group.required ? 'Required' : single ? 'Optional' : `Optional · up to ${group.max}`}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {group.choices.map((choice) => {
          const checked = selected.includes(choice.id)
          const disabled = !single && !checked && selected.length >= group.max
          return (
            <li key={choice.id}>
              <label
                className={cn(
                  'flex cursor-pointer items-center gap-4 py-4 transition-colors',
                  disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-olive',
                )}
              >
                <input
                  type={single ? 'radio' : 'checkbox'}
                  name={name}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(choice.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne',
                    single ? 'rounded-full' : 'rounded-sm',
                    checked ? 'border-olive bg-olive text-primary-foreground' : 'border-foreground/40',
                  )}
                >
                  {checked ? (
                    single ? <span className="size-2 rounded-full bg-primary-foreground" /> : <Check className="size-3.5" />
                  ) : null}
                </span>
                <span className="flex-1 text-base">{choice.label}</span>
                {choice.price > 0 ? (
                  <span className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">
                    +{formatPrice(choice.price)}
                  </span>
                ) : null}
              </label>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}
