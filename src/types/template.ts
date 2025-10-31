export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: 'portfolio' | 'resume' | 'business' | 'landing' | 'other'
  thumbnail: string
  isPremium: boolean
  sections: TemplateSectionConfig[]
  defaultColors: ColorScheme
  defaultFonts: FontScheme
}

export interface TemplateSectionConfig {
  id: string
  name: string
  type: 'hero' | 'about' | 'projects' | 'skills' | 'contact' | 'custom'
  isRequired: boolean
  isReorderable: boolean
}

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  textSecondary: string
}

export interface FontScheme {
  heading: string
  body: string
  headingSizes: {
    h1: string
    h2: string
    h3: string
  }
}

export interface TemplateData {
  hero?: HeroData
  about?: AboutData
  projects?: ProjectData[]
  skills?: SkillData[]
  contact?: ContactData
  social?: SocialLinks
  [key: string]: any // Allow custom sections
}

export interface HeroData {
  title: string
  subtitle: string
  description: string
  image?: string
  cta?: {
    primary?: { text: string; link: string }
    secondary?: { text: string; link: string }
  }
}

export interface AboutData {
  title: string
  description: string
  image?: string
  highlights?: string[]
}

export interface ProjectData {
  id: string
  title: string
  description: string
  image?: string
  tags?: string[]
  link?: string
  github?: string
}

export interface SkillData {
  id: string
  name: string
  level?: number // 0-100
  category?: string
  icon?: string
}

export interface ContactData {
  email?: string
  phone?: string
  location?: string
  showForm?: boolean
}

export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  dribbble?: string
  behance?: string
  website?: string
  [key: string]: string | undefined
}
