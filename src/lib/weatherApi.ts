import type { CurrentWeather, ForecastItem } from '../types'

const KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string
const BASE = 'https://api.openweathermap.org/data/2.5'

type RawCurrent = {
  name: string
  sys: { country: string; sunrise: number; sunset: number }
  main: { temp: number; feels_like: number; humidity: number }
  weather: Array<{ id: number; main: string; description: string; icon: string }>
  wind: { speed: number }
  coord: { lat: number; lon: number }
  dt: number
}

type RawForecastList = {
  dt: number
  main: { temp: number; feels_like: number }
  weather: Array<{ id: number; main: string; description: string; icon: string }>
  pop: number
}

async function owmFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 404) throw new Error('도시를 찾을 수 없어요.')
    if (res.status === 401) throw new Error('API 키가 유효하지 않아요.')
    throw new Error('날씨 데이터를 불러올 수 없어요.')
  }
  return res.json() as Promise<T>
}

function parseCurrent(raw: RawCurrent): CurrentWeather {
  return {
    name: raw.name,
    country: raw.sys.country,
    temp: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    weather: raw.weather[0],
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    dt: raw.dt,
    lat: raw.coord.lat,
    lon: raw.coord.lon,
  }
}

function parseForecast(list: RawForecastList[]): ForecastItem[] {
  return list.map(item => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    pop: item.pop,
    weather: item.weather[0],
  }))
}

export async function fetchByCoords(lat: number, lon: number): Promise<{
  current: CurrentWeather
  forecast: ForecastItem[]
}> {
  const params = `lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=kr`
  const [rawCurrent, rawForecast] = await Promise.all([
    owmFetch<RawCurrent>(`${BASE}/weather?${params}`),
    owmFetch<{ list: RawForecastList[] }>(`${BASE}/forecast?${params}&cnt=8`),
  ])
  return {
    current: parseCurrent(rawCurrent),
    forecast: parseForecast(rawForecast.list),
  }
}

// Geocoding API로 한글/영문 도시명 → 좌표 변환
async function geocodeCity(city: string): Promise<{ lat: number; lon: number }> {
  type GeoResult = { lat: number; lon: number; name: string; local_names?: Record<string, string> }
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${KEY}`
  const results = await owmFetch<GeoResult[]>(url)
  if (!results || results.length === 0) throw new Error('도시를 찾을 수 없어요. 다른 이름으로 검색해보세요.')
  return { lat: results[0].lat, lon: results[0].lon }
}

export async function fetchByCity(city: string): Promise<{
  current: CurrentWeather
  forecast: ForecastItem[]
}> {
  const { lat, lon } = await geocodeCity(city)
  return fetchByCoords(lat, lon)
}
