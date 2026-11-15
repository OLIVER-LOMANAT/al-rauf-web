'use client'

import { MAX_LINE_QUANTITY } from '@/lib/constants'
import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from 'react'

export type OrderMode = 'delivery' | 'pickup'

export type CartLine = {
  key: string
  itemId: string
  name: string
  image: string
  imageAlt: string
  unitPrice: number
  quantity: number
  /** Display labels for options */
  selections: string[]
  /** Backend option choice UUIDs for checkout */
  optionChoiceIds: string[]
}

export { DELIVERY_FEE, VAT_RATE, MAX_LINE_QUANTITY } from '@/lib/constants'

type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'setQuantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

function reducer(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'add': {
      const existing = lines.find((line) => line.key === action.line.key)
      if (!existing) return [...lines, action.line]
      return lines.map((line) =>
        line.key === action.line.key
          ? { ...line, quantity: Math.min(MAX_LINE_QUANTITY, line.quantity + action.line.quantity) }
          : line,
      )
    }
    case 'setQuantity':
      if (action.quantity < 1) return lines.filter((line) => line.key !== action.key)
      return lines.map((line) =>
        line.key === action.key ? { ...line, quantity: Math.min(MAX_LINE_QUANTITY, action.quantity) } : line,
      )
    case 'remove':
      return lines.filter((line) => line.key !== action.key)
    case 'clear':
      return []
  }
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  mode: OrderMode
  setMode: (mode: OrderMode) => void
  addLine: (line: CartLine) => void
  setQuantity: (key: string, quantity: number) => void
  removeLine: (key: string) => void
  clear: () => void
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, [])
  const [mode, setMode] = useState<OrderMode>('delivery')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const addLine = useCallback((line: CartLine) => dispatch({ type: 'add', line }), [])
  const setQuantity = useCallback((key: string, quantity: number) => dispatch({ type: 'setQuantity', key, quantity }), [])
  const removeLine = useCallback((key: string) => dispatch({ type: 'remove', key }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, line) => total + line.quantity, 0)
    const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0)
    return {
      lines,
      count,
      subtotal,
      mode,
      setMode,
      addLine,
      setQuantity,
      removeLine,
      clear,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }
  }, [lines, mode, drawerOpen, addLine, setQuantity, removeLine, clear, openDrawer, closeDrawer])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
