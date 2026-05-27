export type ClothingItem = {
  emoji: string;
  label: string;
};

export type ClothingRecommendation = {
  title: string;
  items: ClothingItem[];
  tip: string;
};

export function getClothingRecommendation(
  temp: number,
  weatherId: number
): ClothingRecommendation {
  const isRainy = weatherId >= 200 && weatherId < 700;
  const isSnowy = weatherId >= 600 && weatherId < 700;

  let items: ClothingItem[];
  let title: string;
  let tip: string;

  if (temp <= 0) {
    title = "한파 대비 완전무장";
    items = [
      { emoji: "🧥", label: "두꺼운 패딩" },
      { emoji: "🧣", label: "목도리" },
      { emoji: "🧤", label: "장갑" },
      { emoji: "🧢", label: "귀마개 / 모자" },
      { emoji: "🧦", label: "두꺼운 양말" },
      { emoji: "👢", label: "방한 부츠" },
    ];
    tip = "체감 온도가 더 낮을 수 있어요. 최대한 따뜻하게 입으세요!";
  } else if (temp <= 5) {
    title = "두꺼운 겨울 코트 필수";
    items = [
      { emoji: "🧥", label: "두꺼운 코트 / 패딩" },
      { emoji: "👕", label: "히트텍 / 내복" },
      { emoji: "🧶", label: "니트 스웨터" },
      { emoji: "🧣", label: "목도리" },
      { emoji: "🧤", label: "장갑" },
      { emoji: "👖", label: "기모 바지" },
    ];
    tip = "내복 착용을 추천해요. 바람 막이 점퍼도 좋아요.";
  } else if (temp <= 10) {
    title = "코트와 레이어링";
    items = [
      { emoji: "🧥", label: "코트" },
      { emoji: "🧶", label: "니트 / 두꺼운 가디건" },
      { emoji: "👕", label: "긴팔 셔츠" },
      { emoji: "👖", label: "기모 청바지 / 슬랙스" },
    ];
    tip = "일교차가 클 수 있으니 레이어링으로 조절하세요.";
  } else if (temp <= 15) {
    title = "재킷이나 가디건 챙기세요";
    items = [
      { emoji: "🧥", label: "재킷 / 가디건" },
      { emoji: "👕", label: "긴팔 티셔츠" },
      { emoji: "👖", label: "청바지 / 면바지" },
    ];
    tip = "아침저녁엔 쌀쌀해요. 얇은 겉옷 하나는 꼭 챙기세요.";
  } else if (temp <= 19) {
    title = "얇은 겉옷 준비";
    items = [
      { emoji: "👘", label: "얇은 바람막이" },
      { emoji: "👕", label: "긴팔 티셔츠" },
      { emoji: "👖", label: "청바지 / 슬랙스" },
    ];
    tip = "낮엔 따뜻하지만 저녁엔 서늘할 수 있어요.";
  } else if (temp <= 23) {
    title = "가볍게 입기 좋은 날";
    items = [
      { emoji: "👕", label: "반팔 또는 긴팔" },
      { emoji: "👖", label: "면바지" },
      { emoji: "👟", label: "운동화 / 로퍼" },
    ];
    tip = "활동하기 좋은 기온이에요.";
  } else if (temp <= 27) {
    title = "반팔이 딱 좋아요";
    items = [
      { emoji: "👕", label: "반팔 티셔츠" },
      { emoji: "🩳", label: "반바지 / 면바지" },
      { emoji: "👡", label: "샌들 / 운동화" },
    ];
    tip = "자외선 차단제 꼭 바르세요!";
  } else {
    title = "더위 대비 시원하게";
    items = [
      { emoji: "👕", label: "민소매 / 반팔" },
      { emoji: "🩳", label: "반바지 / 원피스" },
      { emoji: "🕶️", label: "선글라스" },
      { emoji: "🧴", label: "자외선 차단제" },
    ];
    tip = "충분한 수분 섭취와 그늘 이용을 추천해요.";
  }

  if (isSnowy) {
    items = items.map((item) =>
      item.label.includes("부츠") || item.label.includes("신발")
        ? { emoji: "👢", label: "방수 부츠" }
        : item
    );
    tip += " 미끄럼에 주의하고 방수 신발을 신으세요!";
  } else if (isRainy) {
    items.push({ emoji: "☂️", label: "우산 필수" });
    tip += " 우산을 꼭 챙기세요!";
  }

  return { title, items, tip };
}

export type WeatherTheme = {
  gradient: string;
  textColor: string;
  cardBg: string;
  iconFilter: string;
};

export function getWeatherTheme(weatherId: number, isNight: boolean): WeatherTheme {
  if (isNight) {
    return {
      gradient: "from-indigo-950 via-slate-900 to-blue-950",
      textColor: "text-blue-100",
      cardBg: "bg-white/10",
      iconFilter: "",
    };
  }

  if (weatherId >= 200 && weatherId < 300) {
    return {
      gradient: "from-slate-800 via-gray-700 to-zinc-800",
      textColor: "text-gray-100",
      cardBg: "bg-white/10",
      iconFilter: "",
    };
  }
  if (weatherId >= 300 && weatherId < 600) {
    return {
      gradient: "from-slate-700 via-blue-800 to-slate-700",
      textColor: "text-blue-100",
      cardBg: "bg-white/10",
      iconFilter: "",
    };
  }
  if (weatherId >= 600 && weatherId < 700) {
    return {
      gradient: "from-sky-200 via-blue-100 to-indigo-200",
      textColor: "text-indigo-900",
      cardBg: "bg-white/40",
      iconFilter: "",
    };
  }
  if (weatherId >= 700 && weatherId < 800) {
    return {
      gradient: "from-gray-400 via-slate-300 to-gray-400",
      textColor: "text-gray-800",
      cardBg: "bg-white/30",
      iconFilter: "",
    };
  }
  if (weatherId === 800) {
    return {
      gradient: "from-sky-400 via-blue-500 to-cyan-400",
      textColor: "text-white",
      cardBg: "bg-white/20",
      iconFilter: "",
    };
  }
  return {
    gradient: "from-blue-400 via-sky-500 to-slate-400",
    textColor: "text-white",
    cardBg: "bg-white/20",
    iconFilter: "",
  };
}
