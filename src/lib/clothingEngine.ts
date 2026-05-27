import type {
  TempBand, ClothingItem, ClothingLayer, OutfitResult,
  WeatherWarning, UserSettings, CurrentWeather, ForecastItem,
  WeatherTheme, TPO,
} from '../types'

// ── 온도 밴드 ──────────────────────────────────────────────
export function getTempBand(t: number): TempBand {
  if (t <= -10) return 'EXTREME_COLD'
  if (t <= -5)  return 'VERY_COLD'
  if (t <= 0)   return 'COLD'
  if (t <= 4)   return 'CHILLY'
  if (t <= 8)   return 'COOL'
  if (t <= 11)  return 'SLIGHTLY_COOL'
  if (t <= 16)  return 'MILD'
  if (t <= 19)  return 'COMFORTABLE'
  if (t <= 22)  return 'PLEASANT'
  if (t <= 26)  return 'WARM'
  if (t <= 30)  return 'HOT'
  return 'VERY_HOT'
}

// ── 기본 아우터/상의/하의/신발 템플릿 (캐주얼 기준) ─────────
type LayerDef = [ClothingLayer, string, string, boolean]  // [layer, emoji, label, required]

const BASE: Record<TempBand, LayerDef[]> = {
  EXTREME_COLD: [
    ['outer',     '🧥', '롱 패딩',          true],
    ['top',       '👕', '히트텍 이중 레이어', true],
    ['top',       '🧶', '두꺼운 니트',        true],
    ['bottom',    '👖', '기모 내복 + 두꺼운 바지', true],
    ['shoes',     '👢', '방한 부츠',          true],
    ['accessory', '🧣', '목도리',             true],
    ['accessory', '🧤', '장갑',              true],
    ['accessory', '🧢', '귀마개 모자',        true],
  ],
  VERY_COLD: [
    ['outer',     '🧥', '두꺼운 패딩',        true],
    ['top',       '👕', '히트텍',             true],
    ['top',       '🧶', '니트 스웨터',         true],
    ['bottom',    '👖', '기모 청바지',         true],
    ['shoes',     '👢', '방한 부츠',           true],
    ['accessory', '🧣', '목도리',              true],
    ['accessory', '🧤', '장갑',               true],
  ],
  COLD: [
    ['outer',     '🧥', '패딩 / 두꺼운 코트',  true],
    ['top',       '👕', '히트텍',              true],
    ['top',       '🧶', '니트 / 두꺼운 후드',   true],
    ['bottom',    '👖', '기모 청바지',          true],
    ['shoes',     '👟', '두꺼운 양말 + 운동화', true],
    ['accessory', '🧣', '목도리',              false],
  ],
  CHILLY: [
    ['outer',     '🧥', '울 코트 / 숏 패딩',   true],
    ['top',       '🧶', '두꺼운 가디건',        true],
    ['top',       '👕', '긴팔 셔츠',           true],
    ['bottom',    '👖', '청바지 / 슬랙스',      true],
    ['shoes',     '👟', '운동화 / 부츠',        true],
    ['accessory', '🧣', '넥워머',              false],
  ],
  COOL: [
    ['outer',     '🧥', '코트 / 두꺼운 재킷',  true],
    ['top',       '🧶', '가디건 / 후드티',      true],
    ['top',       '👕', '긴팔',               true],
    ['bottom',    '👖', '청바지',              true],
    ['shoes',     '👟', '운동화 / 로퍼',       true],
  ],
  SLIGHTLY_COOL: [
    ['outer',     '🧥', '재킷 / 가디건',        true],
    ['top',       '👕', '긴팔',                true],
    ['bottom',    '👖', '청바지 / 면바지',       true],
    ['shoes',     '👟', '운동화',              true],
  ],
  MILD: [
    ['outer',     '🧥', '얇은 재킷 / 바람막이', false],
    ['top',       '👕', '긴팔',               true],
    ['bottom',    '👖', '면바지 / 청바지',      true],
    ['shoes',     '👟', '운동화 / 로퍼',       true],
  ],
  COMFORTABLE: [
    ['top',       '👕', '긴팔',               true],
    ['top',       '🧶', '얇은 가디건 (저녁용)', false],
    ['bottom',    '👖', '면바지',             true],
    ['shoes',     '👟', '운동화',             true],
  ],
  PLEASANT: [
    ['top',       '👕', '반팔 또는 얇은 긴팔',  true],
    ['bottom',    '👖', '면바지 / 청바지',      true],
    ['shoes',     '👟', '운동화',             true],
  ],
  WARM: [
    ['top',       '👕', '반팔',               true],
    ['bottom',    '🩳', '면바지 / 반바지',      true],
    ['shoes',     '👟', '운동화 / 샌들',       true],
    ['accessory', '🧴', '자외선 차단제',        true],
  ],
  HOT: [
    ['top',       '👕', '반팔 (린넨 소재)',      true],
    ['bottom',    '🩳', '반바지',              true],
    ['shoes',     '👡', '샌들',               true],
    ['accessory', '🕶️', '선글라스',            true],
    ['accessory', '🧴', '자외선 차단제',        true],
  ],
  VERY_HOT: [
    ['top',       '👕', '민소매 / 반팔',        true],
    ['bottom',    '🩳', '반바지',              true],
    ['shoes',     '👡', '샌들',               true],
    ['accessory', '🎩', '모자',               true],
    ['accessory', '🕶️', '선글라스',           true],
    ['accessory', '🧴', '자외선 차단제 SPF50+', true],
  ],
}

const BAND_TITLES: Record<TempBand, string> = {
  EXTREME_COLD:   '극한 한파 — 완전 방한 필수',
  VERY_COLD:      '매우 추워요 — 두꺼운 패딩 필수',
  COLD:           '많이 추워요 — 패딩 또는 두꺼운 코트',
  CHILLY:         '꽤 추워요 — 코트에 레이어링',
  COOL:           '쌀쌀해요 — 코트나 두꺼운 재킷',
  SLIGHTLY_COOL:  '약간 쌀쌀 — 재킷이나 가디건',
  MILD:           '선선해요 — 긴팔에 얇은 겉옷',
  COMFORTABLE:    '조금 선선 — 긴팔이면 충분',
  PLEASANT:       '딱 좋은 날씨 — 가볍게 입어요',
  WARM:           '따뜻해요 — 반팔이 좋아요',
  HOT:            '더워요 — 시원한 소재로',
  VERY_HOT:       '매우 더워요 — 최대한 시원하게',
}

const BAND_TIPS: Record<TempBand, string> = {
  EXTREME_COLD:   '노출 부위를 최소화하세요. 동상 위험이 있습니다.',
  VERY_COLD:      '내복·히트텍 착용을 추천해요. 손발 보온에 신경 쓰세요.',
  COLD:           '바람이 불면 더 춥게 느껴져요. 목과 귀를 감싸세요.',
  CHILLY:         '안에 두꺼운 레이어를 입고 코트로 마무리하세요.',
  COOL:           '일교차가 있을 수 있으니 겉옷을 꼭 챙기세요.',
  SLIGHTLY_COOL:  '탈착이 쉬운 겉옷을 선택하면 편해요.',
  MILD:           '아침저녁에 서늘하니 얇은 겉옷 하나는 챙기세요.',
  COMFORTABLE:    '낮에는 쾌적하지만 저녁엔 가디건 하나 챙겨두세요.',
  PLEASANT:       '활동하기 가장 좋은 기온이에요!',
  WARM:           '자외선이 강할 수 있으니 선크림을 바르세요.',
  HOT:            '통기성 좋은 소재를 선택하고 그늘을 이용하세요.',
  VERY_HOT:       '수분 보충을 자주 하고, 한낮 야외 활동은 피하세요.',
}

// ── TPO 오버라이드 ──────────────────────────────────────────
const COLD_BANDS = new Set<TempBand>(['EXTREME_COLD', 'VERY_COLD', 'COLD', 'CHILLY', 'COOL'])
const WARM_BANDS = new Set<TempBand>(['WARM', 'HOT', 'VERY_HOT'])

function applyTPO(items: ClothingItem[], tpo: TPO, band: TempBand): ClothingItem[] {
  if (tpo === 'casual') return items

  if (tpo === 'exercise') {
    const exerciseItems: ClothingItem[] = [
      { layer: 'top', emoji: '🏃', label: '기능성 운동 상의', required: true },
      { layer: 'bottom', emoji: '🩱', label: COLD_BANDS.has(band) ? '발열 레깅스 / 조거 팬츠' : '레깅스 / 운동 반바지', required: true },
      { layer: 'shoes', emoji: '👟', label: '운동화', required: true },
    ]
    if (COLD_BANDS.has(band)) {
      exerciseItems.unshift({ layer: 'outer', emoji: '🧥', label: '기능성 바람막이 재킷', required: true })
    }
    if (band === 'VERY_HOT' || band === 'HOT') {
      exerciseItems.push({ layer: 'accessory', emoji: '🧴', label: '자외선 차단제', required: true })
    }
    exerciseItems.push({ layer: 'accessory', emoji: '💧', label: '물병 필수', required: true })
    return exerciseItems
  }

  return items.map(item => {
    if (tpo === 'work' || tpo === 'formal') {
      if (item.layer === 'outer' && COLD_BANDS.has(band)) {
        return { ...item, emoji: '🧥', label: tpo === 'formal' ? '정장용 코트' : '트렌치코트 / 울 코트' }
      }
      if (item.layer === 'top' && item.label.includes('긴팔')) {
        return { ...item, emoji: '👔', label: tpo === 'formal' ? '드레스 셔츠' : '셔츠 / 블라우스' }
      }
      if (item.layer === 'top' && item.label.includes('반팔') && !WARM_BANDS.has(band)) {
        return { ...item, emoji: '👔', label: '셔츠 / 블라우스' }
      }
      if (item.layer === 'bottom') {
        return { ...item, emoji: '👔', label: tpo === 'formal' ? '정장 바지 / 스커트' : '슬랙스 / 미디 스커트' }
      }
      if (item.layer === 'shoes') {
        return { ...item, emoji: '👞', label: tpo === 'formal' ? '구두 / 힐' : '로퍼 / 구두' }
      }
      if (item.label.includes('후드') || item.label.includes('맨투맨')) {
        return { ...item, emoji: '👔', label: '니트 / 블라우스' }
      }
    }
    if (tpo === 'date') {
      if (item.layer === 'top' && item.label.includes('긴팔')) {
        return { ...item, label: '니트 / 블라우스' }
      }
      if (item.layer === 'bottom' && item.label.includes('면바지')) {
        return { ...item, label: '슬랙스 / 미디 스커트' }
      }
    }
    return item
  })
}

function addTPOAccessories(items: ClothingItem[], tpo: TPO): ClothingItem[] {
  if (tpo === 'date') {
    return [...items, { layer: 'accessory' as ClothingLayer, emoji: '✨', label: '액세서리 (귀걸이 / 시계)', required: false }]
  }
  if (tpo === 'formal') {
    return [...items, { layer: 'accessory' as ClothingLayer, emoji: '👔', label: '넥타이 / 스카프', required: true }]
  }
  return items
}

// ── 날씨 조건 경고 ──────────────────────────────────────────
function detectWarnings(
  current: CurrentWeather,
  forecast: ForecastItem[],
): WeatherWarning[] {
  const warnings: WeatherWarning[] = []
  const wId = current.weather.id

  // 강수
  if (wId >= 200 && wId < 600) {
    const isHeavy = wId >= 300 && wId < 400 ? false : wId >= 500
    warnings.push({
      type: 'RAIN',
      message: isHeavy ? '강한 비가 내려요. 우산과 방수 아우터를 챙기세요.' : '비가 내려요. 우산을 꼭 챙기세요! ☂️',
      severity: isHeavy ? 'danger' : 'warning',
    })
  }

  // 눈
  if (wId >= 600 && wId < 700) {
    warnings.push({
      type: 'SNOW',
      message: '눈이 내려요. 방수 부츠를 신고 미끄러운 길을 조심하세요. ❄️',
      severity: 'warning',
    })
  }

  // 강풍
  if (current.windSpeed >= 7) {
    warnings.push({
      type: 'WIND',
      message: `바람이 강해요 (${current.windSpeed}m/s). 바람막이를 챙기세요.`,
      severity: current.windSpeed >= 14 ? 'danger' : 'info',
    })
  }

  // 일교차
  if (forecast.length >= 3) {
    const temps = forecast.map(f => f.temp)
    const gap = Math.max(...temps) - Math.min(...temps)
    if (gap >= 8) {
      warnings.push({
        type: 'TEMP_GAP',
        message: `오늘 일교차가 ${gap}°C예요. 탈착 가능한 겉옷으로 레이어링하세요.`,
        severity: 'warning',
      })
    }
  }

  // 자외선 (맑음 + 더운 날씨)
  if (wId === 800 && current.temp >= 25) {
    warnings.push({
      type: 'UV',
      message: '자외선 지수가 높아요. 선크림 SPF50+ 필수, 모자 착용을 권장해요.',
      severity: 'warning',
    })
  }

  return warnings
}

// ── 날씨에 따라 아이템 추가 ──────────────────────────────────
function addWeatherItems(items: ClothingItem[], current: CurrentWeather): ClothingItem[] {
  const wId = current.weather.id
  const result = [...items]

  if (wId >= 200 && wId < 600) {
    result.push({ layer: 'accessory', emoji: '☂️', label: '우산 필수', required: true })
    const hasWaterproofOuter = items.some(i => i.layer === 'outer')
    if (!hasWaterproofOuter) {
      result.unshift({ layer: 'outer', emoji: '🧥', label: '방수 아우터', required: true })
    }
  }

  if (wId >= 600 && wId < 700) {
    const shoesIdx = result.findIndex(i => i.layer === 'shoes')
    if (shoesIdx >= 0) result[shoesIdx] = { ...result[shoesIdx], emoji: '👢', label: '방수 부츠' }
  }

  return result
}

// ── 메인 엔트리 ─────────────────────────────────────────────
export function buildOutfit(
  current: CurrentWeather,
  forecast: ForecastItem[],
  settings: UserSettings,
): OutfitResult {
  const effectiveTemp = current.feelsLike - settings.sensitivity
  const band = getTempBand(effectiveTemp)

  let items: ClothingItem[] = BASE[band].map(([layer, emoji, label, required]) => ({
    layer, emoji, label, required,
  }))

  items = applyTPO(items, settings.tpo, band)
  items = addTPOAccessories(items, settings.tpo)
  items = addWeatherItems(items, current)

  const warnings = detectWarnings(current, forecast)

  return {
    band,
    title: BAND_TITLES[band],
    items,
    tip: BAND_TIPS[band],
    warnings,
  }
}

// ── 날씨 테마 ────────────────────────────────────────────────
export function getWeatherTheme(weatherId: number, isNight: boolean): WeatherTheme {
  if (isNight) return {
    gradient: 'from-indigo-950 via-slate-900 to-blue-950',
    cardBg: 'bg-white/10',
    textPrimary: 'text-blue-50',
    textSecondary: 'text-blue-200/70',
  }
  if (weatherId >= 200 && weatherId < 300) return {
    gradient: 'from-slate-800 via-gray-700 to-zinc-800',
    cardBg: 'bg-white/10',
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-300/70',
  }
  if (weatherId >= 300 && weatherId < 600) return {
    gradient: 'from-slate-700 via-blue-800 to-slate-700',
    cardBg: 'bg-white/10',
    textPrimary: 'text-blue-100',
    textSecondary: 'text-blue-200/70',
  }
  if (weatherId >= 600 && weatherId < 700) return {
    gradient: 'from-sky-200 via-blue-100 to-indigo-200',
    cardBg: 'bg-white/40',
    textPrimary: 'text-indigo-900',
    textSecondary: 'text-indigo-700/70',
  }
  if (weatherId >= 700 && weatherId < 800) return {
    gradient: 'from-gray-400 via-slate-300 to-gray-400',
    cardBg: 'bg-white/30',
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-600/70',
  }
  if (weatherId === 800) return {
    gradient: 'from-sky-400 via-blue-500 to-cyan-400',
    cardBg: 'bg-white/20',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
  }
  return {
    gradient: 'from-blue-400 via-sky-500 to-slate-400',
    cardBg: 'bg-white/20',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
  }
}

// ── 시간대별 예보 가공 ───────────────────────────────────────
export function getHourlyItems(forecast: ForecastItem[]) {
  return forecast.map(f => {
    const d = new Date(f.dt * 1000)
    const hour = d.getHours()
    return {
      dt: f.dt,
      hour: hour === 0 ? '자정' : hour === 12 ? '정오' : `${hour}시`,
      temp: f.temp,
      pop: Math.round(f.pop * 100),
      icon: `https://openweathermap.org/img/wn/${f.weather.icon}.png`,
      description: f.weather.description,
    }
  })
}
