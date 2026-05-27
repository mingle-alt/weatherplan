import { IoHome, IoHomeOutline, IoShirt, IoShirtOutline, IoSettings, IoSettingsOutline } from 'react-icons/io5'
import type { AppPage } from '../types'

interface Props {
  current: AppPage
  onNavigate: (page: AppPage) => void
}

const TABS: { page: AppPage; label: string; Icon: React.ComponentType<{className?: string}>; ActiveIcon: React.ComponentType<{className?: string}> }[] = [
  { page: 'home',     label: '날씨',  Icon: IoHomeOutline,     ActiveIcon: IoHome },
  { page: 'wardrobe', label: '옷장',  Icon: IoShirtOutline,    ActiveIcon: IoShirt },
  { page: 'settings', label: '설정',  Icon: IoSettingsOutline, ActiveIcon: IoSettings },
]

export default function BottomNav({ current, onNavigate }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-white/10">
      <div className="flex justify-around items-center py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map(({ page, label, Icon, ActiveIcon }) => {
          const active = current === page
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-2xl transition-all ${
                active ? 'text-white' : 'text-white/50'
              }`}
            >
              {active
                ? <ActiveIcon className="text-2xl" />
                : <Icon className="text-2xl" />
              }
              <span className={`text-xs font-medium ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
