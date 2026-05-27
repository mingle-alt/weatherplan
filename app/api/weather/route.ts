import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city");

  if (!lat && !lon && !city) {
    return NextResponse.json({ error: "lat/lon 또는 city 파라미터가 필요합니다" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 설정되지 않았습니다" }, { status: 500 });
  }

  const query = city
    ? `q=${encodeURIComponent(city)}`
    : `lat=${lat}&lon=${lon}`;
  const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric&lang=kr`;

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    const msg = res.status === 404 ? "도시를 찾을 수 없어요. 영문 또는 한글 도시명을 확인해주세요." : "날씨 데이터를 불러올 수 없습니다";
    return NextResponse.json({ error: msg }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
