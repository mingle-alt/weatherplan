import { useState } from 'react'
import { IoTrashOutline } from 'react-icons/io5'
import type { WardrobeItem, ClothingCategory } from '../types'

const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  outer: '아우터', top: '상의', bottom: '하의',
  shoes: '신발', accessory: '악세서리', dress: '원피스/수트', sportswear: '운동복',
}

const CATEGORY_EMOJIS: Record<ClothingCategory, string> = {
  outer: '🧥', top: '👕', bottom: '👖',
  shoes: '👟', accessory: '🧣', dress: '👗', sportswear: '🏃',
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ClothingCategory[]

interface Props {
  items: WardrobeItem[]
  onRemove: (id: string) => void
  onAdd: () => void
}

export default function WardrobeList({ items, onRemove, onAdd }: Props) {
  const [filter, setFilter] = useState<ClothingCategory | 'all'>('all')

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4">
        <button
          onClick={() => setFilter('all')}
          className={`flex-shrink-0 rounded-2xl px-3 py-1.5 text-sm font-medium transition-all ${
            filter === 'all' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'
          }`}
        >
          전체 ({items.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = items.filter(i => i.category === cat).length
          if (count === 0) return null
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 rounded-2xl px-3 py-1.5 text-sm font-medium transition-all ${
                filter === cat ? 'bg-white text-gray-800' : 'bg-white/20 text-white'
              }`}
            >
              {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]} ({count})
            </button>
          )
        })}
      </div>

      {/* 아이템 그리드 */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/50">
          <p className="text-4xl mb-3">👗</p>
          <p className="text-sm">아직 옷이 없어요</p>
          <button onClick={onAdd} className="mt-4 bg-white/20 rounded-2xl px-4 py-2 text-white text-sm">
            + 첫 아이템 추가하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pt-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <span className="text-2xl">{item.emoji || CATEGORY_EMOJIS[item.category]}</span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-white/40 hover:text-red-300 transition-colors p-1"
                >
                  <IoTrashOutline className="text-sm" />
                </button>
              </div>
              <p className="text-sm font-medium text-white leading-tight">{item.name}</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 text-white/70">
                  {CATEGORY_LABELS[item.category]}
                </span>
                {item.season.map(s => (
                  <span key={s} className="text-xs bg-white/10 rounded-full px-2 py-0.5 text-white/70">
                    {s === 'spring' ? '봄' : s === 'summer' ? '여름' : s === 'fall' ? '가을' : '겨울'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
