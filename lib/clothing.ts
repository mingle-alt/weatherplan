export type ClothingItem = {
  emoji: string;
  label: string;
};

export type ClothingRecommendation = {
  title: string;
  items: ClothingItem[];
  tip: string;
};

// 체감 온도 기반 옷차림 추천
export function getClothingRecommendation(
  feelsLike: number,
  weatherId: number
): ClothingRecommendation {
  const isRainy = weatherId >= 200 && weatherId < 600;
  const isSnowy = weatherId >= 600 && weatherId < 700;
  const isWindy = weatherId >= 700 && weatherId < 800;

  let items: ClothingItem[];
  let title: string;
  let tip: string;

  if (feelsLike <= -10) {
    title = "극한 한파 — 완전 방한 필수";
    items = [
      { emoji: "🧥", label: "롱 패딩 (두꺼운)" },
      { emoji: "👕", label: "히트텍 이중 레이어" },
      { emoji: "🧶", label: "두꺼운 니트" },
      { emoji: "🧣", label: "목도리 필수" },
      { emoji: "🧤", label: "방한 장갑" },
      { emoji: "🧢", label: "귀마개 모자" },
      { emoji: "👖", label: "기모 내복 + 두꺼운 바지" },
      { emoji: "👢", label: "방한 부츠" },
    ];
    tip = "노출 부위를 최소화하세요. 5분 이상 야외 노출 시 동상 위험이 있습니다.";
  } else if (feelsLike <= -5) {
    title = "매우 추워요 — 두꺼운 패딩 필수";
    items = [
      { emoji: "🧥", label: "두꺼운 패딩" },
      { emoji: "👕", label: "히트텍" },
      { emoji: "🧶", label: "니트 스웨터" },
      { emoji: "🧣", label: "목도리" },
      { emoji: "🧤", label: "장갑" },
      { emoji: "👖", label: "기모 바지" },
      { emoji: "👢", label: "방한 부츠" },
    ];
    tip = "내복과 히트텍 착용을 추천해요. 손발 보온에 특히 신경 쓰세요.";
  } else if (feelsLike <= 0) {
    title = "많이 추워요 — 패딩 또는 두꺼운 코트";
    items = [
      { emoji: "🧥", label: "패딩 / 두꺼운 코트" },
      { emoji: "👕", label: "히트텍" },
      { emoji: "🧶", label: "니트" },
      { emoji: "🧣", label: "목도리" },
      { emoji: "👖", label: "기모 청바지" },
      { emoji: "👟", label: "두꺼운 양말 + 운동화" },
    ];
    tip = "바람이 불면 더 춥게 느껴져요. 목과 귀를 감싸는 것이 효과적입니다.";
  } else if (feelsLike <= 4) {
    title = "추워요 — 코트에 레이어링";
    items = [
      { emoji: "🧥", label: "울 코트 / 숏 패딩" },
      { emoji: "🧶", label: "두꺼운 가디건" },
      { emoji: "👕", label: "긴팔 셔츠" },
      { emoji: "🧣", label: "목도리 또는 넥워머" },
      { emoji: "👖", label: "두꺼운 청바지 / 슬랙스" },
    ];
    tip = "안에 두꺼운 레이어를 입고 코트로 마무리하면 따뜻해요.";
  } else if (feelsLike <= 8) {
    title = "쌀쌀해요 — 코트나 두꺼운 재킷";
    items = [
      { emoji: "🧥", label: "코트 / 두꺼운 재킷" },
      { emoji: "🧶", label: "가디건 또는 후드티" },
      { emoji: "👕", label: "긴팔 티셔츠" },
      { emoji: "👖", label: "청바지" },
    ];
    tip = "일교차가 있을 수 있으니 두꺼운 겉옷을 꼭 챙기세요.";
  } else if (feelsLike <= 11) {
    title = "약간 쌀쌀 — 재킷이나 가디건";
    items = [
      { emoji: "🧥", label: "재킷 / 두꺼운 가디건" },
      { emoji: "👕", label: "긴팔 티셔츠" },
      { emoji: "👖", label: "청바지 / 면 슬랙스" },
    ];
    tip = "오후엔 풀고 다닐 수 있도록 탈착이 쉬운 겉옷을 선택하세요.";
  } else if (feelsLike <= 16) {
    title = "선선해요 — 긴팔에 얇은 겉옷";
    items = [
      { emoji: "🧥", label: "얇은 재킷 / 바람막이" },
      { emoji: "👕", label: "긴팔 티셔츠" },
      { emoji: "👖", label: "면바지 / 청바지" },
    ];
    tip = "아침저녁엔 서늘하니 얇은 겉옷을 꼭 챙기세요.";
  } else if (feelsLike <= 19) {
    title = "조금 선선 — 긴팔이면 충분";
    items = [
      { emoji: "👕", label: "긴팔 티셔츠" },
      { emoji: "👘", label: "얇은 가디건 (저녁용)" },
      { emoji: "👖", label: "면바지" },
      { emoji: "👟", label: "운동화 / 로퍼" },
    ];
    tip = "낮에는 쾌적하지만 저녁엔 가디건 하나 챙겨두면 좋아요.";
  } else if (feelsLike <= 22) {
    title = "딱 좋은 날씨 — 가볍게 입어요";
    items = [
      { emoji: "👕", label: "반팔 또는 얇은 긴팔" },
      { emoji: "👖", label: "면바지 / 슬랙스" },
      { emoji: "👟", label: "운동화" },
    ];
    tip = "활동하기 가장 좋은 기온이에요. 편하게 입으세요!";
  } else if (feelsLike <= 26) {
    title = "따뜻해요 — 반팔이 좋아요";
    items = [
      { emoji: "👕", label: "반팔 티셔츠" },
      { emoji: "👖", label: "면바지 / 얇은 바지" },
      { emoji: "👡", label: "샌들 / 운동화" },
      { emoji: "🧴", label: "자외선 차단제" },
    ];
    tip = "자외선이 강할 수 있어요. 선크림을 바르고 나가세요!";
  } else if (feelsLike <= 30) {
    title = "더워요 — 시원한 소재로";
    items = [
      { emoji: "👕", label: "반팔 (린넨 / 면 소재)" },
      { emoji: "🩳", label: "반바지 / 얇은 원피스" },
      { emoji: "🕶️", label: "선글라스" },
      { emoji: "🧴", label: "자외선 차단제" },
    ];
    tip = "통기성 좋은 소재를 선택하고 그늘을 이용하세요.";
  } else {
    title = "매우 더워요 — 최대한 시원하게";
    items = [
      { emoji: "👕", label: "민소매 / 반팔" },
      { emoji: "🩳", label: "반바지 / 원피스" },
      { emoji: "🕶️", label: "선글라스" },
      { emoji: "🧴", label: "자외선 차단제 (SPF50+)" },
      { emoji: "🎩", label: "모자 (햇빛 차단)" },
    ];
    tip = "수분 보충을 자주 하고, 한낮 야외 활동은 피하세요.";
  }

  if (isSnowy) {
    items = items.map((item) =>
      item.label.includes("운동화") || item.label.includes("샌들") || item.label.includes("부츠")
        ? { emoji: "👢", label: "방수 부츠 (필수)" }
        : item
    );
    tip += " 미끄러운 길 주의! 방수·방한 신발을 신으세요.";
  } else if (isRainy) {
    items.push({ emoji: "☂️", label: "우산 필수" });
    tip += " 우산을 꼭 챙기세요!";
  } else if (isWindy) {
    items.push({ emoji: "🧥", label: "바람막이 추천" });
    tip += " 안개·먼지가 있을 수 있어요. 외출 시 마스크를 챙기세요.";
  }

  return { title, items, tip };
}

export type WeatherTheme = {
  gradient: string;
  textColor: string;
  cardBg: string;
};

export function getWeatherTheme(weatherId: number, isNight: boolean): WeatherTheme {
  if (isNight) {
    return {
      gradient: "from-indigo-950 via-slate-900 to-blue-950",
      textColor: "text-blue-100",
      cardBg: "bg-white/10",
    };
  }
  if (weatherId >= 200 && weatherId < 300) {
    return {
      gradient: "from-slate-800 via-gray-700 to-zinc-800",
      textColor: "text-gray-100",
      cardBg: "bg-white/10",
    };
  }
  if (weatherId >= 300 && weatherId < 600) {
    return {
      gradient: "from-slate-700 via-blue-800 to-slate-700",
      textColor: "text-blue-100",
      cardBg: "bg-white/10",
    };
  }
  if (weatherId >= 600 && weatherId < 700) {
    return {
      gradient: "from-sky-200 via-blue-100 to-indigo-200",
      textColor: "text-indigo-900",
      cardBg: "bg-white/40",
    };
  }
  if (weatherId >= 700 && weatherId < 800) {
    return {
      gradient: "from-gray-400 via-slate-300 to-gray-400",
      textColor: "text-gray-800",
      cardBg: "bg-white/30",
    };
  }
  if (weatherId === 800) {
    return {
      gradient: "from-sky-400 via-blue-500 to-cyan-400",
      textColor: "text-white",
      cardBg: "bg-white/20",
    };
  }
  return {
    gradient: "from-blue-400 via-sky-500 to-slate-400",
    textColor: "text-white",
    cardBg: "bg-white/20",
  };
}
