import React, { useState } from 'react'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { AIAssistant } from '@/components/editor/AIAssistant'
import { ImageSuggestions } from '@/components/editor/ImageSuggestions'
import { SmartSectionGenerator } from '@/components/editor/SmartSectionGenerator'
import { ColorPicker } from '@/components/editor/controls/ColorPicker'
import { SectionOrderManager } from '@/components/editor/SectionOrderManager'
import { TemplateData, HeroData, AboutData, ContactData, ProjectData, SkillData } from '@/types/template'

interface ContentPanelProps {
  data: TemplateData
  onDataChange: (data: TemplateData) => void
  templateId?: string
}

type Section = 'hero' | 'about' | 'projects' | 'skills' | 'contact' | 'social' | 'services' | 'features' | 'testimonials' | 'layout'

export const ContentPanel: React.FC<ContentPanelProps> = ({ data, onDataChange, templateId = 'modern-portfolio' }) => {
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

  const handleSectionGenerated = (section: any) => {
    console.log('Generated section:', section)
    
    // Apply the generated section content based on type
    switch (section.type) {
      case 'hero':
        if (data.hero) {
          handleHeroChange('title', section.title)
          handleHeroChange('subtitle', section.subtitle || '')
          handleHeroChange('description', section.content || '')
          if (section.cta?.text) {
            // Update CTA if it exists
            handleHeroChange('cta', {
              ...data.hero.cta,
              primary: {
                text: section.cta.text,
                link: data.hero.cta?.primary?.link || '#'
              }
            })
          }
        }
        setActiveSection('hero')
        // Show success notification
        setTimeout(() => {
          alert('✅ Hero section updated! Check the Hero tab to see the changes.')
        }, 100)
        break
        
      case 'about':
        if (data.about) {
          handleAboutChange('title', section.title)
          handleAboutChange('description', section.content || '')
        }
        setActiveSection('about')
        setTimeout(() => {
          alert('✅ About section updated! Check the About tab to see the changes.')
        }, 100)
        break
        
      case 'contact':
        if (data.contact) {
          // Extract email and phone from items if available
          const emailItem = section.items?.find((item: any) => 
            item.title.toLowerCase().includes('email')
          )
          const phoneItem = section.items?.find((item: any) => 
            item.title.toLowerCase().includes('phone')
          )
          const locationItem = section.items?.find((item: any) => 
            item.title.toLowerCase().includes('location')
          )
          
          if (emailItem) handleContactChange('email', emailItem.description)
          if (phoneItem) handleContactChange('phone', phoneItem.description)
          if (locationItem) handleContactChange('location', locationItem.description)
        }
        setActiveSection('contact')
        setTimeout(() => {
          alert('✅ Contact section updated! Check the Contact tab to see the changes.')
        }, 100)
        break
        
      case 'services':
        // Apply services data to template
        onDataChange({
          ...data,
          services: {
            title: section.title,
            subtitle: section.subtitle || '',
            items: (section.items || []).map((item: any, index: number) => ({
              id: `service-${Date.now()}-${index}`,
              title: item.title,
              description: item.description,
              icon: item.icon || '⚡',
              features: item.features || []
            }))
          }
        })
        // Switch to the services tab after generation
        setActiveSection('services')
        setTimeout(() => {
          alert('✅ Services section created! Check the new "🛠️ Services" tab to edit it.')
        }, 100)
        break
        
      case 'features':
        // Apply features data to template
        onDataChange({
          ...data,
          features: {
            title: section.title,
            subtitle: section.subtitle || '',
            items: (section.items || []).map((item: any, index: number) => ({
              id: `feature-${Date.now()}-${index}`,
              title: item.title,
              description: item.description,
              icon: item.icon || '✨'
            }))
          }
        })
        // Switch to the features tab after generation
        setActiveSection('features')
        setTimeout(() => {
          alert('✅ Features section created! Check the new "✨ Features" tab to edit it.')
        }, 100)
        break
        
      case 'testimonials':
        // Apply testimonials data to template
        onDataChange({
          ...data,
          testimonials: {
            title: section.title,
            subtitle: section.subtitle || '',
            items: (section.items || []).map((item: any, index: number) => ({
              id: `testimonial-${Date.now()}-${index}`,
              content: item.content || item.description,
              author: item.author || 'Anonymous',
              role: item.role || 'Customer',
              company: item.company || '',
              avatar: item.avatar || '',
              rating: item.rating || 5
            }))
          }
        })
        // Switch to the testimonials tab after generation
        setActiveSection('testimonials')
        setTimeout(() => {
          alert('✅ Testimonials section created! Check the new "⭐ Testimonials" tab to edit it.')
        }, 100)
        break
        
      case 'cta':
        // Show CTA content
        alert(
          `📢 Call-to-Action Generated!\n\n` +
          `Headline: ${section.title}\n` +
          `Subtitle: ${section.subtitle || ''}\n` +
          `${section.content || ''}\n\n` +
          `Button Text: ${section.cta?.text || 'Get Started'}\n\n` +
          `💡 Tip: Use this compelling copy in your Hero section!`
        )
        break
        
      default:
        // For other section types, show the content
        alert(
          `✨ Section Generated!\n\n` +
          `${section.title}\n\n` +
          `${section.content || ''}\n\n` +
          `💡 Note: This section type needs manual integration.`
        )
    }
  }

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'hero', label: 'Hero', icon: '🎯' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'testimonials', label: 'Testimonials', icon: '⭐' },
    { id: 'contact', label: 'Contact', icon: '📧' },
    { id: 'social', label: 'Social', icon: '🔗' },
  ]

  // Define which sections each template supports
  const templateSupportedSections: Record<string, Section[]> = {
    'modern-portfolio': ['layout', 'hero', 'about', 'projects', 'services', 'features', 'testimonials', 'contact', 'social'],
    'business-card': ['layout', 'hero', 'about', 'skills', 'services', 'features', 'testimonials', 'contact', 'social'],
    'creative-resume': ['layout', 'hero', 'about', 'projects', 'skills', 'services', 'features', 'testimonials', 'contact', 'social'],
  }

  // Filter sections based on template AND whether content exists
  const visibleSections = sections.filter(section => {
    // Layout section is always visible
    if (section.id === 'layout') return true
    
    // First check if template supports this section
    const isTemplateSupported = templateSupportedSections[templateId]?.includes(section.id) ?? true
    
    if (!isTemplateSupported) return false
    
    // For dynamic sections (services, features, testimonials), only show if content exists
    if (section.id === 'services') {
      return data.services && data.services.items && data.services.items.length > 0
    }
    if (section.id === 'features') {
      return data.features && data.features.items && data.features.items.length > 0
    }
    if (section.id === 'testimonials') {
      return data.testimonials && data.testimonials.items && data.testimonials.items.length > 0
    }
    
    // For other sections, show them by default if template supports
    return true
  })

  // Auto-switch to first available section if current one isn't supported
  React.useEffect(() => {
    const currentSectionSupported = visibleSections.some(s => s.id === activeSection)
    if (!currentSectionSupported && visibleSections.length > 0) {
      setActiveSection(visibleSections[0].id)
    }
  }, [templateId, activeSection])

  return (
    <div className="space-y-4">
      {/* AI Section Generator */}
      <div className="ai-section-banner bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-xl shadow-md">
            🤖
          </div>
          <div className="flex-1">
            <h4 className="font-bold !text-gray-900 text-sm">AI Section Generator</h4>
            <p className="text-xs !text-gray-600 mt-1">
              Generate complete sections with AI-powered content instantly
            </p>
          </div>
        </div>
        <SmartSectionGenerator
          onSectionGenerated={handleSectionGenerated}
          businessName={data.hero?.title || 'Your Business'}
          industry="technology"
          templateId={templateId}
        />
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {visibleSections.map((section) => (
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
                    className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:shadow-lg transition-all duration-200"
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
                          <p className="font-semibold text-black">{project.title}</p>
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
                          <p className="font-semibold text-black">{skill.name}</p>
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

              <div className="p-4 bg-gradient-to-r from-green-500 to-teal-500 border border-green-200 rounded-lg">
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

        {/* Services Section */}
        {activeSection === 'services' && (
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl shadow-md">
                  🛠️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Services</h3>
                    {data.services?.items && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                        {data.services.items.length} {data.services.items.length === 1 ? 'service' : 'services'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">What services do you offer?</p>
                </div>
              </div>
            </div>

            {!data.services || !data.services.items || data.services.items.length === 0 ? (
              <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-orange-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2 block">🛠️</span>
                <p className="text-gray-700 font-medium mb-2">No services yet</p>
                <p className="text-xs text-gray-500 mb-3">Use AI to generate a complete services section</p>
                <SmartSectionGenerator
                  onSectionGenerated={handleSectionGenerated}
                  businessName={data.hero?.title || 'Your Business'}
                  industry="technology"
                  templateId={templateId}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Edit your services section title and subtitle below, or regenerate with AI for different content.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Section Title</Label>
                  <Input
                    value={data.services.title}
                    onChange={(e) => onDataChange({
                      ...data,
                      services: { ...data.services!, title: e.target.value }
                    })}
                    placeholder="Our Services"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Section Subtitle</Label>
                  <Input
                    value={data.services.subtitle || ''}
                    onChange={(e) => onDataChange({
                      ...data,
                      services: { ...data.services!, subtitle: e.target.value }
                    })}
                    placeholder="What we offer to help you succeed"
                  />
                </div>

                {/* Section-Specific Colors */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      <h4 className="text-sm font-bold !text-gray-900">Section Colors (Optional)</h4>
                    </div>
                  </div>
                  <p className="text-xs text-purple-700 mb-4">
                    Override global colors for this section only. Leave empty to use global colors.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker
                      label="Primary"
                      value={data.services?.colors?.primary || data.colorScheme?.primary}
                      onChange={(color) => onDataChange({
                        ...data,
                        services: {
                          ...data.services!,
                          colors: { ...(data.services?.colors || {}), primary: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Secondary"
                      value={data.services?.colors?.secondary || data.colorScheme?.secondary}
                      onChange={(color) => onDataChange({
                        ...data,
                        services: {
                          ...data.services!,
                          colors: { ...(data.services?.colors || {}), secondary: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Background"
                      value={data.services?.colors?.background || data.colorScheme?.background}
                      onChange={(color) => onDataChange({
                        ...data,
                        services: {
                          ...data.services!,
                          colors: { ...(data.services?.colors || {}), background: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Accent"
                      value={data.services?.colors?.accent || data.colorScheme?.accent}
                      onChange={(color) => onDataChange({
                        ...data,
                        services: {
                          ...data.services!,
                          colors: { ...(data.services?.colors || {}), accent: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Text (Title)"
                      value={data.services?.colors?.text || data.colorScheme?.text}
                      onChange={(color) => onDataChange({
                        ...data,
                        services: {
                          ...data.services!,
                          colors: { ...(data.services?.colors || {}), text: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Text (Secondary)"
                      value={data.services?.colors?.textSecondary || data.colorScheme?.textSecondary}
                      onChange={(color) => onDataChange({
                        ...data,
                        services: {
                          ...data.services!,
                          colors: { ...(data.services?.colors || {}), textSecondary: color }
                        }
                      })}
                    />
                  </div>
                  
                  {data.services?.colors && Object.keys(data.services.colors).length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDataChange({
                        ...data,
                        services: { ...data.services!, colors: undefined }
                      })}
                      className="mt-3 w-full text-xs"
                    >
                      🔄 Reset to Global Colors
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Service Items</h4>
                  <div className="space-y-3">
                    {data.services.items.map((service, index) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start gap-3 mb-3">
                          <Input
                            value={service.icon || ''}
                            onChange={(e) => {
                              const newItems = [...data.services!.items]
                              newItems[index] = { ...service, icon: e.target.value }
                              onDataChange({ ...data, services: { ...data.services!, items: newItems } })
                            }}
                            placeholder="🎨"
                            className="w-16 text-center text-2xl"
                          />
                          <div className="flex-1">
                            <Input
                              value={service.title}
                              onChange={(e) => {
                                const newItems = [...data.services!.items]
                                newItems[index] = { ...service, title: e.target.value }
                                onDataChange({ ...data, services: { ...data.services!, items: newItems } })
                              }}
                              placeholder="Service Name"
                              className="font-semibold mb-2"
                            />
                            <Textarea
                              value={service.description}
                              onChange={(e) => {
                                const newItems = [...data.services!.items]
                                newItems[index] = { ...service, description: e.target.value }
                                onDataChange({ ...data, services: { ...data.services!, items: newItems } })
                              }}
                              placeholder="Service description..."
                              rows={2}
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newItems = data.services!.items.filter((_, i) => i !== index)
                              onDataChange({ ...data, services: { ...data.services!, items: newItems } })
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xl shadow-md">
                  ✨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Features</h3>
                    {data.features?.items && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                        {data.features.items.length} {data.features.items.length === 1 ? 'feature' : 'features'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Highlight your key features</p>
                </div>
              </div>
            </div>

            {!data.features || !data.features.items || data.features.items.length === 0 ? (
              <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-yellow-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2 block">✨</span>
                <p className="text-gray-700 font-medium mb-2">No features yet</p>
                <p className="text-xs text-gray-500 mb-3">Use AI to generate a complete features section</p>
                <SmartSectionGenerator
                  onSectionGenerated={handleSectionGenerated}
                  businessName={data.hero?.title || 'Your Business'}
                  industry="technology"
                  templateId={templateId}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Features should highlight benefits and capabilities that make you stand out.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Section Title</Label>
                  <Input
                    value={data.features.title}
                    onChange={(e) => onDataChange({
                      ...data,
                      features: { ...data.features!, title: e.target.value }
                    })}
                    placeholder="Key Features"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Section Subtitle</Label>
                  <Input
                    value={data.features.subtitle || ''}
                    onChange={(e) => onDataChange({
                      ...data,
                      features: { ...data.features!, subtitle: e.target.value }
                    })}
                    placeholder="What makes us special"
                  />
                </div>

                {/* Section-Specific Colors */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      <h4 className="text-sm font-bold text-gray-900">Section Colors (Optional)</h4>
                    </div>
                  </div>
                  <p className="text-xs text-purple-700 mb-4">
                    Override global colors for this section only. Leave empty to use global colors.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker
                      label="Primary"
                      value={data.features?.colors?.primary || data.colorScheme?.primary}
                      onChange={(color) => onDataChange({
                        ...data,
                        features: {
                          ...data.features!,
                          colors: { ...(data.features?.colors || {}), primary: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Secondary"
                      value={data.features?.colors?.secondary || data.colorScheme?.secondary}
                      onChange={(color) => onDataChange({
                        ...data,
                        features: {
                          ...data.features!,
                          colors: { ...(data.features?.colors || {}), secondary: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Background"
                      value={data.features?.colors?.background || data.colorScheme?.background}
                      onChange={(color) => onDataChange({
                        ...data,
                        features: {
                          ...data.features!,
                          colors: { ...(data.features?.colors || {}), background: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Accent"
                      value={data.features?.colors?.accent || data.colorScheme?.accent}
                      onChange={(color) => onDataChange({
                        ...data,
                        features: {
                          ...data.features!,
                          colors: { ...(data.features?.colors || {}), accent: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Text (Title)"
                      value={data.features?.colors?.text || data.colorScheme?.text}
                      onChange={(color) => onDataChange({
                        ...data,
                        features: {
                          ...data.features!,
                          colors: { ...(data.features?.colors || {}), text: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Text (Secondary)"
                      value={data.features?.colors?.textSecondary || data.colorScheme?.textSecondary}
                      onChange={(color) => onDataChange({
                        ...data,
                        features: {
                          ...data.features!,
                          colors: { ...(data.features?.colors || {}), textSecondary: color }
                        }
                      })}
                    />
                  </div>
                  
                  {data.features?.colors && Object.keys(data.features.colors).length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDataChange({
                        ...data,
                        features: { ...data.features!, colors: undefined }
                      })}
                      className="mt-3 w-full text-xs"
                    >
                      🔄 Reset to Global Colors
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Feature Items</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {data.features.items.map((feature, index) => (
                      <div key={feature.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="flex items-start gap-2 mb-2">
                          <Input
                            value={feature.icon || ''}
                            onChange={(e) => {
                              const newItems = [...data.features!.items]
                              newItems[index] = { ...feature, icon: e.target.value }
                              onDataChange({ ...data, features: { ...data.features!, items: newItems } })
                            }}
                            placeholder="⚡"
                            className="w-12 text-center text-xl"
                          />
                          <button
                            onClick={() => {
                              const newItems = data.features!.items.filter((_, i) => i !== index)
                              onDataChange({ ...data, features: { ...data.features!, items: newItems } })
                            }}
                            className="w-6 h-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 text-sm"
                          >
                            ×
                          </button>
                        </div>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const newItems = [...data.features!.items]
                            newItems[index] = { ...feature, title: e.target.value }
                            onDataChange({ ...data, features: { ...data.features!, items: newItems } })
                          }}
                          placeholder="Feature Name"
                          className="font-semibold mb-2 text-sm"
                        />
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newItems = [...data.features!.items]
                            newItems[index] = { ...feature, description: e.target.value }
                            onDataChange({ ...data, features: { ...data.features!, items: newItems } })
                          }}
                          placeholder="Feature description..."
                          rows={2}
                          className="text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testimonials Section */}
        {activeSection === 'testimonials' && (
          <div className="p-5 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl shadow-md">
                  ⭐
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Testimonials</h3>
                    {data.testimonials?.items && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full">
                        {data.testimonials.items.length} {data.testimonials.items.length === 1 ? 'testimonial' : 'testimonials'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Showcase social proof</p>
                </div>
              </div>
            </div>

            {!data.testimonials || !data.testimonials.items || data.testimonials.items.length === 0 ? (
              <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-pink-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2 block">⭐</span>
                <p className="text-gray-700 font-medium mb-2">No testimonials yet</p>
                <p className="text-xs text-gray-500 mb-3">Use AI to generate testimonials</p>
                <SmartSectionGenerator
                  onSectionGenerated={handleSectionGenerated}
                  businessName={data.hero?.title || 'Your Business'}
                  industry="technology"
                  templateId={templateId}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Great testimonials are specific, mention results, and feel authentic.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Section Title</Label>
                  <Input
                    value={data.testimonials.title}
                    onChange={(e) => onDataChange({
                      ...data,
                      testimonials: { ...data.testimonials!, title: e.target.value }
                    })}
                    placeholder="Client Testimonials"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Section Subtitle</Label>
                  <Input
                    value={data.testimonials.subtitle || ''}
                    onChange={(e) => onDataChange({
                      ...data,
                      testimonials: { ...data.testimonials!, subtitle: e.target.value }
                    })}
                    placeholder="What our clients say about us"
                  />
                </div>

                {/* Section-Specific Colors */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      <h4 className="text-sm font-bold !text-gray-900">Section Colors (Optional)</h4>
                    </div>
                  </div>
                  <p className="text-xs text-purple-700 mb-4">
                    Override global colors for this section only. Leave empty to use global colors.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker
                      label="Primary"
                      value={data.testimonials?.colors?.primary || data.colorScheme?.primary}
                      onChange={(color) => onDataChange({
                        ...data,
                        testimonials: {
                          ...data.testimonials!,
                          colors: { ...(data.testimonials?.colors || {}), primary: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Secondary"
                      value={data.testimonials?.colors?.secondary || data.colorScheme?.secondary}
                      onChange={(color) => onDataChange({
                        ...data,
                        testimonials: {
                          ...data.testimonials!,
                          colors: { ...(data.testimonials?.colors || {}), secondary: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Background"
                      value={data.testimonials?.colors?.background || data.colorScheme?.background}
                      onChange={(color) => onDataChange({
                        ...data,
                        testimonials: {
                          ...data.testimonials!,
                          colors: { ...(data.testimonials?.colors || {}), background: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Accent"
                      value={data.testimonials?.colors?.accent || data.colorScheme?.accent}
                      onChange={(color) => onDataChange({
                        ...data,
                        testimonials: {
                          ...data.testimonials!,
                          colors: { ...(data.testimonials?.colors || {}), accent: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Text (Title)"
                      value={data.testimonials?.colors?.text || data.colorScheme?.text}
                      onChange={(color) => onDataChange({
                        ...data,
                        testimonials: {
                          ...data.testimonials!,
                          colors: { ...(data.testimonials?.colors || {}), text: color }
                        }
                      })}
                    />
                    <ColorPicker
                      label="Text (Secondary)"
                      value={data.testimonials?.colors?.textSecondary || data.colorScheme?.textSecondary}
                      onChange={(color) => onDataChange({
                        ...data,
                        testimonials: {
                          ...data.testimonials!,
                          colors: { ...(data.testimonials?.colors || {}), textSecondary: color }
                        }
                      })}
                    />
                  </div>
                  
                  {data.testimonials?.colors && Object.keys(data.testimonials.colors).length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDataChange({
                        ...data,
                        testimonials: { ...data.testimonials!, colors: undefined }
                      })}
                      className="mt-3 w-full text-xs"
                    >
                      🔄 Reset to Global Colors
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Testimonial Items</h4>
                  <div className="space-y-3">
                    {data.testimonials.items.map((testimonial, index) => (
                      <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs font-medium text-gray-700">Rating</Label>
                            <select
                              value={testimonial.rating || 5}
                              onChange={(e) => {
                                const newItems = [...data.testimonials!.items]
                                newItems[index] = { ...testimonial, rating: parseInt(e.target.value) }
                                onDataChange({ ...data, testimonials: { ...data.testimonials!, items: newItems } })
                              }}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                              <option value={4}>⭐⭐⭐⭐ (4)</option>
                              <option value={3}>⭐⭐⭐ (3)</option>
                              <option value={2}>⭐⭐ (2)</option>
                              <option value={1}>⭐ (1)</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              const newItems = data.testimonials!.items.filter((_, i) => i !== index)
                              onDataChange({ ...data, testimonials: { ...data.testimonials!, items: newItems } })
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                          >
                            🗑️
                          </button>
                        </div>

                        <Textarea
                          value={testimonial.content}
                          onChange={(e) => {
                            const newItems = [...data.testimonials!.items]
                            newItems[index] = { ...testimonial, content: e.target.value }
                            onDataChange({ ...data, testimonials: { ...data.testimonials!, items: newItems } })
                          }}
                          placeholder="The testimonial quote..."
                          rows={3}
                          className="mb-3"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={testimonial.author}
                            onChange={(e) => {
                              const newItems = [...data.testimonials!.items]
                              newItems[index] = { ...testimonial, author: e.target.value }
                              onDataChange({ ...data, testimonials: { ...data.testimonials!, items: newItems } })
                            }}
                            placeholder="Author Name"
                            className="text-sm"
                          />
                          <Input
                            value={testimonial.role}
                            onChange={(e) => {
                              const newItems = [...data.testimonials!.items]
                              newItems[index] = { ...testimonial, role: e.target.value }
                              onDataChange({ ...data, testimonials: { ...data.testimonials!, items: newItems } })
                            }}
                            placeholder="Job Title"
                            className="text-sm"
                          />
                          <Input
                            value={testimonial.company || ''}
                            onChange={(e) => {
                              const newItems = [...data.testimonials!.items]
                              newItems[index] = { ...testimonial, company: e.target.value }
                              onDataChange({ ...data, testimonials: { ...data.testimonials!, items: newItems } })
                            }}
                            placeholder="Company (Optional)"
                            className="text-sm"
                          />
                          <Input
                            value={testimonial.avatar || ''}
                            onChange={(e) => {
                              const newItems = [...data.testimonials!.items]
                              newItems[index] = { ...testimonial, avatar: e.target.value }
                              onDataChange({ ...data, testimonials: { ...data.testimonials!, items: newItems } })
                            }}
                            placeholder="Avatar URL (Optional)"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Layout Section - Section Reordering */}
        {activeSection === 'layout' && (
          <div className="p-5 animate-fadeIn">
            <SectionOrderManager 
              data={data} 
              onDataChange={onDataChange} 
              templateId={templateId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
