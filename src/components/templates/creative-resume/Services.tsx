import React from 'react'
import { ServicesData } from '@/types/template'
import { ColorScheme, FontScheme } from '@/types/template'

interface ServicesProps {
  data: ServicesData
  colors: ColorScheme
  fonts: FontScheme
}

export const Services: React.FC<ServicesProps> = ({ data, colors, fonts }) => {
  // Merge section-specific colors with global colors
  const sectionColors = {
    ...colors,
    ...data.colors, // Override with section-specific colors if they exist
  }

  return (
    <section
      id="services"
      className="py-20 px-6 sm:px-8 lg:px-12"
      style={{
        backgroundColor: sectionColors.background,
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((service) => (
            <div
              key={service.id}
              className="group p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{
                backgroundColor: sectionColors.background,
                border: `2px solid ${sectionColors.primary}20`,
              }}
            >
              {service.icon && (
                <div
                  className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110"
                >
                  {service.icon}
                </div>
              )}
              <h3
                className="text-2xl font-bold mb-4"
                style={{
                  color: sectionColors.text,
                  fontFamily: fonts.heading,
                }}
              >
                {service.title}
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: sectionColors.textSecondary }}
              >
                {service.description}
              </p>
              {service.features && service.features.length > 0 && (
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2"
                      style={{ color: sectionColors.textSecondary }}
                    >
                      <span style={{ color: sectionColors.primary }}>✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
