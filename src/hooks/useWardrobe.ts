import { useState, useCallback } from 'react'
import { loadWardrobe, saveWardrobe } from '../lib/storage'
import type { WardrobeItem } from '../types'

export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>(() => loadWardrobe())

  const add = useCallback((item: Omit<WardrobeItem, 'id'>) => {
    const newItem: WardrobeItem = { ...item, id: crypto.randomUUID() }
    setItems(prev => {
      const next = [...prev, newItem]
      saveWardrobe(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      saveWardrobe(next)
      return next
    })
  }, [])

  const update = useCallback((id: string, patch: Partial<WardrobeItem>) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...patch } : i)
      saveWardrobe(next)
      return next
    })
  }, [])

  return { items, add, remove, update }
}
