import { useState, useMemo } from 'react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useSettings } from './hooks/useSettings'
import { buildOutfit, getWeatherTheme } from './lib/clothingEngine'
import BottomNav from './components/BottomNav'
import FloatingChatButton from './components/FloatingChatButton'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import Wardrobe from './pages/Wardrobe'
import Settings from './pages/Settings'
import type { AppPage } from './types'

const DEFAULT_THEME = {
  gradient: 'from-sky-400 via-blue-500 to-cyan-400',
  cardBg: 'bg-white/20',
  textPrimary: 'text-white',
  textSecondary: 'text-white/70',
}

export default function App() {
  const [page, setPage] = useState<AppPage>('home')
  const [chatOpen, setChatOpen] = useState(false)

  const { status, current, forecast, error, fetchByGps, fetchCity } = useWeather()
  const { settings, update: updateSettings } = useSettings()
  const { items: wardrobe, add: addItem, remove: removeItem } = useWardrobe()

  const outfit = useMemo(() => {
    if (!current) return null
    return buildOutfit(current, forecast, settings)
  }, [current, forecast, settings])

  const theme = useMemo(() => {
    if (!current) return DEFAULT_THEME
    const now = Date.now() / 1000
    const isNight = now < current.sunrise || now > current.sunset
    return getWeatherTheme(current.weather.id, isNight)
  }, [current])

  return (
    <div className={`min-h-dvh bg-gradient-to-br ${theme.gradient} flex flex-col`}>
      {page === 'home' && (
        <Home
          status={status}
          current={current}
          forecast={forecast}
          outfit={outfit}
          settings={settings}
          theme={theme}
          error={error}
          onGpsRefresh={fetchByGps}
          onCitySearch={fetchCity}
        />
      )}
      {page === 'wardrobe' && (
        <Wardrobe items={wardrobe} onAdd={addItem} onRemove={removeItem} />
      )}
      {page === 'settings' && (
        <Settings settings={settings} onUpdate={updateSettings} />
      )}

      <BottomNav current={page} onNavigate={setPage} />

      {status === 'success' && (
        <FloatingChatButton onClick={() => setChatOpen(true)} />
      )}

      {chatOpen && (
        <ChatBot
          current={current}
          forecast={forecast}
          outfit={outfit}
          settings={settings}
          wardrobe={wardrobe}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  )
}
