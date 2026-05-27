// ===== 날씨 API =====
export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeather {
  name: string
  country: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  weather: WeatherCondition
  sunrise: number
  sunset: number
  dt: number
  lat: number
  lon: number
}

export interface ForecastItem {
  dt: number
  temp: number
  feelsLike: number
  pop: number
  weather: WeatherCondition
}

// ===== 옷차림 추천 =====
export type TempBand =
  | 'EXTREME_COLD'   // ≤ -10
  | 'VERY_COLD'      // -10 ~ -5
  | 'COLD'           // -5 ~ 0
  | 'CHILLY'         // 0 ~ 4
  | 'COOL'           // 4 ~ 8
  | 'SLIGHTLY_COOL'  // 8 ~ 11
  | 'MILD'           // 11 ~ 16
  | 'COMFORTABLE'    // 16 ~ 19
  | 'PLEASANT'       // 19 ~ 22
  | 'WARM'           // 22 ~ 26
  | 'HOT'            // 26 ~ 30
  | 'VERY_HOT'       // > 30

export type ClothingLayer = 'outer' | 'top' | 'bottom' | 'shoes' | 'accessory'

export interface ClothingItem {
  layer: ClothingLayer
  emoji: string
  label: string
  required: boolean
}

export interface WeatherWarning {
  type: 'RAIN' | 'SNOW' | 'WIND' | 'TEMP_GAP' | 'UV'
  message: string
  severity: 'info' | 'warning' | 'danger'
}

export interface OutfitResult {
  band: TempBand
  title: string
  items: ClothingItem[]
  tip: string
  warnings: WeatherWarning[]
}

// ===== 사용자 설정 =====
export type TPO = 'casual' | 'work' | 'date' | 'exercise' | 'formal'
export type Sensitivity = -3 | -2 | -1 | 0 | 1 | 2 | 3

export interface UserSettings {
  sensitivity: Sensitivity  // 음수=추위 탐, 양수=더위 탐
  tpo: TPO
}

// ===== 내 옷장 =====
export type ClothingCategory = 'outer' | 'top' | 'bottom' | 'shoes' | 'accessory' | 'dress' | 'sportswear'
export type Season = 'spring' | 'summer' | 'fall' | 'winter'
export type ColorTag = 'white' | 'black' | 'gray' | 'navy' | 'beige' | 'brown' | 'blue' | 'red' | 'green' | 'yellow' | 'pink' | 'purple' | 'multi'

export interface WardrobeItem {
  id: string
  name: string
  category: ClothingCategory
  color: ColorTag
  season: Season[]
  tpo: TPO[]
  emoji: string
  notes?: string
}

// ===== 챗봇 =====
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// ===== 앱 =====
export type AppPage = 'home' | 'wardrobe' | 'settings'

export interface WeatherTheme {
  gradient: string
  cardBg: string
  textPrimary: string
  textSecondary: string
}
