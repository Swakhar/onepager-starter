import React from 'react'
import { AboutData, ColorScheme, FontScheme } from '@/types/template'
import { TemplateSection } from '../base/TemplateBase'

interface AboutProps {
  data: AboutData
  colors: ColorScheme
  fonts: FontScheme
}

export const About: React.FC<AboutProps> = ({ data, colors, fonts }) => {
  return (
    <TemplateSection
      id="about"
      style={{
        backgroundColor: colors.background,
        fontFamily: fonts.body,
      }}
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Image */}
        {data.image && (
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`space-y-6 order-1 ${data.image ? 'lg:order-2' : ''}`}>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              color: colors.text,
              fontFamily: fonts.heading,
            }}
          >
            {data.title}
          </h2>
          
          <p
            className="text-lg leading-relaxed"
            style={{
              color: colors.textSecondary,
            }}
          >
            {data.description}
          </p>

          {/* Highlights */}
          {data.highlights && data.highlights.length > 0 && (
            <ul className="space-y-3 pt-4">
              {data.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 flex-shrink-0 mt-0.5"
                    style={{ color: colors.primary }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className="text-base"
                    style={{ color: colors.text }}
                  >
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </TemplateSection>
  )
}
