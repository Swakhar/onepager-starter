import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Label } from '@/components/ui/Input'
import { cn } from '@/lib/utils/cn'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  className?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-10 rounded-md border border-gray-300 flex items-center gap-3 px-3 hover:border-gray-400 transition-colors"
        >
          <div
            className="w-6 h-6 rounded border border-gray-200 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm font-mono uppercase">{value}</span>
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
              <HexColorPicker color={value} onChange={onChange} />
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm font-mono border border-gray-300 rounded"
                  placeholder="#000000"
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
