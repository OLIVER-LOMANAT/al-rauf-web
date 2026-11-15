'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor="hover"]'
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

function subscribeFinePointer(callback: () => void) {
  const query = window.matchMedia(FINE_POINTER)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function useFinePointer() {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  )
}

function colorLightness(color: string): number | null {
  const oklch = color.match(/oklch\(\s*([\d.]+)(%?)/)
  if (oklch) return Number(oklch[1]) / (oklch[2] ? 100 : 1)
  const rgb = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/)
  if (rgb) {
    const [r, g, b] = rgb.slice(1, 4).map(Number)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  }
  return null
}

function isTransparent(color: string) {
  return color === 'transparent' || /\/\s*0\)$/.test(color) || /,\s*0\)$/.test(color)
}

function sitsOnDarkSurface(start: Element) {
  let node: Element | null = start
  while (node) {
    const background = getComputedStyle(node).backgroundColor
    if (!isTransparent(background)) {
      const lightness = colorLightness(background)
      if (lightness !== null) return lightness < 0.55
    }
    node = node.parentElement
  }
  return false
}

export function CursorFollower() {
  const finePointer = useFinePointer()
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!finePointer || !cursor) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let frame = 0
    let visible = false

    const render = () => {
      const follow = reduceMotion ? 1 : 0.18
      current.x += (target.x - current.x) * follow
      current.y += (target.y - current.y) * follow
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      frame = requestAnimationFrame(render)
    }

    const handleMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) {
        visible = true
        current.x = target.x
        current.y = target.y
        cursor.dataset.visible = 'true'
      }
    }

    const handleOver = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return
      cursor.dataset.hover = event.target.closest(INTERACTIVE) ? 'true' : 'false'
      cursor.dataset.tone = sitsOnDarkSurface(event.target) ? 'light' : 'dark'
    }

    const handleLeave = () => {
      visible = false
      cursor.dataset.visible = 'false'
    }

    const handleDown = () => (cursor.dataset.pressed = 'true')
    const handleUp = () => (cursor.dataset.pressed = 'false')

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerover', handleOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', handleLeave)
    window.addEventListener('pointerdown', handleDown, { passive: true })
    window.addEventListener('pointerup', handleUp, { passive: true })
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerover', handleOver)
      document.documentElement.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [finePointer])

  if (!finePointer) return null

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-visible="false"
      data-hover="false"
      data-tone="dark"
      className="cursor-follower pointer-events-none fixed left-0 top-0 z-[70]"
    >
      <span className="cursor-follower__ring" />
    </div>
  )
}
