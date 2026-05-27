import type { WardrobeItem, UserSettings } from '../types'

const KEYS = {
  WARDROBE: 'wplan_wardrobe_v1',
  SETTINGS: 'wplan_settings_v1',
} as const

const DEFAULT_SETTINGS: UserSettings = {
  sensitivity: 0,
  tpo: 'casual',
}

function safeJSON<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  try { return JSON.parse(json) as T } catch { return fallback }
}

export function loadWardrobe(): WardrobeItem[] {
  return safeJSON<WardrobeItem[]>(localStorage.getItem(KEYS.WARDROBE), [])
}

export function saveWardrobe(items: WardrobeItem[]): void {
  localStorage.setItem(KEYS.WARDROBE, JSON.stringify(items))
}

export function loadSettings(): UserSettings {
  const saved = safeJSON<Partial<UserSettings>>(localStorage.getItem(KEYS.SETTINGS), {})
  return { ...DEFAULT_SETTINGS, ...saved }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
}
