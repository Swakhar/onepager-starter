import React from 'react'
import { HeroData, ColorScheme, FontScheme } from '@/types/template'
import { TemplateSection } from '../base/TemplateBase'
import { Button } from '@/components/ui/Button'

interface HeroProps {
  data: HeroData
  colors: ColorScheme
  fonts: FontScheme
}

export const Hero: React.FC<HeroProps> = ({ data, colors, fonts }) => {
  return (
    <TemplateSection
      id="hero"
      className="relative overflow-hidden"
      style={{
        backgroundColor: colors.background,
        fontFamily: fonts.body,
      }}
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-6">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            style={{
              color: colors.text,
              fontFamily: fonts.heading,
            }}
          >
            {data.title}
          </h1>
          
          {data.subtitle && (
            <h2
              className="text-2xl sm:text-3xl font-medium"
              style={{
                color: colors.primary,
              }}
            >
              {data.subtitle}
            </h2>
          )}
          
          {data.description && (
            <p
              className="text-lg leading-relaxed max-w-2xl"
              style={{
                color: colors.textSecondary,
              }}
            >
              {data.description}
            </p>
          )}

          {/* CTA Buttons */}
          {data.cta && (
            <div className="flex flex-wrap gap-4 pt-4">
              {data.cta.primary && (
                <a href={data.cta.primary.link} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    style={{
                      backgroundColor: colors.primary,
                      color: '#ffffff',
                    }}
                  >
                    {data.cta.primary.text}
                  </Button>
                </a>
              )}
              {data.cta.secondary && (
                <a href={data.cta.secondary.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    {data.cta.secondary.text}
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Image */}
        {data.image && (
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decoration */}
            <div
              className="absolute -z-10 top-10 right-10 w-full h-full rounded-2xl"
              style={{
                backgroundColor: colors.accent,
                opacity: 0.1,
              }}
            />
          </div>
        )}
      </div>
    </TemplateSection>
  )
}
