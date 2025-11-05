import React from 'react'
import { FeaturesData } from '@/types/template'
import { ColorScheme, FontScheme } from '@/types/template'

interface FeaturesProps {
  data: FeaturesData
  colors: ColorScheme
  fonts: FontScheme
}

export const Features: React.FC<FeaturesProps> = ({ data, colors, fonts }) => {
  // Merge section-specific colors with global colors
  const sectionColors = {
    ...colors,
    ...data.colors, // Override with section-specific colors if they exist
  }

  return (
    <section
      id="features"
      className="py-20 px-6 sm:px-8 lg:px-12"
      style={{
        backgroundColor: `${sectionColors.primary}10`,
        fontFamily: fonts.body,
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{
              color: sectionColors.text,
              fontFamily: fonts.heading,
            }}
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: sectionColors.textSecondary }}
            >
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((feature) => (
            <div
              key={feature.id}
              className="group text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: sectionColors.background,
                border: `1px solid ${sectionColors.primary}15`,
              }}
            >
              {feature.icon && (
                <div
                  className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-125"
                >
                  {feature.icon}
                </div>
              )}
              <h3
                className="text-lg font-bold mb-3"
                style={{
                  color: sectionColors.text,
                  fontFamily: fonts.heading,
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: sectionColors.textSecondary }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
