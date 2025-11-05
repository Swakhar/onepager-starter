import React from 'react'
import { Button } from '../ui/Button'

interface SectionOrderManagerProps {
  data: any
  onDataChange: (data: any) => void
  templateId?: string
}

const sectionLabels: Record<string, string> = {
  hero: '🚀 Hero',
  about: '👋 About',
  services: '⚡ Services',
  features: '✨ Features',
  projects: '💼 Projects',
  skills: '🎯 Skills',
  testimonials: '⭐ Testimonials',
  contact: '📧 Contact',
}

export const SectionOrderManager: React.FC<SectionOrderManagerProps> = ({
  data,
  onDataChange,
  templateId = 'modern-portfolio',
}) => {
  // Default section order
  const defaultOrder = ['hero', 'about', 'services', 'features', 'projects', 'skills', 'testimonials', 'contact']
  const currentOrder = data.sectionOrder || defaultOrder

  // Filter to only show sections that have data
  const availableSections = currentOrder.filter((sectionId: string) => {
    if (sectionId === 'hero') return !!data.hero
    if (sectionId === 'about') return !!data.about
    if (sectionId === 'services') return data.services && data.services.items?.length > 0
    if (sectionId === 'features') return data.features && data.features.items?.length > 0
    if (sectionId === 'projects') return data.projects && data.projects.length > 0
    if (sectionId === 'skills') return data.skills && data.skills.length > 0
    if (sectionId === 'testimonials') return data.testimonials && data.testimonials.items?.length > 0
    if (sectionId === 'contact') return !!data.contact
    return false
  })

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...currentOrder]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newOrder.length) return
    
    // Swap
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
    
    onDataChange({
      ...data,
      sectionOrder: newOrder,
    })
  }

  const resetOrder = () => {
    onDataChange({
      ...data,
      sectionOrder: undefined,
    })
  }

  if (availableSections.length <= 1) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">📋</p>
          <p>Add more sections to customize their order</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Section Order</h4>
          <p className="text-xs text-gray-500">Arrange how sections appear on your page</p>
        </div>
        {data.sectionOrder && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetOrder}
            className="text-xs"
          >
            🔄 Reset
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {currentOrder.map((sectionId: string, index: number) => {
          const hasData = availableSections.includes(sectionId)
          if (!hasData) return null

          const isFirst = index === 0
          const isLast = index === currentOrder.length - 1

          return (
            <div
              key={sectionId}
              className="flex items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={isFirst}
                  className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                    isFirst
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={isLast}
                  className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                    isLast
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                  title="Move down"
                >
                  ↓
                </button>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{sectionLabels[sectionId]}</div>
                  <div className="text-xs text-gray-500">
                    {sectionId === 'hero' && 'Main landing section'}
                    {sectionId === 'about' && data.about?.title}
                    {sectionId === 'services' && `${data.services?.items?.length || 0} services`}
                    {sectionId === 'features' && `${data.features?.items?.length || 0} features`}
                    {sectionId === 'projects' && `${data.projects?.length || 0} projects`}
                    {sectionId === 'skills' && `${data.skills?.length || 0} skills`}
                    {sectionId === 'testimonials' && `${data.testimonials?.items?.length || 0} testimonials`}
                    {sectionId === 'contact' && 'Contact information'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Visual indicator for alternating backgrounds */}
                {sectionId !== 'hero' && (
                  <div
                    className="w-6 h-6 rounded border-2"
                    style={{
                      backgroundColor: (index - 1) % 2 === 1 ? '#f3f4f6' : '#ffffff',
                      borderColor: '#d1d5db',
                    }}
                    title={(index - 1) % 2 === 1 ? 'Alternate background' : 'Normal background'}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-green-500 to-teal-500 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-sm">💡</span>
          <div className="flex-1">
            <p className="text-xs text-gray-900 font-medium mb-1">Alternating Backgrounds</p>
            <p className="text-xs text-gray-700">
              Sections automatically alternate between normal and alternate background colors for better visual separation.
              You can customize these colors in the Design panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
