import SettingsPanel from '../components/SettingsPanel'
import type { UserSettings } from '../types'

interface Props {
  settings: UserSettings
  onUpdate: (patch: Partial<UserSettings>) => void
}

export default function Settings({ settings, onUpdate }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-white text-xl font-bold">설정</h1>
        <p className="text-white/50 text-xs mt-1">개인화 옵션을 조정해요</p>
      </div>
      <SettingsPanel settings={settings} onUpdate={onUpdate} />
    </div>
  )
}
