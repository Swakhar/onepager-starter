import React from 'react'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'

export interface TemplateBaseProps {
  data: TemplateData
  colors: ColorScheme
  fonts: FontScheme
  className?: string
}

export interface TemplateSectionProps {
  id: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const TemplateSection: React.FC<TemplateSectionProps> = ({ 
  id, 
  children, 
  className = '',
  style
}) => {
  return (
    <section
      id={id}
      className={`py-16 px-6 sm:px-8 lg:px-12 ${className}`}
      style={style}
    >
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </section>
  )
}

export const TemplateContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  )
}
