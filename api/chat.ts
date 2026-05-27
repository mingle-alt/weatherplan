import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

type Message = { role: 'user' | 'assistant'; content: string }

export default async function handler(req: any, res: any): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.status(200).end(); return }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const { messages, systemPrompt } = (req.body ?? {}) as {
    messages?: Message[]
    systemPrompt?: string
  }

  if (!Array.isArray(messages) || !systemPrompt) {
    res.status(400).json({ error: '잘못된 요청 형식이에요.' }); return
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: 'GROQ_API_KEY가 설정되지 않았어요. Vercel 환경변수를 확인해주세요.' }); return
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10),
      ],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    res.status(200).json({ text })
  } catch (err) {
    console.error('Groq API error:', err)
    res.status(500).json({ error: '챗봇 응답에 실패했어요. 잠시 후 다시 시도해주세요.' })
  }
}
