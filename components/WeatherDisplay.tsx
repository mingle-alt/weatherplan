"use client";

import { useState } from "react";
import { getClothingRecommendation, getWeatherTheme } from "@/lib/clothing";

type WeatherData = {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { id: number; description: string; icon: string }[];
  wind: { speed: number };
};

type Props = {
  data: WeatherData;
  onGpsRefresh: () => void;
  onCitySearch: (city: string) => void;
};

export default function WeatherDisplay({ data, onGpsRefresh, onCitySearch }: Props) {
  const [input, setInput] = useState("");

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherId = data.weather[0].id;
  const now = Date.now() / 1000;
  const isNight = now < data.sys.sunrise || now > data.sys.sunset;

  const theme = getWeatherTheme(weatherId, isNight);
  const clothing = getClothingRecommendation(temp, weatherId);
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCitySearch(input.trim());
    setInput("");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} ${theme.textColor} flex flex-col items-center p-4 pt-6`}>

      {/* 검색창 */}
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="다른 도시 검색 (예: Seoul, 부산)"
          className={`flex-1 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none ${theme.cardBg} backdrop-blur-sm ${theme.textColor === "text-white" || theme.textColor === "text-blue-100" || theme.textColor === "text-gray-100" ? "bg-white/20 text-white placeholder:text-white/60" : "bg-white/60"}`}
        />
        <button
          type="submit"
          className={`${theme.cardBg} backdrop-blur-sm rounded-2xl px-4 py-2.5 text-lg hover:opacity-80 transition-opacity`}
        >
          🔍
        </button>
        <button
          type="button"
          onClick={onGpsRefresh}
          className={`${theme.cardBg} backdrop-blur-sm rounded-2xl px-4 py-2.5 text-lg hover:opacity-80 transition-opacity`}
          aria-label="현재 위치로"
        >
          📍
        </button>
      </form>

      {/* 위치 & 날씨 헤더 */}
      <div className="w-full max-w-sm text-center mb-6">
        <p className="text-sm opacity-70 mb-1">{data.name}, {data.sys.country}</p>
        <div className="flex items-center justify-center gap-2">
          <img src={iconUrl} alt={data.weather[0].description} className="w-16 h-16 drop-shadow-lg" />
          <div>
            <p className="text-6xl font-thin">{temp}°</p>
            <p className="text-sm opacity-80 capitalize">{data.weather[0].description}</p>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-3 text-xs opacity-70">
          <span>체감 {feelsLike}°</span>
          <span>습도 {data.main.humidity}%</span>
          <span>바람 {data.wind.speed}m/s</span>
        </div>
      </div>

      {/* 옷차림 추천 */}
      <div className={`w-full max-w-sm rounded-3xl ${theme.cardBg} backdrop-blur-sm p-5 shadow-lg`}>
        <h2 className="text-lg font-semibold mb-1">👗 오늘의 옷차림</h2>
        <p className="text-sm opacity-80 mb-4">{clothing.title}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {clothing.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-xl ${theme.cardBg} backdrop-blur-sm px-3 py-2`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl ${theme.cardBg} p-3`}>
          <p className="text-sm opacity-90">💡 {clothing.tip}</p>
        </div>
      </div>
    </div>
  );
}
