import { useState } from 'react'
import WeatherCard from '../components/WeatherCard'
import HourlyForecast from '../components/HourlyForecast'
import OutfitRecommendation from '../components/OutfitRecommendation'
import WeatherWarnings from '../components/WeatherWarnings'
import type { CurrentWeather, ForecastItem, OutfitResult, UserSettings, WeatherTheme } from '../types'

interface LoadingScreenProps {
  status: string
  error: string | null
  onRetry: () => void
  onCitySearch: (city: string) => void
}

function LoadingScreen({ status, error, onRetry, onCitySearch }: LoadingScreenProps) {
  const [cityInput, setCityInput] = useState('')

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-white">
      <div className="text-center w-full max-w-xs">
        {status === 'locating' && (
          <>
            <p className="text-5xl mb-4 animate-pulse">📍</p>
            <p className="text-lg font-medium">위치 확인 중...</p>
            <p className="text-sm opacity-60 mt-2">위치 접근 권한을 허용해주세요</p>
          </>
        )}
        {status === 'loading' && (
          <>
            <p className="text-5xl mb-4 animate-spin">🌀</p>
            <p className="text-lg font-medium">날씨 불러오는 중...</p>
          </>
        )}
        {(status === 'error' || status === 'idle') && (
          <>
            {status === 'error' && (
              <>
                <p className="text-5xl mb-4">😢</p>
                <p className="text-lg font-medium whitespace-pre-line mb-4">{error}</p>
              </>
            )}
            {status === 'idle' && (
              <>
                <p className="text-5xl mb-4">🌤️</p>
                <h1 className="text-2xl font-bold mb-2">오늘 뭐 입지?</h1>
                <p className="text-sm opacity-70 mb-4">날씨에 맞는 옷차림을 추천해드려요</p>
              </>
            )}
            <form
              onSubmit={e => { e.preventDefault(); if (cityInput.trim()) onCitySearch(cityInput.trim()) }}
              className="flex gap-2 mb-3"
            >
              <input
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                placeholder="도시 검색 (예: Seoul, 서울)"
                className="flex-1 rounded-2xl px-4 py-2.5 text-gray-800 text-sm outline-none"
              />
              <button type="submit" className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5">🔍</button>
            </form>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-xs opacity-50">또는</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>
            <button
              onClick={onRetry}
              className="w-full bg-white text-sky-600 font-semibold rounded-2xl py-3 text-sm"
            >
              📍 현재 위치로 찾기
            </button>
          </>
        )}
      </div>
    </div>
  )
}

interface Props {
  status: string
  current: CurrentWeather | null
  forecast: ForecastItem[]
  outfit: OutfitResult | null
  settings: UserSettings
  theme: WeatherTheme
  error: string | null
  onGpsRefresh: () => void
  onCitySearch: (city: string) => void
}

export default function Home({ status, current, forecast, outfit, settings, theme, error, onGpsRefresh, onCitySearch }: Props) {
  if (status !== 'success' || !current || !outfit) {
    return <LoadingScreen status={status} error={error} onRetry={onGpsRefresh} onCitySearch={onCitySearch} />
  }

  return (
    <div className="flex-1 overflow-y-auto pb-28 space-y-3">
      <WeatherCard current={current} theme={theme} onGpsRefresh={onGpsRefresh} onCitySearch={onCitySearch} />
      <HourlyForecast forecast={forecast} theme={theme} />
      {outfit.warnings.length > 0 && <WeatherWarnings warnings={outfit.warnings} />}
      <OutfitRecommendation outfit={outfit} feelsLike={current.feelsLike} tpo={settings.tpo} theme={theme} />
    </div>
  )
}
