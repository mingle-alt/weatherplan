import type { UserSettings, TPO, Sensitivity } from '../types'

const TPO_OPTIONS: { value: TPO; label: string; emoji: string; desc: string }[] = [
  { value: 'casual',   label: '캐주얼',  emoji: '🛍️', desc: '편하게' },
  { value: 'work',     label: '출근',   emoji: '💼', desc: '오피스룩' },
  { value: 'date',     label: '데이트', emoji: '💕', desc: '스타일업' },
  { value: 'exercise', label: '운동',   emoji: '🏃', desc: '기능성' },
  { value: 'formal',   label: '격식',   emoji: '🎩', desc: '포멀' },
]

const SENSITIVITY_STEPS: { value: Sensitivity; label: string }[] = [
  { value: -3, label: '많이 추위 탐' },
  { value: -2, label: '추위 탐' },
  { value: -1, label: '약간 추위 탐' },
  { value:  0, label: '보통' },
  { value:  1, label: '약간 더위 탐' },
  { value:  2, label: '더위 탐' },
  { value:  3, label: '많이 더위 탐' },
]

interface Props {
  settings: UserSettings
  onUpdate: (patch: Partial<UserSettings>) => void
}

export default function SettingsPanel({ settings, onUpdate }: Props) {
  const currentStep = SENSITIVITY_STEPS.find(s => s.value === settings.sensitivity) ?? SENSITIVITY_STEPS[3]
  const sliderIndex = SENSITIVITY_STEPS.findIndex(s => s.value === settings.sensitivity)

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32 space-y-6">

      {/* TPO */}
      <div>
        <h3 className="text-white font-semibold mb-1">오늘의 TPO</h3>
        <p className="text-white/50 text-xs mb-3">상황에 맞는 스타일로 추천을 바꿔요</p>
        <div className="grid grid-cols-5 gap-2">
          {TPO_OPTIONS.map(t => (
            <button
              key={t.value}
              onClick={() => onUpdate({ tpo: t.value })}
              className={`flex flex-col items-center gap-1 rounded-2xl py-3 transition-all ${
                settings.tpo === t.value
                  ? 'bg-white text-gray-900'
                  : 'bg-white/15 text-white'
              }`}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 온도 민감도 */}
      <div>
        <h3 className="text-white font-semibold mb-1">온도 민감도</h3>
        <p className="text-white/50 text-xs mb-3">
          현재: <span className="text-white font-medium">{currentStep.label}</span>
          {settings.sensitivity !== 0 && (
            <span className="text-white/70"> (추천 기준 체감온도 {settings.sensitivity > 0 ? `+${settings.sensitivity}` : settings.sensitivity}°C 조정)</span>
          )}
        </p>
        <input
          type="range"
          min={0}
          max={6}
          value={sliderIndex}
          onChange={e => onUpdate({ sensitivity: SENSITIVITY_STEPS[Number(e.target.value)].value as Sensitivity })}
          className="w-full accent-white"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/40">🥶 추위 탐</span>
          <span className="text-xs text-white/40">보통</span>
          <span className="text-xs text-white/40">더위 탐 🥵</span>
        </div>
      </div>

      {/* 안내 */}
      <div className="bg-white/10 rounded-2xl p-4">
        <p className="text-white/70 text-sm leading-relaxed">
          💡 <strong className="text-white">민감도 조정</strong>은 옷차림 추천 기준 온도를 ±3°C 범위로 조절해요.
          추위 탐 최대(-3)로 설정하면 체감 온도보다 3°C 더 춥게 인식해서 더 따뜻한 옷을 추천해드려요.
        </p>
      </div>
    </div>
  )
}
