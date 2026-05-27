import { useState, useRef, useEffect } from 'react'
import { IoClose, IoSend } from 'react-icons/io5'
import type { ChatMessage, CurrentWeather, ForecastItem, OutfitResult, UserSettings, WardrobeItem, TPO } from '../types'

const TPO_LABELS: Record<TPO, string> = {
  casual: '캐주얼', work: '출근', date: '데이트', exercise: '운동', formal: '격식',
}

function buildSystemPrompt(
  current: CurrentWeather | null,
  forecast: ForecastItem[],
  outfit: OutfitResult | null,
  settings: UserSettings,
  wardrobe: WardrobeItem[],
): string {
  const temps = forecast.map(f => f.temp)
  const tempRange = temps.length > 0
    ? `${Math.min(...temps)}~${Math.max(...temps)}°C`
    : '정보 없음'

  const wardrobeSummary = wardrobe.length === 0
    ? '옷장이 비어 있어요.'
    : wardrobe.slice(0, 20).map(w => `${w.emoji || ''} ${w.name} (${w.category}, ${w.color})`).join(', ')

  const outfitSummary = outfit
    ? outfit.items.map(i => `${i.emoji} ${i.label}`).join(', ')
    : '추천 없음'

  return `당신은 날씨 기반 패션 코디 어시스턴트입니다. 친근하고 실용적인 코디 조언을 해주세요.

## 현재 날씨
${current ? `- 위치: ${current.name}, ${current.country}
- 현재: ${current.temp}°C (체감 ${current.feelsLike}°C)
- 날씨: ${current.weather.description}
- 습도: ${current.humidity}%, 바람: ${current.windSpeed}m/s
- 오늘 기온 범위: ${tempRange}` : '날씨 정보 없음'}

## 사용자 설정
- TPO: ${TPO_LABELS[settings.tpo]}
- 온도 민감도: ${settings.sensitivity > 0 ? `더위 민감 (+${settings.sensitivity}°C)` : settings.sensitivity < 0 ? `추위 민감 (${settings.sensitivity}°C)` : '보통'}

## 현재 추천 코디
${outfitSummary}

## 사용자 옷장 (${wardrobe.length}개)
${wardrobeSummary}

답변 규칙:
- 한국어로 친근하게 답변하세요
- 옷장 아이템이 있으면 그것을 우선 활용해 구체적으로 추천하세요
- 답변은 3~5문장으로 간결하게 유지하세요
- 온도 수치보다 "오늘 쌀쌀하니까..." 같은 자연어 표현을 사용하세요`
}

interface Props {
  current: CurrentWeather | null
  forecast: ForecastItem[]
  outfit: OutfitResult | null
  settings: UserSettings
  wardrobe: WardrobeItem[]
  onClose: () => void
}

const QUICK_QUESTIONS = [
  '오늘 어떤 코디가 좋을까요?',
  '비 올 것 같은데 뭐 입어야 해요?',
  '출근하기 좋은 옷차림 추천해줘',
  '데이트 코디 추천해줘',
]

export default function ChatBot({ current, forecast, outfit, settings, wardrobe, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `안녕하세요! 👋 오늘 코디 고민이 있으신가요? ${current ? `현재 ${current.name}의 날씨는 ${current.temp}°C에요.` : ''} 무엇이든 물어보세요!`,
      timestamp: Date.now(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const assistantMsg: ChatMessage = { role: 'assistant', content: '', timestamp: Date.now() }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          systemPrompt: buildSystemPrompt(current, forecast, outfit, settings, wardrobe),
        }),
      })

      if (!res.ok) throw new Error('응답 실패')
      const data = await res.json() as { text?: string; error?: string }
      const reply = data.text ?? data.error ?? '응답을 가져올 수 없어요.'
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: reply } : m))
    } catch {
      setMessages(prev => prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, content: '죄송해요, 응답을 가져오는 데 실패했어요. 잠시 후 다시 시도해주세요.' } : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/95 backdrop-blur-xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div>
          <h2 className="text-white font-semibold">AI 코디 챗봇</h2>
          <p className="text-white/50 text-xs">Claude AI 기반 패션 어시스턴트</p>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white p-2">
          <IoClose className="text-xl" />
        </button>
      </div>

      {/* 메시지 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                ✨
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-white text-gray-900 rounded-br-sm'
                : 'bg-white/10 text-white rounded-bl-sm'
            }`}>
              {msg.content === '' && isLoading && i === messages.length - 1
                ? <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                : msg.content
              }
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 빠른 질문 */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              className="flex-shrink-0 bg-white/10 text-white text-xs rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 입력 */}
      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 border-t border-white/10">
        <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="코디 질문을 입력하세요..."
            disabled={isLoading}
            className="flex-1 bg-white/10 rounded-2xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-white text-gray-900 rounded-2xl px-4 py-2.5 disabled:opacity-40 transition-opacity"
          >
            <IoSend className="text-sm" />
          </button>
        </form>
      </div>
    </div>
  )
}
