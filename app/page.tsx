"use client";

import { useEffect, useState } from "react";
import WeatherDisplay from "@/components/WeatherDisplay";

type WeatherData = {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { id: number; description: string; icon: string }[];
  wind: { speed: number };
};

type State =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [cityInput, setCityInput] = useState("");

  const fetchWeatherByGps = () => {
    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setState({ status: "loading" });
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
        if (!res.ok) {
          const err = await res.json();
          setState({ status: "error", message: err.error ?? "날씨 데이터를 불러오지 못했어요." });
          return;
        }
        setState({ status: "success", data: await res.json() });
      },
      (err) => {
        setState({
          status: "error",
          message:
            err.code === err.PERMISSION_DENIED
              ? "위치 권한이 거부되었어요.\n브라우저 설정에서 위치 접근을 허용해주세요."
              : "위치를 가져올 수 없어요.",
        });
      },
      { timeout: 10000 }
    );
  };

  const fetchWeatherByCity = async (city: string) => {
    if (!city.trim()) return;
    setState({ status: "loading" });
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
    if (!res.ok) {
      const err = await res.json();
      setState({ status: "error", message: err.error ?? "날씨 데이터를 불러오지 못했어요." });
      return;
    }
    setState({ status: "success", data: await res.json() });
    setCityInput("");
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      fetchWeatherByGps();
    } else {
      setState({ status: "error", message: "이 브라우저는 위치 서비스를 지원하지 않아요." });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.status === "success") {
    return (
      <WeatherDisplay
        data={state.data}
        onGpsRefresh={fetchWeatherByGps}
        onCitySearch={fetchWeatherByCity}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center w-full max-w-xs">
        {(state.status === "idle" || state.status === "error") && (
          <>
            <p className="text-5xl mb-4">{state.status === "error" ? "😢" : "🌤️"}</p>
            <h1 className="text-2xl font-bold mb-2">오늘 뭐 입지?</h1>
            {state.status === "error" && (
              <p className="text-sm opacity-80 mb-4 whitespace-pre-line">{state.message}</p>
            )}
            {state.status === "idle" && (
              <p className="text-sm opacity-80 mb-4">현재 날씨에 맞는 옷차림을 추천해드려요</p>
            )}

            {/* 도시 검색 */}
            <form
              onSubmit={(e) => { e.preventDefault(); fetchWeatherByCity(cityInput); }}
              className="flex gap-2 mb-3"
            >
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="도시명 입력 (예: Seoul, 서울)"
                className="flex-1 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none shadow-inner"
              />
              <button
                type="submit"
                className="bg-white text-sky-600 font-semibold rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                🔍
              </button>
            </form>

            {/* 구분선 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/30" />
              <span className="text-xs opacity-60">또는</span>
              <div className="flex-1 h-px bg-white/30" />
            </div>

            <button
              onClick={fetchWeatherByGps}
              className="w-full bg-white text-sky-600 font-semibold rounded-2xl px-8 py-3 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              📍 현재 위치로 찾기
            </button>
          </>
        )}

        {state.status === "locating" && (
          <>
            <p className="text-5xl mb-4 animate-pulse">📍</p>
            <p className="text-lg font-medium">위치 확인 중...</p>
            <p className="text-sm opacity-70 mt-2">위치 접근 권한을 허용해주세요</p>
          </>
        )}

        {state.status === "loading" && (
          <>
            <p className="text-5xl mb-4 animate-spin">🌀</p>
            <p className="text-lg font-medium">날씨 불러오는 중...</p>
          </>
        )}
      </div>
    </div>
  );
}
