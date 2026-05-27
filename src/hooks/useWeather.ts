import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchByCoords, fetchByCity } from '../lib/weatherApi'
import type { CurrentWeather, ForecastItem } from '../types'

type WeatherStatus = 'idle' | 'locating' | 'loading' | 'success' | 'error'

interface WeatherState {
  status: WeatherStatus
  current: CurrentWeather | null
  forecast: ForecastItem[]
  error: string | null
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    status: 'idle',
    current: null,
    forecast: [],
    error: null,
  })
  const lastQuery = useRef<{ type: 'gps'; lat: number; lon: number } | { type: 'city'; city: string } | null>(null)

  const fetchByGps = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState(s => ({ ...s, status: 'error', error: '이 브라우저는 위치 서비스를 지원하지 않아요.' }))
      return
    }
    setState(s => ({ ...s, status: 'locating', error: null }))
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords
        lastQuery.current = { type: 'gps', lat: latitude, lon: longitude }
        setState(s => ({ ...s, status: 'loading' }))
        try {
          const data = await fetchByCoords(latitude, longitude)
          setState({ status: 'success', current: data.current, forecast: data.forecast, error: null })
        } catch (e) {
          setState(s => ({ ...s, status: 'error', error: (e as Error).message }))
        }
      },
      err => {
        const msg = err.code === err.PERMISSION_DENIED
          ? '위치 권한이 거부되었어요.\n브라우저 설정에서 위치 접근을 허용해주세요.'
          : '위치를 가져올 수 없어요.'
        setState(s => ({ ...s, status: 'error', error: msg }))
      },
      { timeout: 10000 }
    )
  }, [])

  const fetchCity = useCallback(async (city: string) => {
    lastQuery.current = { type: 'city', city }
    setState(s => ({ ...s, status: 'loading', error: null }))
    try {
      const data = await fetchByCity(city)
      setState({ status: 'success', current: data.current, forecast: data.forecast, error: null })
    } catch (e) {
      setState(s => ({ ...s, status: 'error', error: (e as Error).message }))
    }
  }, [])

  const refresh = useCallback(() => {
    const q = lastQuery.current
    if (!q) { fetchByGps(); return }
    if (q.type === 'gps') {
      setState(s => ({ ...s, status: 'loading', error: null }))
      fetchByCoords(q.lat, q.lon).then(data => {
        setState({ status: 'success', current: data.current, forecast: data.forecast, error: null })
      }).catch(e => {
        setState(s => ({ ...s, status: 'error', error: (e as Error).message }))
      })
    } else {
      fetchCity(q.city)
    }
  }, [fetchByGps, fetchCity])

  useEffect(() => { fetchByGps() }, [fetchByGps])

  return { ...state, fetchByGps, fetchCity, refresh }
}
