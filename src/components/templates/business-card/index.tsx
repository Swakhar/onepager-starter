import React from 'react'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'

interface BusinessCardProps {
  data: TemplateData
  colors: ColorScheme
  fonts: FontScheme
}

const BusinessCard: React.FC<BusinessCardProps> = ({ data, colors, fonts }) => {
  const { hero, about, contact, social, skills } = data

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: fonts.body,
      }}
    >
      {/* Hero/Profile Section - Centered Card */}
      {hero && (
        <section className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full">
            <div
              className="rounded-3xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: 'white' }}
            >
              <div className="grid md:grid-cols-5">
                {/* Left Side - Profile Image */}
                <div
                  className="md:col-span-2 p-8 md:p-12 flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  {hero.image ? (
                    <div className="relative">
                      <div
                        className="w-48 h-48 rounded-full overflow-hidden border-8 shadow-xl"
                        style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                      >
                        <img
                          src={hero.image}
                          alt={hero.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-48 h-48 rounded-full flex items-center justify-center text-6xl border-8 shadow-xl"
                      style={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                      }}
                    >
                      👤
                    </div>
                  )}
                </div>

                {/* Right Side - Info */}
                <div className="md:col-span-3 p-8 md:p-12">
                  <div className="space-y-6">
                    <div>
                      <h1
                        className="text-4xl md:text-5xl font-bold mb-2"
                        style={{
                          fontFamily: fonts.heading,
                          fontSize: fonts.headingSizes.h1,
                          color: colors.primary,
                        }}
                      >
                        {hero.title}
                      </h1>
                      {hero.subtitle && (
                        <p
                          className="text-xl md:text-2xl font-medium mb-4"
                          style={{ color: colors.secondary }}
                        >
                          {hero.subtitle}
                        </p>
                      )}
                      {hero.description && (
                        <p
                          className="text-lg leading-relaxed"
                          style={{ color: colors.textSecondary }}
                        >
                          {hero.description}
                        </p>
                      )}
                    </div>

                    {/* Contact Info */}
                    {contact && (
                      <div className="space-y-3 pt-6 border-t" style={{ borderColor: colors.textSecondary + '20' }}>
                        {contact.email && (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: colors.primary }}
                            >
                              📧
                            </div>
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:underline"
                              style={{ color: colors.text }}
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: colors.primary }}
                            >
                              📱
                            </div>
                            <a
                              href={`tel:${contact.phone}`}
                              className="hover:underline"
                              style={{ color: colors.text }}
                            >
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        {contact.location && (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: colors.primary }}
                            >
                              📍
                            </div>
                            <span style={{ color: colors.text }}>{contact.location}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Social Links */}
                    {social && (
                      <div className="flex flex-wrap gap-3 pt-4">
                        {social.website && (
                          <a
                            href={social.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            🌐
                          </a>
                        )}
                        {social.linkedin && (
                          <a
                            href={social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            💼
                          </a>
                        )}
                        {social.twitter && (
                          <a
                            href={social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            🐦
                          </a>
                        )}
                        {social.github && (
                          <a
                            href={social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            💻
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{
                fontFamily: fonts.heading,
                fontSize: fonts.headingSizes.h2,
                color: colors.primary,
              }}
            >
              Skills & Expertise
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-6 rounded-xl shadow-lg"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.text }}
                    >
                      {skill.name}
                    </h3>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.primary }}
                    >
                      {skill.level || 0}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.textSecondary + '20' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.level || 0}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </div>
                  {skill.category && (
                    <p
                      className="text-sm mt-2"
                      style={{ color: colors.textSecondary }}
                    >
                      {skill.category}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {about && (
        <section className="py-20 px-4" style={{ backgroundColor: colors.primary + '10' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{
                fontFamily: fonts.heading,
                fontSize: fonts.headingSizes.h2,
                color: colors.primary,
              }}
            >
              {about.title}
            </h2>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: colors.textSecondary }}
            >
              {about.description}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

export default BusinessCard
