import React from 'react'
import { Label } from '@/components/ui/Input'
import { fontOptions, FontFamily } from '@/config/fonts'
import { cn } from '@/lib/utils/cn'

interface FontSelectorProps {
  label: string
  value: FontFamily
  onChange: (font: FontFamily) => void
  className?: string
}

export const FontSelector: React.FC<FontSelectorProps> = ({ 
  label, 
  value, 
  onChange,
  className 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FontFamily)}
        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        {Object.keys(fontOptions).map((fontKey) => (
          <option key={fontKey} value={fontKey}>
            {fontKey.charAt(0).toUpperCase() + fontKey.slice(1)}
          </option>
        ))}
      </select>
      
      {/* Preview */}
      <div className="p-3 bg-gray-50 rounded border border-gray-200">
        <p 
          className="text-sm"
          style={{ fontFamily: fontOptions[value].heading }}
        >
          Heading Preview - {value}
        </p>
        <p 
          className="text-xs mt-1 text-gray-600"
          style={{ fontFamily: fontOptions[value].body }}
        >
          Body text preview with the selected font family
        </p>
      </div>
    </div>
  )
}
