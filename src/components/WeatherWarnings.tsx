import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import type { WeatherWarning } from '../types'

const SEVERITY_STYLES = {
  info:    'bg-blue-500/20 border-blue-400/30 text-blue-100',
  warning: 'bg-amber-500/20 border-amber-400/30 text-amber-100',
  danger:  'bg-red-500/20 border-red-400/30 text-red-100',
}

const SEVERITY_ICONS = { info: 'ℹ️', warning: '⚠️', danger: '🚨' }

interface Props { warnings: WeatherWarning[] }

export default function WeatherWarnings({ warnings }: Props) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const visible = warnings.filter((_, i) => !dismissed.has(i))
  if (!visible.length) return null

  return (
    <div className="w-full max-w-sm mx-auto px-4 space-y-2">
      {warnings.map((w, i) => dismissed.has(i) ? null : (
        <div key={i} className={`flex items-start gap-2 rounded-2xl border px-3 py-2.5 ${SEVERITY_STYLES[w.severity]}`}>
          <span className="text-base mt-0.5">{SEVERITY_ICONS[w.severity]}</span>
          <p className="flex-1 text-sm">{w.message}</p>
          <button onClick={() => setDismissed(s => new Set([...s, i]))} className="opacity-60 hover:opacity-100 mt-0.5">
            <IoClose />
          </button>
        </div>
      ))}
    </div>
  )
}
