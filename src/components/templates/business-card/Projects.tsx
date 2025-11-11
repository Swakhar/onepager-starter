import React from 'react'
import { ProjectData, ColorScheme, FontScheme } from '@/types/template'

interface ProjectsProps {
  data: ProjectData[]
  colors: ColorScheme
  fonts: FontScheme
  isAlternate?: boolean
}

export const Projects: React.FC<ProjectsProps> = ({ data, colors, fonts, isAlternate = false }) => {
  if (!data || data.length === 0) return null

  const bgColor = isAlternate ? colors.backgroundAlt : colors.background

  return (
    <section
      id="projects"
      className="py-20 px-4"
      style={{
        backgroundColor: bgColor,
        fontFamily: fonts.body,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: colors.text,
              fontFamily: fonts.heading,
              fontSize: fonts.headingSizes.h2,
            }}
          >
            Portfolio & Projects
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Showcasing our successful work and achievements
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((project) => (
            <div
              key={project.id}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: 'white' }}
            >
              {project.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    color: colors.primary,
                    fontFamily: fonts.heading,
                  }}
                >
                  {project.title}
                </h3>
                
                <p
                  className="text-sm mb-4 line-clamp-3"
                  style={{ color: colors.textSecondary }}
                >
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span
                        className="px-2 py-1 text-xs font-medium"
                        style={{ color: colors.textSecondary }}
                      >
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                {(project.link || project.github) && (
                  <div className="flex gap-3 pt-3 border-t" style={{ borderColor: colors.textSecondary + '20' }}>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline flex items-center gap-1"
                        style={{ color: colors.primary }}
                      >
                        <span>View</span>
                        <span>→</span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline flex items-center gap-1"
                        style={{ color: colors.secondary }}
                      >
                        <span>Code</span>
                        <span>→</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
