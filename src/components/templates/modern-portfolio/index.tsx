import React from 'react'
import { TemplateBaseProps, TemplateContainer } from '../base/TemplateBase'
import { Hero } from './Hero'
import { About } from './About'
import { Projects } from './Projects'
import { Contact } from './Contact'
import { Services } from './Services'
import { Features } from './Features'
import { Testimonials } from './Testimonials'

export const ModernPortfolio: React.FC<TemplateBaseProps> = ({ data, colors, fonts, className }) => {
  // Default section order if not specified
  const defaultOrder = ['hero', 'about', 'services', 'features', 'projects', 'testimonials', 'contact']
  const sectionOrder = data.sectionOrder || defaultOrder

  // Map of section IDs to their render functions
  const sectionComponents: Record<string, (isAlternate: boolean) => React.ReactNode> = {
    hero: (isAlternate) => data.hero && <Hero data={data.hero} colors={colors} fonts={fonts} />,
    about: (isAlternate) => data.about && (
      <About 
        data={data.about} 
        colors={isAlternate ? { ...colors, background: colors.backgroundAlt } : colors} 
        fonts={fonts} 
      />
    ),
    services: (isAlternate) => data.services && (
      <Services 
        data={data.services} 
        colors={isAlternate ? { ...colors, background: colors.backgroundAlt } : colors} 
        fonts={fonts} 
      />
    ),
    features: (isAlternate) => data.features && (
      <Features 
        data={data.features} 
        colors={isAlternate ? { ...colors, background: colors.backgroundAlt } : colors} 
        fonts={fonts} 
      />
    ),
    projects: (isAlternate) => data.projects && data.projects.length > 0 && (
      <Projects 
        data={data.projects} 
        colors={isAlternate ? { ...colors, background: colors.backgroundAlt } : colors} 
        fonts={fonts} 
      />
    ),
    testimonials: (isAlternate) => data.testimonials && (
      <Testimonials 
        data={data.testimonials} 
        colors={isAlternate ? { ...colors, background: colors.backgroundAlt } : colors} 
        fonts={fonts} 
      />
    ),
    contact: (isAlternate) => data.contact && (
      <Contact 
        data={data.contact} 
        social={data.social} 
        colors={isAlternate ? { ...colors, background: colors.backgroundAlt } : colors} 
        fonts={fonts} 
      />
    ),
  }

  // Render sections in specified order with alternating backgrounds
  let alternateCount = 0 // Track sections that actually render (skip hero for alternation)
  
  return (
    <TemplateContainer className={className}>
      {sectionOrder.map((sectionId) => {
        const renderSection = sectionComponents[sectionId]
        if (!renderSection) return null
        
        // Hero doesn't participate in alternation
        const isAlternate = sectionId !== 'hero' && alternateCount % 2 === 1
        const section = renderSection(isAlternate)
        
        // Only increment counter if section actually renders and it's not hero
        if (section && sectionId !== 'hero') {
          alternateCount++
        }
        
        return <React.Fragment key={sectionId}>{section}</React.Fragment>
      })}
    </TemplateContainer>
  )
}

export default ModernPortfolio
