import { useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import WardrobeList from '../components/WardrobeList'
import AddClothingModal from '../components/AddClothingModal'
import type { WardrobeItem } from '../types'

interface Props {
  items: WardrobeItem[]
  onAdd: (item: Omit<WardrobeItem, 'id'>) => void
  onRemove: (id: string) => void
}

export default function Wardrobe({ items, onAdd, onRemove }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 헤더 */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-white text-xl font-bold">내 옷장</h1>
        <p className="text-white/50 text-xs mt-1">총 {items.length}개의 아이템</p>
      </div>

      <WardrobeList items={items} onRemove={onRemove} onAdd={() => setShowModal(true)} />

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="옷 추가"
      >
        <IoAdd className="text-gray-900 text-2xl" />
      </button>

      {showModal && (
        <AddClothingModal onAdd={onAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
