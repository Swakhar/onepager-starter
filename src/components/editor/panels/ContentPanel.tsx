import React, { useState } from 'react'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { AIAssistant } from '@/components/editor/AIAssistant'
import { ImageSuggestions } from '@/components/editor/ImageSuggestions'
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`group relative flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="hidden sm:inline font-semibold">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Hero Section */}
        {activeSection === 'hero' && data.hero && (
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-md">
                🎯
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hero Section</h3>
                <p className="text-xs text-gray-500">First impression matters - make it count!</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">Title *</Label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <div className="relative">
                  <Input
                    value={data.hero.title}
                    onChange={(e) => handleHeroChange('title', e.target.value)}
                    placeholder="Your name or headline"
                    className="pr-12"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AIAssistant
                      currentText={data.hero.title}
                      onApply={(newText) => handleHeroChange('title', newText)}
                      context="hero title"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">💡 Make it catchy and memorable</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">Subtitle</Label>
                  <span className="text-xs text-gray-400">Optional</span>
                </div>
                <div className="relative">
                  <Input
                    value={data.hero.subtitle || ''}
                    onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                    placeholder="Your tagline or role"
                    className="pr-12"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AIAssistant
                      currentText={data.hero.subtitle || ''}
                      onApply={(newText) => handleHeroChange('subtitle', newText)}
                      context="hero subtitle"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">✨ Brief description of what you do</p>
              </div>

              {/* Description - Textarea with AI in corner */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Description <span className="text-xs text-gray-500">Optional</span>
                </label>
                <div className="relative">
                  <textarea
                    value={data.hero.description || ''}
                    onChange={(e) => handleHeroChange('description', e.target.value)}
                    placeholder="Brief description of what you do (60-120 characters)"
                    rows={3}
                    className="w-full px-3 py-2 pr-20 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="absolute top-2 right-2">
                    <AIAssistant
                      currentText={data.hero.description || ''}
                      onApply={(text) => handleHeroChange('description', text)}
                      context="hero description"
                      isTextarea={true}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Expand on your expertise and passion
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700">Hero Image</Label>
                <ImageSuggestions
                  context="professional hero banner"
                  onSelect={(url) => handleHeroChange('image', url)}
                  orientation="landscape"
                />
              </div>
              <ImageUpload
                label=""
                value={data.hero.image || ''}
                onChange={(url) => handleHeroChange('image', url)}
                aspectRatio="landscape"
              />
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-900 mb-1">Pro Tips</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use high-quality, professional images (1920x1080px recommended)</li>
                      <li>• Ensure good contrast for text readability</li>
                      <li>• Consider your brand colors and personality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && data.about && (
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-md">
                👤
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">About Section</h3>
                <p className="text-xs text-gray-500">Share your story and personality</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">Title *</Label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <div className="relative">
                  <Input
                    value={data.about.title}
                    onChange={(e) => handleAboutChange('title', e.target.value)}
                    placeholder="About Me"
                    className="pr-12"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AIAssistant
                      currentText={data.about.title}
                      onApply={(newText) => handleAboutChange('title', newText)}
                      context="about section title"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">🎯 Section heading for your story</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">Description *</Label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <div className="relative">
                  <Textarea
                    value={data.about.description || ''}
                    onChange={(e) => handleAboutChange('description', e.target.value)}
                    placeholder="Share your journey, experience, and what drives you..."
                    className="pr-12 resize-none"
                    rows={6}
                  />
                  <div className="absolute right-2 top-2">
                    <AIAssistant
                      currentText={data.about.description || ''}
                      onApply={(newText) => handleAboutChange('description', newText)}
                      context="about section description"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-500">📖 Tell your story authentically</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {(data.about.description || '').length} characters
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700">About Image</Label>
                <ImageSuggestions
                  context="professional portrait headshot"
                  onSelect={(url) => handleAboutChange('image', url)}
                  orientation="portrait"
                />
              </div>
              <ImageUpload
                label=""
                value={data.about.image || ''}
                onChange={(url) => handleAboutChange('image', url)}
                aspectRatio="portrait"
              />
              <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-lg">✨</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-purple-900 mb-1">Image Guidelines</p>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Portrait orientation works best (1:1 or 3:4 ratio)</li>
                      <li>• Professional headshot or lifestyle photo</li>
                      <li>• Good lighting and clear focus on subject</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xl shadow-md">
                  💼
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Projects</h3>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {(data.projects || []).length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Showcase your best work</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={addProject}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                + Add
              </Button>
            </div>

            {(data.projects || []).length === 0 ? (
              <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2 block">💼</span>
                <p className="text-gray-700 font-medium mb-2">No projects yet</p>
                <p className="text-xs text-gray-500 mb-3">Add your first project to showcase your work</p>
                <Button 
                  size="sm" 
                  onClick={addProject}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                >
                  Add Your First Project
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {(data.projects || []).map((project, index) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-200"
                  >
                    <div
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 cursor-pointer"
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
                            className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition-colors"
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveProject(index, 'down')
                            }}
                            disabled={index === (data.projects || []).length - 1}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition-colors"
                          >
                            ▼
                          </button>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{project.title}</p>
                          <p className="text-xs text-gray-500">
                            {project.tags?.length || 0} technologies
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeProject(index)
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          🗑️
                        </button>
                        <span className="text-gray-400 text-lg">
                          {expandedProject === index ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>

                    {expandedProject === index && (
                      <div className="p-5 space-y-5 bg-white">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium text-gray-700">Project Title *</Label>
                            <span className="text-xs text-gray-500">Required</span>
                          </div>
                          <div className="relative">
                            <Input
                              value={project.title}
                              onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                              placeholder="E-commerce Platform with Payment Integration"
                              className="pr-12"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <AIAssistant
                                currentText={project.title}
                                context="project title"
                                onApply={(newText) => handleProjectChange(index, 'title', newText)}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5">💡 Use a clear, descriptive title that highlights the project's purpose</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium text-gray-700">Description *</Label>
                            <span className="text-xs text-gray-500">Required</span>
                          </div>
                          <div className="relative">
                            <Textarea
                              value={project.description}
                              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                              placeholder="Built a full-stack e-commerce platform with secure payments, inventory management, and real-time analytics..."
                              className="pr-12 resize-none"
                              rows={4}
                            />
                            <div className="absolute right-2 top-2">
                              <AIAssistant
                                currentText={project.description}
                                context="project description"
                                onApply={(newText) => handleProjectChange(index, 'description', newText)}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-gray-500">📝 Highlight key features, tech stack, and outcomes</span>
                            <span className="ml-auto text-xs text-gray-400">
                              {(project.description || '').length} characters
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Project Image</Label>
                          <ImageUpload
                            label=""
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
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-md">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                      {(data.skills || []).length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Highlight your expertise and proficiency</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={addSkill}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                + Add
              </Button>
            </div>

            {(data.skills || []).length === 0 ? (
              <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2 block">⚡</span>
                <p className="text-gray-700 font-medium mb-2">No skills yet</p>
                <p className="text-xs text-gray-500 mb-3">Add your first skill to showcase your abilities</p>
                <Button 
                  size="sm" 
                  onClick={addSkill}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Add Your First Skill
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {(data.skills || []).map((skill, index) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-200"
                  >
                    <div
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 cursor-pointer"
                      onClick={() => setExpandedSkill(expandedSkill === index ? null : index)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSkill(index, 'up')
                            }}
                            disabled={index === 0}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 transition-colors"
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSkill(index, 'down')
                            }}
                            disabled={index === (data.skills || []).length - 1}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 transition-colors"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{skill.name}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                                style={{ width: `${skill.level || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-purple-600 min-w-[45px] text-right">{skill.level || 0}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSkill(index)
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          🗑️
                        </button>
                        <span className="text-gray-400 text-lg">
                          {expandedSkill === index ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>

                    {expandedSkill === index && (
                      <div className="p-5 space-y-5 bg-white">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium text-gray-700">Skill Name *</Label>
                            <span className="text-xs text-gray-500">Required</span>
                          </div>
                          <div className="relative">
                            <Input
                              value={skill.name}
                              onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                              placeholder="React.js, TypeScript, Python, Figma..."
                              className="pr-12"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <AIAssistant
                                currentText={skill.name}
                                context="skill name"
                                onApply={(newText) => handleSkillChange(index, 'name', newText)}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5">💡 Be specific - "React.js" is better than "JavaScript"</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium text-gray-700">Proficiency Level</Label>
                            <span className="px-3 py-1 text-sm font-bold bg-purple-100 text-purple-700 rounded-lg">
                              {skill.level || 0}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level || 0}
                            onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>🌱 Beginner (0-30%)</span>
                            <span>💪 Proficient (30-70%)</span>
                            <span>🏆 Expert (70-100%)</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Category <span className="text-xs font-normal text-gray-500">(Optional)</span></Label>
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
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-xl shadow-md">
                📧
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                <p className="text-xs text-gray-500">How can people reach you?</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📧</span>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  type="email"
                  value={data.contact.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  placeholder="your.name@example.com"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">💼 Use a professional email address</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📱</span>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  type="tel"
                  value={data.contact.phone || ''}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">📞 Include country code for international reach</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📍</span>
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  value={data.contact.location || ''}
                  onChange={(e) => handleContactChange('location', e.target.value)}
                  placeholder="San Francisco, CA, USA"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">🌍 City, State/Region is usually enough</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-900 mb-1">Privacy Tip</p>
                    <p className="text-xs text-green-700">
                      Only share contact information you're comfortable making public. You can always add a contact form instead of direct details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        {activeSection === 'social' && data.social && (
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xl shadow-md">
                🔗
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
                <p className="text-xs text-gray-500">Connect on social platforms</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💻</span>
                  <Label className="text-sm font-medium text-gray-700">GitHub</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  value={data.social.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">💡 Full URL including https://</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💼</span>
                  <Label className="text-sm font-medium text-gray-700">LinkedIn</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  value={data.social.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">💡 Great for professional networking</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">𝕏</span>
                  <Label className="text-sm font-medium text-gray-700">Twitter / X</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  value={data.social.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username or https://x.com/username"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">💡 Either twitter.com or x.com works</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🌐</span>
                  <Label className="text-sm font-medium text-gray-700">Personal Website</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  value={data.social.website || ''}
                  onChange={(e) => handleSocialChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">💡 Your blog, portfolio, or company website</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📸</span>
                  <Label className="text-sm font-medium text-gray-700">Instagram</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  value={data.social.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">📱 Great for visual portfolios and lifestyle content</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎨</span>
                  <Label className="text-sm font-medium text-gray-700">Dribbble</Label>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <Input
                  value={data.social.dribbble || ''}
                  onChange={(e) => handleSocialChange('dribbble', e.target.value)}
                  placeholder="https://dribbble.com/username"
                  className="pl-4"
                />
                <p className="text-xs text-gray-500 mt-1.5">🎨 Perfect for designers to showcase work</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-lg">✨</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-indigo-900 mb-1">Pro Tip</p>
                    <p className="text-xs text-indigo-700">
                      Only add links to active, professional profiles. Quality over quantity - a few well-maintained profiles are better than many inactive ones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
