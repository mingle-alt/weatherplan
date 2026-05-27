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

  const fetchWeather = () => {
    setState({ status: "locating" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setState({ status: "loading" });
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
        if (!res.ok) {
          setState({ status: "error", message: "날씨 데이터를 불러오지 못했어요." });
          return;
        }
        const data = await res.json();
        setState({ status: "success", data });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState({
            status: "error",
            message: "위치 권한이 거부되었어요.\n브라우저 설정에서 위치 접근을 허용해주세요.",
          });
        } else {
          setState({ status: "error", message: "위치를 가져올 수 없어요." });
        }
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      fetchWeather();
    } else {
      setState({ status: "error", message: "이 브라우저는 위치 서비스를 지원하지 않아요." });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.status === "success") {
    return (
      <div>
        <WeatherDisplay data={state.data} />
        <div className="fixed bottom-6 right-6">
          <button
            onClick={fetchWeather}
            className="bg-white/20 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-xl hover:bg-white/30 transition-colors"
            aria-label="새로고침"
          >
            🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center max-w-xs">
        {state.status === "idle" && (
          <>
            <p className="text-5xl mb-4">🌤️</p>
            <h1 className="text-2xl font-bold mb-2">오늘 뭐 입지?</h1>
            <p className="text-sm opacity-80 mb-6">현재 날씨에 맞는 옷차림을 추천해드려요</p>
            <button
              onClick={fetchWeather}
              className="bg-white text-sky-600 font-semibold rounded-2xl px-8 py-3 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              위치 확인하기
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

        {state.status === "error" && (
          <>
            <p className="text-5xl mb-4">😢</p>
            <p className="text-lg font-medium whitespace-pre-line">{state.message}</p>
            <button
              onClick={fetchWeather}
              className="mt-6 bg-white text-sky-600 font-semibold rounded-2xl px-8 py-3 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              다시 시도
            </button>
          </>
        )}
      </div>
    </div>
  );
}
