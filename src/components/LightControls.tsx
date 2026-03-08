import { useSceneStore } from '../store/scene'
import { LIGHT_LABELS, LIGHT_ICONS } from '../lights/types'
import { kelvinToColor } from '../lights/colorTemp'

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = '',
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  unit?: string
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  )
}

export function LightControls() {
  const { lights, selectedId, updateLight, removeLight } = useSceneStore()
  const light = lights.find((l) => l.id === selectedId)

  if (!light) {
    return (
      <div className="p-3 text-sm text-gray-500 italic">
        Vyberte světlo kliknutím v 3D scéně
      </div>
    )
  }

  const colorPreview = kelvinToColor(light.colorTemp)
  const isRect = light.type === 'softbox' || light.type === 'window' || light.type === 'bounce'
  const isSpot = light.type === 'reflector' || light.type === 'beauty_dish'

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{LIGHT_ICONS[light.type]}</span>
        <span className="font-medium text-white">{LIGHT_LABELS[light.type]}</span>
      </div>

      <Slider
        label="Intenzita"
        value={light.intensity}
        min={0}
        max={10}
        step={0.1}
        onChange={(v) => updateLight(light.id, { intensity: v })}
      />

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Teplota barvy</span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full border border-gray-600"
              style={{ background: colorPreview }}
            />
            {light.colorTemp}K
          </span>
        </div>
        <input
          type="range"
          min={2700}
          max={7000}
          step={100}
          value={light.colorTemp}
          onChange={(e) => updateLight(light.id, { colorTemp: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
          style={{
            background: `linear-gradient(to right, #ff8c00, #fff5e0, #e8f4ff, #b3d4ff)`,
          }}
        />
      </div>

      {isRect && (
        <>
          <Slider
            label="Šířka"
            value={light.width ?? 1}
            min={0.1}
            max={4}
            step={0.1}
            unit="m"
            onChange={(v) => updateLight(light.id, { width: v })}
          />
          <Slider
            label="Výška"
            value={light.height ?? 1}
            min={0.1}
            max={4}
            step={0.1}
            unit="m"
            onChange={(v) => updateLight(light.id, { height: v })}
          />
        </>
      )}

      {isSpot && (
        <>
          <Slider
            label="Úhel kužele"
            value={Math.round((light.angle ?? 0.4) * (180 / Math.PI))}
            min={5}
            max={60}
            step={1}
            unit="°"
            onChange={(v) => updateLight(light.id, { angle: v * (Math.PI / 180) })}
          />
          <Slider
            label="Přechod (penumbra)"
            value={light.penumbra ?? 0.5}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => updateLight(light.id, { penumbra: v })}
          />
        </>
      )}

      <button
        onClick={() => removeLight(light.id)}
        className="w-full mt-2 py-1.5 px-3 bg-red-900 hover:bg-red-700 text-red-200 text-sm rounded transition-colors"
      >
        Smazat světlo
      </button>
    </div>
  )
}
