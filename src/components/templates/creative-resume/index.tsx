import React from 'react'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'

interface CreativeResumeProps {
  data: TemplateData
  colors: ColorScheme
  fonts: FontScheme
}

const CreativeResume: React.FC<CreativeResumeProps> = ({ data, colors, fonts }) => {
  const { hero, about, experience, education, skills, projects, contact, social } = data

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: fonts.body,
      }}
    >
      {/* Header Section */}
      {hero && (
        <header
          className="py-20 px-4"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            color: 'white',
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {hero.image ? (
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
                  <img
                    src={hero.image}
                    alt={hero.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-6xl bg-white/20 flex-shrink-0">
                  👤
                </div>
              )}

              <div className="text-center md:text-left flex-1">
                <h1
                  className="text-5xl md:text-6xl font-bold mb-3"
                  style={{ fontFamily: fonts.heading }}
                >
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-2xl md:text-3xl font-medium mb-4 opacity-95">
                    {hero.subtitle}
                  </p>
                )}
                {hero.description && (
                  <p className="text-lg opacity-90 max-w-2xl">
                    {hero.description}
                  </p>
                )}

                {/* Contact Info in Header */}
                {contact && (
                  <div className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start">
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 hover:opacity-80 transition"
                      >
                        <span>📧</span>
                        <span>{contact.email}</span>
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 hover:opacity-80 transition"
                      >
                        <span>📱</span>
                        <span>{contact.phone}</span>
                      </a>
                    )}
                    {contact.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{contact.location}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Links in Header */}
                {social && (
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    {social.linkedin && (
                      <a
                        href={social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition"
                      >
                        💼
                      </a>
                    )}
                    {social.github && (
                      <a
                        href={social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition"
                      >
                        💻
                      </a>
                    )}
                    {social.twitter && (
                      <a
                        href={social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition"
                      >
                        🐦
                      </a>
                    )}
                    {social.website && (
                      <a
                        href={social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition"
                      >
                        🌐
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Skills & Education */}
          <div className="lg:col-span-1 space-y-12">
            {/* Skills Section */}
            {skills && skills.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-6 pb-3 border-b-2"
                  style={{
                    fontFamily: fonts.heading,
                    color: colors.primary,
                    borderColor: colors.primary,
                  }}
                >
                  Skills
                </h2>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          {skill.name}
                        </span>
                        <span
                          className="text-sm font-semibold"
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
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {education && education.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-6 pb-3 border-b-2"
                  style={{
                    fontFamily: fonts.heading,
                    color: colors.primary,
                    borderColor: colors.primary,
                  }}
                >
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{ color: colors.text }}
                      >
                        {edu.degree}
                      </h3>
                      <p
                        className="font-medium mb-1"
                        style={{ color: colors.secondary }}
                      >
                        {edu.school}
                      </p>
                      <p
                        className="text-sm mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        {edu.startDate} - {edu.endDate}
                        {edu.location && ` • ${edu.location}`}
                      </p>
                      {edu.gpa && (
                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.primary }}
                        >
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.description && (
                        <p
                          className="text-sm mt-2"
                          style={{ color: colors.textSecondary }}
                        >
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* About Section (if in sidebar) */}
            {about && (
              <section>
                <h2
                  className="text-2xl font-bold mb-6 pb-3 border-b-2"
                  style={{
                    fontFamily: fonts.heading,
                    color: colors.primary,
                    borderColor: colors.primary,
                  }}
                >
                  {about.title}
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ color: colors.textSecondary }}
                >
                  {about.description}
                </p>
              </section>
            )}
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="lg:col-span-2 space-y-12">
            {/* Experience Section */}
            {experience && experience.length > 0 && (
              <section>
                <h2
                  className="text-3xl font-bold mb-8 pb-3 border-b-2"
                  style={{
                    fontFamily: fonts.heading,
                    color: colors.primary,
                    borderColor: colors.primary,
                  }}
                >
                  Experience
                </h2>
                <div className="space-y-8">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8 border-l-2" style={{ borderColor: colors.primary }}>
                      <div
                        className="absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px]"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <div>
                        <h3
                          className="text-xl font-bold mb-1"
                          style={{
                            fontFamily: fonts.heading,
                            color: colors.text,
                          }}
                        >
                          {exp.title}
                        </h3>
                        <p
                          className="text-lg font-semibold mb-2"
                          style={{ color: colors.secondary }}
                        >
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        <p
                          className="text-sm font-medium mb-3"
                          style={{ color: colors.textSecondary }}
                        >
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </p>
                        <p
                          className="leading-relaxed mb-3"
                          style={{ color: colors.textSecondary }}
                        >
                          {exp.description}
                        </p>
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li
                                key={i}
                                className="flex gap-2 text-sm"
                                style={{ color: colors.textSecondary }}
                              >
                                <span style={{ color: colors.primary }}>▸</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {projects && projects.length > 0 && (
              <section>
                <h2
                  className="text-3xl font-bold mb-8 pb-3 border-b-2"
                  style={{
                    fontFamily: fonts.heading,
                    color: colors.primary,
                    borderColor: colors.primary,
                  }}
                >
                  Featured Projects
                </h2>
                <div className="space-y-8">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl overflow-hidden shadow-lg"
                      style={{ backgroundColor: 'white' }}
                    >
                      {project.image && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3
                          className="text-xl font-bold mb-2"
                          style={{
                            fontFamily: fonts.heading,
                            color: colors.text,
                          }}
                        >
                          {project.title}
                        </h3>
                        <p
                          className="mb-4"
                          style={{ color: colors.textSecondary }}
                        >
                          {project.description}
                        </p>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs font-medium rounded-full"
                                style={{
                                  backgroundColor: colors.primary + '15',
                                  color: colors.primary,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-3">
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition text-white"
                              style={{ backgroundColor: colors.primary }}
                            >
                              View Project →
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                              style={{
                                backgroundColor: colors.textSecondary + '20',
                                color: colors.text,
                              }}
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreativeResume
