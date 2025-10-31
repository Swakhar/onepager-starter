import React from 'react'
import { ColorPicker } from '../controls/ColorPicker'
import { FontSelector } from '../controls/FontSelector'
import { ColorScheme, FontScheme } from '@/types/template'
import { fontOptions, FontFamily } from '@/config/fonts'

interface DesignPanelProps {
  colors: ColorScheme
  fonts: FontScheme
  onColorsChange: (colors: ColorScheme) => void
  onFontsChange: (fonts: FontScheme) => void
}

export const DesignPanel: React.FC<DesignPanelProps> = ({
  colors,
  fonts,
  onColorsChange,
  onFontsChange,
}) => {
  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    onColorsChange({
      ...colors,
      [key]: value,
    })
  }

  const handleFontChange = (type: 'heading' | 'body', fontKey: FontFamily) => {
    const selectedFont = fontOptions[fontKey]
    onFontsChange({
      ...fonts,
      [type]: selectedFont[type],
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Color Scheme</h3>
        <div className="space-y-4">
          <ColorPicker
            label="Primary Color"
            value={colors.primary}
            onChange={(value) => handleColorChange('primary', value)}
          />
          <ColorPicker
            label="Secondary Color"
            value={colors.secondary}
            onChange={(value) => handleColorChange('secondary', value)}
          />
          <ColorPicker
            label="Accent Color"
            value={colors.accent}
            onChange={(value) => handleColorChange('accent', value)}
          />
          <ColorPicker
            label="Background"
            value={colors.background}
            onChange={(value) => handleColorChange('background', value)}
          />
          <ColorPicker
            label="Text Color"
            value={colors.text}
            onChange={(value) => handleColorChange('text', value)}
          />
          <ColorPicker
            label="Secondary Text"
            value={colors.textSecondary}
            onChange={(value) => handleColorChange('textSecondary', value)}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Typography</h3>
        <div className="space-y-4">
          <FontSelector
            label="Heading Font"
            value={
              Object.entries(fontOptions).find(
                ([_, font]) => font.heading === fonts.heading
              )?.[0] as FontFamily || 'modern'
            }
            onChange={(key) => handleFontChange('heading', key)}
          />
          <FontSelector
            label="Body Font"
            value={
              Object.entries(fontOptions).find(
                ([_, font]) => font.body === fonts.body
              )?.[0] as FontFamily || 'modern'
            }
            onChange={(key) => handleFontChange('body', key)}
          />
        </div>
      </div>
    </div>
  )
}
