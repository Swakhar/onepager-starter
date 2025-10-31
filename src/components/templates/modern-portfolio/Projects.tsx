import React from 'react'
import { ProjectData, ColorScheme, FontScheme } from '@/types/template'
import { TemplateSection } from '../base/TemplateBase'
import { Card, CardContent } from '@/components/ui/Card'

interface ProjectsProps {
  data: ProjectData[]
  colors: ColorScheme
  fonts: FontScheme
}

export const Projects: React.FC<ProjectsProps> = ({ data, colors, fonts }) => {
  if (!data || data.length === 0) return null

  return (
    <TemplateSection
      id="projects"
      style={{
        backgroundColor: colors.background,
        fontFamily: fonts.body,
      }}
    >
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: colors.text,
              fontFamily: fonts.heading,
            }}
          >
            Featured Projects
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            Check out some of my recent work
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {project.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    color: colors.text,
                    fontFamily: fonts.heading,
                  }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: colors.textSecondary }}
                >
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${colors.primary}15`,
                          color: colors.primary,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: colors.primary }}
                    >
                      View Project →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: colors.secondary }}
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TemplateSection>
  )
}
