import type { OutfitResult, WeatherTheme, TPO } from '../types'

const TPO_LABELS: Record<TPO, string> = {
  casual: '캐주얼',
  work: '출근',
  date: '데이트',
  exercise: '운동',
  formal: '격식',
}

interface Props {
  outfit: OutfitResult
  feelsLike: number
  tpo: TPO
  theme: WeatherTheme
}

export default function OutfitRecommendation({ outfit, feelsLike, tpo, theme }: Props) {
  const layers = ['outer', 'top', 'bottom', 'shoes', 'accessory'] as const
  const grouped = layers.map(layer => ({
    layer,
    items: outfit.items.filter(i => i.layer === layer),
  })).filter(g => g.items.length > 0)

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className={`rounded-3xl ${theme.cardBg} backdrop-blur-sm p-5`}>
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className={`text-base font-semibold ${theme.textPrimary}`}>👗 오늘의 코디</h2>
            <p className={`text-sm ${theme.textSecondary} mt-0.5`}>{outfit.title}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs ${theme.cardBg} backdrop-blur-sm rounded-full px-2 py-0.5 ${theme.textSecondary}`}>
              체감 {feelsLike}° 기준
            </span>
            <span className={`text-xs ${theme.cardBg} backdrop-blur-sm rounded-full px-2 py-0.5 ${theme.textSecondary}`}>
              {TPO_LABELS[tpo]}
            </span>
          </div>
        </div>

        {/* 레이어별 아이템 */}
        <div className="space-y-2 mb-4">
          {grouped.map(({ layer, items }) => (
            <div key={layer}>
              <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 rounded-xl ${theme.cardBg} backdrop-blur-sm px-3 py-2 ${!item.required ? 'opacity-70' : ''}`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className={`text-sm ${theme.textPrimary}`}>{item.label}</span>
                    {!item.required && (
                      <span className={`text-xs ${theme.textSecondary} ml-0.5`}>(선택)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 팁 */}
        <div className={`rounded-2xl ${theme.cardBg} p-3`}>
          <p className={`text-sm ${theme.textPrimary}`}>💡 {outfit.tip}</p>
        </div>
      </div>
    </div>
  )
}
