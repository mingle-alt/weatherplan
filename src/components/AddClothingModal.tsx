import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import type { WardrobeItem, ClothingCategory, Season, ColorTag, TPO } from '../types'

type NewItem = Omit<WardrobeItem, 'id'>

const CATEGORIES: { value: ClothingCategory; label: string; emoji: string }[] = [
  { value: 'outer',      label: '아우터',    emoji: '🧥' },
  { value: 'top',        label: '상의',      emoji: '👕' },
  { value: 'bottom',     label: '하의',      emoji: '👖' },
  { value: 'shoes',      label: '신발',      emoji: '👟' },
  { value: 'accessory',  label: '악세서리',   emoji: '🧣' },
  { value: 'dress',      label: '원피스/수트', emoji: '👗' },
  { value: 'sportswear', label: '운동복',     emoji: '🏃' },
]

const SEASONS: { value: Season; label: string }[] = [
  { value: 'spring', label: '봄' },
  { value: 'summer', label: '여름' },
  { value: 'fall',   label: '가을' },
  { value: 'winter', label: '겨울' },
]

const TPOS: { value: TPO; label: string }[] = [
  { value: 'casual',   label: '캐주얼' },
  { value: 'work',     label: '출근' },
  { value: 'date',     label: '데이트' },
  { value: 'exercise', label: '운동' },
  { value: 'formal',   label: '격식' },
]

const COLORS: { value: ColorTag; bg: string }[] = [
  { value: 'white',  bg: 'bg-white border border-gray-200' },
  { value: 'black',  bg: 'bg-black' },
  { value: 'gray',   bg: 'bg-gray-400' },
  { value: 'navy',   bg: 'bg-blue-900' },
  { value: 'blue',   bg: 'bg-blue-500' },
  { value: 'beige',  bg: 'bg-amber-100 border border-amber-200' },
  { value: 'brown',  bg: 'bg-amber-800' },
  { value: 'red',    bg: 'bg-red-500' },
  { value: 'green',  bg: 'bg-green-600' },
  { value: 'yellow', bg: 'bg-yellow-400' },
  { value: 'pink',   bg: 'bg-pink-400' },
  { value: 'purple', bg: 'bg-purple-500' },
  { value: 'multi',  bg: 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400' },
]

interface Props {
  onAdd: (item: NewItem) => void
  onClose: () => void
}

export default function AddClothingModal({ onAdd, onClose }: Props) {
  const [form, setForm] = useState<NewItem>({
    name: '',
    category: 'top',
    color: 'black',
    season: ['spring', 'fall'],
    tpo: ['casual'],
    emoji: '',
    notes: '',
  })

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({ ...form, name: form.name.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-gray-900/95 backdrop-blur-xl rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">옷 추가하기</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><IoClose className="text-xl" /></button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* 이름 */}
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">이름 *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="예: 화이트 기본 티셔츠"
              className="w-full bg-white/10 rounded-2xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none"
            />
          </div>

          {/* 이모지 */}
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">이모지 (선택)</label>
            <input
              value={form.emoji}
              onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              placeholder="👕"
              maxLength={2}
              className="w-full bg-white/10 rounded-2xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: c.value }))}
                  className={`rounded-2xl px-3 py-1.5 text-sm transition-all ${
                    form.category === c.value ? 'bg-white text-gray-900 font-medium' : 'bg-white/10 text-white'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 색상 */}
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">색상</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: c.value }))}
                  className={`w-8 h-8 rounded-full ${c.bg} transition-all ${
                    form.color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                  }`}
                  title={c.value}
                />
              ))}
            </div>
          </div>

          {/* 계절 */}
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">계절 (복수 선택)</label>
            <div className="flex gap-2">
              {SEASONS.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, season: toggleArr(f.season, s.value) }))}
                  className={`flex-1 rounded-2xl py-2 text-sm transition-all ${
                    form.season.includes(s.value) ? 'bg-white text-gray-900 font-medium' : 'bg-white/10 text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* TPO */}
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">TPO (복수 선택)</label>
            <div className="flex flex-wrap gap-2">
              {TPOS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, tpo: toggleArr(f.tpo, t.value) }))}
                  className={`rounded-2xl px-3 py-1.5 text-sm transition-all ${
                    form.tpo.includes(t.value) ? 'bg-white text-gray-900 font-medium' : 'bg-white/10 text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">메모 (선택)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="추가 메모..."
              rows={2}
              className="w-full bg-white/10 rounded-2xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-gray-900 font-semibold rounded-2xl py-3 text-sm hover:bg-white/90 transition-colors"
          >
            저장하기
          </button>
        </form>
      </div>
    </div>
  )
}
