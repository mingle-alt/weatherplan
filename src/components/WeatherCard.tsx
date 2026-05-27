import { useState } from 'react'
import { IoLocationOutline, IoRefreshOutline, IoSearchOutline } from 'react-icons/io5'
import type { CurrentWeather, WeatherTheme } from '../types'

interface Props {
  current: CurrentWeather
  theme: WeatherTheme
  onGpsRefresh: () => void
  onCitySearch: (city: string) => void
}

export default function WeatherCard({ current, theme, onGpsRefresh, onCitySearch }: Props) {
  const [input, setInput] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const now = Date.now() / 1000
  const isNight = now < current.sunrise || now > current.sunset
  const iconUrl = `https://openweathermap.org/img/wn/${current.weather.icon}@2x.png`

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onCitySearch(input.trim())
    setInput('')
    setShowSearch(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4 pt-6 pb-2">
      {/* 검색 바 */}
      <div className="flex items-center gap-2 mb-4">
        {showSearch ? (
          <form onSubmit={submit} className="flex flex-1 gap-2">
            <input
              autoFocus
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="도시 검색 (예: Seoul, 부산)"
              className={`flex-1 rounded-2xl px-4 py-2 text-sm outline-none ${theme.cardBg} backdrop-blur-sm ${theme.textPrimary} placeholder:text-white/40`}
            />
            <button type="submit" className={`${theme.cardBg} backdrop-blur-sm rounded-2xl px-3 py-2`}>
              <IoSearchOutline className={`text-xl ${theme.textPrimary}`} />
            </button>
            <button type="button" onClick={() => setShowSearch(false)} className={`${theme.cardBg} backdrop-blur-sm rounded-2xl px-3 py-2 ${theme.textSecondary} text-sm`}>
              취소
            </button>
          </form>
        ) : (
          <>
            <button onClick={() => setShowSearch(true)} className={`flex-1 flex items-center gap-2 ${theme.cardBg} backdrop-blur-sm rounded-2xl px-4 py-2`}>
              <IoSearchOutline className={`${theme.textSecondary} text-lg`} />
              <span className={`text-sm ${theme.textSecondary}`}>다른 도시 검색...</span>
            </button>
            <button onClick={onGpsRefresh} className={`${theme.cardBg} backdrop-blur-sm rounded-2xl p-2.5`} aria-label="현재 위치">
              <IoRefreshOutline className={`text-xl ${theme.textPrimary}`} />
            </button>
          </>
        )}
      </div>

      {/* 날씨 메인 */}
      <div className="text-center">
        <div className={`flex items-center justify-center gap-1 text-sm ${theme.textSecondary} mb-2`}>
          <IoLocationOutline />
          <span>{current.name}, {current.country}</span>
          {isNight && <span className="ml-1 text-xs opacity-60">🌙 밤</span>}
        </div>

        <div className="flex items-center justify-center gap-2">
          <img src={iconUrl} alt={current.weather.description} className="w-20 h-20 drop-shadow-lg" />
          <div className="text-left">
            <p className={`text-7xl font-extralight ${theme.textPrimary} leading-none`}>{current.temp}°</p>
            <p className={`text-sm ${theme.textSecondary} mt-1 capitalize`}>{current.weather.description}</p>
          </div>
        </div>

        <div className={`flex justify-center gap-6 mt-3 text-xs ${theme.textSecondary}`}>
          <span>체감 {current.feelsLike}°</span>
          <span>습도 {current.humidity}%</span>
          <span>바람 {current.windSpeed}m/s</span>
        </div>
      </div>
    </div>
  )
}
