import { useState } from 'react'
import { useSceneStore } from '../store/scene'
import type { LightType } from '../lights/types'
import { LIGHT_LABELS, LIGHT_ICONS } from '../lights/types'
import { LightControls } from './LightControls'

const LIGHT_TYPES: LightType[] = ['softbox', 'reflector', 'beauty_dish', 'bounce', 'window']

const HEAD_Y = 1.5 // výška hlavy subjektu

export function Sidebar() {
  const { lights, selectedId, selectLight, addLight, viewMode } = useSceneStore()
  const isTopDown = viewMode === 'topdown'
  const [addOpen, setAddOpen] = useState(false)

  const handleAdd = (type: LightType) => {
    addLight(type, isTopDown ? HEAD_Y : undefined)
    setAddOpen(false)
  }

  return (
    <div className="w-64 flex-shrink-0 bg-gray-900 border-l border-gray-700 flex flex-col overflow-hidden">
      {/* Přidat světlo */}
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={() => setAddOpen((o) => !o)}
          className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded font-medium transition-colors"
        >
          + Přidat světlo
        </button>

        {isTopDown && (
          <div className="mt-1.5 text-xs text-blue-400 text-center">
            Top-down: světlo se přidá ve výšce hlavy
          </div>
        )}

        {addOpen && (
          <div className="mt-2 flex flex-col gap-1">
            {LIGHT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleAdd(type)}
                className="flex items-center gap-2 py-1.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded transition-colors text-left"
              >
                <span>{LIGHT_ICONS[type]}</span>
                <span>{LIGHT_LABELS[type]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Seznam světel */}
      <div className="flex-1 overflow-y-auto">
        {lights.length === 0 ? (
          <div className="p-3 text-sm text-gray-500 italic">Žádná světla</div>
        ) : (
          <div className="p-2 flex flex-col gap-1">
            {lights.map((light) => (
              <button
                key={light.id}
                onClick={() => selectLight(light.id === selectedId ? null : light.id)}
                className={`flex items-center gap-2 py-2 px-3 rounded text-sm text-left transition-colors ${
                  light.id === selectedId
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <span>{LIGHT_ICONS[light.type]}</span>
                <span className="flex-1">{LIGHT_LABELS[light.type]}</span>
                <span className="text-xs text-gray-500">{light.intensity.toFixed(1)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ovládání vybraného světla */}
      <div className="border-t border-gray-700">
        <div className="px-3 pt-3 pb-1 text-xs text-gray-500 uppercase tracking-wide">
          {selectedId ? 'Nastavení světla' : 'Vybrané světlo'}
        </div>
        <LightControls />
      </div>
    </div>
  )
}
