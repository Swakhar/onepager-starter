import React, { useState } from 'react'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { AIAssistant } from '@/components/editor/AIAssistant'
import { TemplateData, HeroData, AboutData, ContactData, ProjectData, SkillData } from '@/types/template'

interface ContentPanelProps {
  data: TemplateData
  onDataChange: (data: TemplateData) => void
}

type Section = 'hero' | 'about' | 'projects' | 'skills' | 'contact' | 'social'

export const ContentPanel: React.FC<ContentPanelProps> = ({ data, onDataChange }) => {
  const [activeSection, setActiveSection] = useState<Section>('hero')
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [expandedSkill, setExpandedSkill] = useState<number | null>(null)

  const handleHeroChange = (field: keyof HeroData, value: any) => {
    onDataChange({
      ...data,
      hero: {
        ...data.hero!,
        [field]: value,
      },
    })
  }

  const handleAboutChange = (field: keyof AboutData, value: any) => {
    onDataChange({
      ...data,
      about: {
        ...data.about!,
        [field]: value,
      },
    })
  }

  const handleContactChange = (field: keyof ContactData, value: any) => {
    onDataChange({
      ...data,
      contact: {
        ...data.contact!,
        [field]: value,
      },
    })
  }

  const handleSocialChange = (platform: string, value: string) => {
    onDataChange({
      ...data,
      social: {
        ...data.social,
        [platform]: value,
      },
    })
  }

  const handleProjectChange = (index: number, field: keyof ProjectData, value: any) => {
    const newProjects = [...(data.projects || [])]
    newProjects[index] = {
      ...newProjects[index],
      [field]: value,
    }
    onDataChange({
      ...data,
      projects: newProjects,
    })
  }

  const handleProjectTechChange = (projectIndex: number, techIndex: number, value: string) => {
    const newProjects = [...(data.projects || [])]
    const newTags = [...(newProjects[projectIndex].tags || [])]
    newTags[techIndex] = value
    newProjects[projectIndex] = {
      ...newProjects[projectIndex],
      tags: newTags,
    }
    onDataChange({
      ...data,
      projects: newProjects,
    })
  }

  const addProject = () => {
    const newProject: ProjectData = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: 'Project description',
      image: '',
      tags: [],
      link: '',
      github: '',
    }
    onDataChange({
      ...data,
      projects: [...(data.projects || []), newProject],
    })
    setExpandedProject((data.projects || []).length)
  }

  const removeProject = (index: number) => {
    const newProjects = [...(data.projects || [])]
    newProjects.splice(index, 1)
    onDataChange({
      ...data,
      projects: newProjects,
    })
    setExpandedProject(null)
  }

  const addTechnology = (projectIndex: number) => {
    const newProjects = [...(data.projects || [])]
    newProjects[projectIndex] = {
      ...newProjects[projectIndex],
      tags: [...(newProjects[projectIndex].tags || []), 'New Tech'],
    }
    onDataChange({
      ...data,
      projects: newProjects,
    })
  }

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const newProjects = [...(data.projects || [])]
    const newTags = [...(newProjects[projectIndex].tags || [])]
    newTags.splice(techIndex, 1)
    newProjects[projectIndex] = {
      ...newProjects[projectIndex],
      tags: newTags,
    }
    onDataChange({
      ...data,
      projects: newProjects,
    })
  }

  const handleSkillChange = (index: number, field: keyof SkillData, value: any) => {
    const newSkills = [...(data.skills || [])]
    newSkills[index] = {
      ...newSkills[index],
      [field]: value,
    }
    onDataChange({
      ...data,
      skills: newSkills,
    })
  }

  const addSkill = () => {
    const newSkill: SkillData = {
      id: `skill-${Date.now()}`,
      name: 'New Skill',
      level: 80,
      category: 'Technical',
    }
    onDataChange({
      ...data,
      skills: [...(data.skills || []), newSkill],
    })
    setExpandedSkill((data.skills || []).length)
  }

  const removeSkill = (index: number) => {
    const newSkills = [...(data.skills || [])]
    newSkills.splice(index, 1)
    onDataChange({
      ...data,
      skills: newSkills,
    })
    setExpandedSkill(null)
  }

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...(data.projects || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newProjects.length) return
    
    [newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]]
    onDataChange({
      ...data,
      projects: newProjects,
    })
  }

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const newSkills = [...(data.skills || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newSkills.length) return
    
    [newSkills[index], newSkills[newIndex]] = [newSkills[newIndex], newSkills[index]]
    onDataChange({
      ...data,
      skills: newSkills,
    })
  }

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'hero', label: 'Hero', icon: '🎯' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'contact', label: 'Contact', icon: '📧' },
    { id: 'social', label: 'Social', icon: '🔗' },
  ]

  return (
    <div className="space-y-4">
      {/* Section Navigation */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium rounded transition-all ${
              activeSection === section.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{section.icon}</span>
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {/* Hero Section */}
        {activeSection === 'hero' && data.hero && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 pb-3 border-b">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
            </div>
            
            <div>
              <Label>Title *</Label>
              <div className="flex items-start gap-2 mt-1">
                <Input
                  value={data.hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  placeholder="Your name or headline"
                  className="flex-1"
                />
                <AIAssistant
                  currentText={data.hero.title}
                  onApply={(newText) => handleHeroChange('title', newText)}
                  context="hero title"
                />
              </div>
            </div>
            <div>
              <Label>Subtitle</Label>
              <div className="flex items-start gap-2 mt-1">
                <Input
                  value={data.hero.subtitle || ''}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Your tagline"
                  className="flex-1"
                />
                <AIAssistant
                  currentText={data.hero.subtitle || ''}
                  onApply={(newText) => handleHeroChange('subtitle', newText)}
                  context="hero subtitle"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <div className="flex items-start gap-2 mt-1">
                <Textarea
                  value={data.hero.description || ''}
                  onChange={(e) => handleHeroChange('description', e.target.value)}
                  placeholder="Tell visitors about yourself"
                  className="flex-1"
                  rows={3}
                />
                <AIAssistant
                  currentText={data.hero.description || ''}
                  onApply={(newText) => handleHeroChange('description', newText)}
                  context="hero description"
                />
              </div>
            </div>
            <div>
              <ImageUpload
                label="Hero Image"
                value={data.hero.image || ''}
                onChange={(url) => handleHeroChange('image', url)}
                aspectRatio="landscape"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use high-quality images for best results
              </p>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && data.about && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 pb-3 border-b">
              <span className="text-2xl">👤</span>
              <h3 className="text-lg font-semibold text-gray-900">About Section</h3>
            </div>
            
            <div>
              <Label>Title *</Label>
              <div className="flex items-start gap-2 mt-1">
                <Input
                  value={data.about.title}
                  onChange={(e) => handleAboutChange('title', e.target.value)}
                  placeholder="About Me"
                  className="flex-1"
                />
                <AIAssistant
                  currentText={data.about.title}
                  onApply={(newText) => handleAboutChange('title', newText)}
                  context="about section title"
                />
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <div className="flex items-start gap-2 mt-1">
                <Textarea
                  value={data.about.description || ''}
                  onChange={(e) => handleAboutChange('description', e.target.value)}
                  placeholder="Tell your story..."
                  className="flex-1"
                  rows={4}
                />
                <AIAssistant
                  currentText={data.about.description || ''}
                  onApply={(newText) => handleAboutChange('description', newText)}
                  context="about section description"
                />
              </div>
            </div>
            <div>
              <ImageUpload
                label="About Image"
                value={data.about.image || ''}
                onChange={(url) => handleAboutChange('image', url)}
                aspectRatio="portrait"
              />
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💼</span>
                <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {(data.projects || []).length}
                </span>
              </div>
              <Button size="sm" onClick={addProject}>
                + Add Project
              </Button>
            </div>

            {(data.projects || []).length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2 block">💼</span>
                <p className="text-gray-600 mb-3">No projects yet</p>
                <Button size="sm" onClick={addProject}>
                  Add Your First Project
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {(data.projects || []).map((project, index) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveProject(index, 'up')
                            }}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveProject(index, 'down')
                            }}
                            disabled={index === (data.projects || []).length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{project.title}</p>
                          <p className="text-xs text-gray-500">
                            {project.tags?.length || 0} tags
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeProject(index)
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                        <span className="text-gray-400">
                          {expandedProject === index ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>

                    {expandedProject === index && (
                      <div className="p-4 space-y-4">
                        <div>
                          <Label>Project Title *</Label>
                          <Input
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                            placeholder="E-commerce Platform"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Description *</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            placeholder="Describe your project..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <ImageUpload
                            label="Project Image"
                            value={project.image || ''}
                            onChange={(url) => handleProjectChange(index, 'image', url)}
                            aspectRatio="landscape"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Live Link</Label>
                            <Input
                              value={project.link || ''}
                              onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                              placeholder="https://..."
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>GitHub Link</Label>
                            <Input
                              value={project.github || ''}
                              onChange={(e) => handleProjectChange(index, 'github', e.target.value)}
                              placeholder="https://github.com/..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Technologies</Label>
                            <button
                              onClick={() => addTechnology(index)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              + Add Tag
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(project.tags || []).map((tech, techIndex) => (
                              <div
                                key={techIndex}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded"
                              >
                                <input
                                  type="text"
                                  value={tech}
                                  onChange={(e) => handleProjectTechChange(index, techIndex, e.target.value)}
                                  className="w-20 bg-transparent border-none outline-none text-sm"
                                />
                                <button
                                  onClick={() => removeTechnology(index, techIndex)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            {(project.tags || []).length === 0 && (
                              <p className="text-xs text-gray-500">No technologies added yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                  {(data.skills || []).length}
                </span>
              </div>
              <Button size="sm" onClick={addSkill}>
                + Add Skill
              </Button>
            </div>

            {(data.skills || []).length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2 block">⚡</span>
                <p className="text-gray-600 mb-3">No skills yet</p>
                <Button size="sm" onClick={addSkill}>
                  Add Your First Skill
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {(data.skills || []).map((skill, index) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedSkill(expandedSkill === index ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSkill(index, 'up')
                            }}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSkill(index, 'down')
                            }}
                            disabled={index === (data.skills || []).length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{skill.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${skill.level || 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{skill.level || 0}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSkill(index)
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                        <span className="text-gray-400">
                          {expandedSkill === index ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>

                    {expandedSkill === index && (
                      <div className="p-4 space-y-4">
                        <div>
                          <Label>Skill Name *</Label>
                          <Input
                            value={skill.name}
                            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                            placeholder="React.js"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Proficiency Level ({skill.level || 0}%)</Label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level || 0}
                            onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))}
                            className="w-full mt-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Beginner</span>
                            <span>Expert</span>
                          </div>
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input
                            value={skill.category || ''}
                            onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                            placeholder="Frontend, Backend, Design..."
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && data.contact && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 pb-3 border-b">
              <span className="text-2xl">📧</span>
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={data.contact.email || ''}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={data.contact.phone || ''}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={data.contact.location || ''}
                onChange={(e) => handleContactChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Social Links */}
        {activeSection === 'social' && data.social && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 pb-3 border-b">
              <span className="text-2xl">🔗</span>
              <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
            </div>
            
            <div>
              <Label>GitHub</Label>
              <Input
                value={data.social.github || ''}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                placeholder="https://github.com/username"
                className="mt-1"
              />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input
                value={data.social.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Twitter</Label>
              <Input
                value={data.social.twitter || ''}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                placeholder="https://twitter.com/username"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={data.social.website || ''}
                onChange={(e) => handleSocialChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={data.social.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/username"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Dribbble</Label>
              <Input
                value={data.social.dribbble || ''}
                onChange={(e) => handleSocialChange('dribbble', e.target.value)}
                placeholder="https://dribbble.com/username"
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
