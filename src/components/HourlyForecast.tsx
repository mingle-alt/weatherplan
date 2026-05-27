import type { WeatherTheme } from '../types'
import { getHourlyItems } from '../lib/clothingEngine'
import type { ForecastItem } from '../types'

interface Props {
  forecast: ForecastItem[]
  theme: WeatherTheme
}

export default function HourlyForecast({ forecast, theme }: Props) {
  const items = getHourlyItems(forecast)

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className={`rounded-3xl ${theme.cardBg} backdrop-blur-sm p-4`}>
        <p className={`text-xs font-medium ${theme.textSecondary} mb-3`}>⏱ 시간대별 예보</p>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {items.map(item => (
            <div key={item.dt} className={`flex-shrink-0 flex flex-col items-center gap-1 rounded-2xl ${theme.cardBg} backdrop-blur-sm px-3 py-2 min-w-[60px]`}>
              <span className={`text-xs ${theme.textSecondary}`}>{item.hour}</span>
              <img src={item.icon} alt={item.description} className="w-8 h-8" />
              <span className={`text-sm font-medium ${theme.textPrimary}`}>{item.temp}°</span>
              {item.pop > 20 && (
                <span className="text-xs text-blue-300 font-medium">{item.pop}%</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
