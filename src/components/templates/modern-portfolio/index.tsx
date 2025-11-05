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
  return (
    <TemplateContainer className={className}>
      {data.hero && <Hero data={data.hero} colors={colors} fonts={fonts} />}
      {data.about && <About data={data.about} colors={colors} fonts={fonts} />}
      {data.services && <Services data={data.services} colors={colors} fonts={fonts} />}
      {data.features && <Features data={data.features} colors={colors} fonts={fonts} />}
      {data.projects && data.projects.length > 0 && (
        <Projects data={data.projects} colors={colors} fonts={fonts} />
      )}
      {data.testimonials && <Testimonials data={data.testimonials} colors={colors} fonts={fonts} />}
      {data.contact && (
        <Contact data={data.contact} social={data.social} colors={colors} fonts={fonts} />
      )}
    </TemplateContainer>
  )
}

export default ModernPortfolio
