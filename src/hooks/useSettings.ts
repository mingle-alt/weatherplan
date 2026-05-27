import { useState, useCallback } from 'react'
import { loadSettings, saveSettings } from '../lib/storage'
import type { UserSettings } from '../types'

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings())

  const update = useCallback((patch: Partial<UserSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  return { settings, update }
}
