import React from 'react'
import { TestimonialsData } from '@/types/template'
import { ColorScheme, FontScheme } from '@/types/template'

interface TestimonialsProps {
  data: TestimonialsData
  colors: ColorScheme
  fonts: FontScheme
}

export const Testimonials: React.FC<TestimonialsProps> = ({ data, colors, fonts }) => {
  return (
    <section
      id="testimonials"
      className="py-20 px-6 sm:px-8 lg:px-12"
      style={{
        backgroundColor: colors.background,
        fontFamily: fonts.body,
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{
              color: colors.text,
              fontFamily: fonts.heading,
            }}
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: colors.textSecondary }}
            >
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              style={{
                backgroundColor: colors.background,
                border: `2px solid ${colors.primary}20`,
              }}
            >
              {/* Rating */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="text-2xl"
                      style={{
                        color: i < testimonial.rating! ? colors.accent : `${colors.textSecondary}40`,
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}

              {/* Quote */}
              <p
                className="text-lg mb-6 italic leading-relaxed"
                style={{ color: colors.text }}
              >
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t"
                style={{ borderColor: `${colors.primary}20` }}
              >
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary,
                    }}
                  >
                    {testimonial.author[0]}
                  </div>
                )}
                <div>
                  <div
                    className="font-bold"
                    style={{ color: colors.text }}
                  >
                    {testimonial.author}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
