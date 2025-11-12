export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: 'portfolio' | 'resume' | 'business' | 'landing' | 'restaurant' | 'other'
  thumbnail: string
  isPremium: boolean
  sections: TemplateSectionConfig[]
  defaultColors: ColorScheme
  defaultFonts: FontScheme
}

export interface TemplateSectionConfig {
  id: string
  name: string
  type: 'hero' | 'about' | 'projects' | 'skills' | 'contact' | 'menu' | 'gallery' | 'testimonials' | 'reservations' | 'footer' | 'custom'
  isRequired: boolean
  isReorderable: boolean
}

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundAlt: string // NEW: Alternate background for section differentiation
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

export interface ServicesData {
  title: string
  subtitle?: string
  items: ServiceItem[]
  colors?: Partial<ColorScheme> // Optional section-specific colors
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon?: string
  features?: string[]
}

export interface FeaturesData {
  title: string
  subtitle?: string
  items: FeatureItem[]
  colors?: Partial<ColorScheme> // Optional section-specific colors
}

export interface FeatureItem {
  id: string
  title: string
  description: string
  icon?: string
}

export interface TestimonialsData {
  title: string
  subtitle?: string
  items: TestimonialItem[]
  colors?: Partial<ColorScheme> // Optional section-specific colors
}

export interface TestimonialItem {
  id: string
  content: string
  author: string
  role: string
  company?: string
  avatar?: string
  rating?: number
  image?: string  // Restaurant: customer photo
  date?: string   // Restaurant: review date
}

export interface TemplateData {
  hero?: HeroData
  about?: AboutData
  projects?: ProjectData[]
  skills?: SkillData[]
  experience?: ExperienceData[]
  education?: EducationData[]
  contact?: ContactData
  social?: SocialLinks
  services?: ServicesData
  features?: FeaturesData
  testimonials?: TestimonialsData
  // Restaurant-specific
  menu?: MenuData
  gallery?: GalleryData
  reservations?: ReservationsData
  footer?: FooterData
  sectionOrder?: string[] // NEW: Custom section order for drag-and-drop
  [key: string]: any // Allow custom sections
}

// Restaurant-specific interfaces
export interface MenuData {
  title: string
  subtitle?: string
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: string
  image?: string
  isSpecial?: boolean
  rating?: number
  tags?: string[]
}

export interface GalleryData {
  title: string
  subtitle?: string
  images: GalleryImage[]
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category?: string
}

export interface ReservationsData {
  title: string
  subtitle?: string
  description?: string
}

export interface FooterData {
  about?: {
    title: string
    description: string
  }
  services?: Array<{
    title: string
    link?: string
  }>
  blog?: Array<{
    title: string
    date: string
    author: string
    comments: number
    link?: string
  }>
}


export interface HeroData {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  backgroundImage?: string
  badge?: string  // Restaurant: "Welcome", "Delicious", etc.
  slides?: Array<{  // Restaurant: Hero slider
    id: string
    badge?: string
    title: string
    subtitle?: string
    description: string
    image: string
    ctaPrimary?: { text: string; link: string }
    ctaSecondary?: { text: string; link: string }
  }>
  cta?: {
    primary?: { text: string; link: string }
    secondary?: { text: string; link: string }
  }
}

export interface AboutData {
  title: string
  subtitle?: string  // Restaurant: section subtitle
  description: string
  story?: string  // Restaurant: additional story/history
  image?: string
  images?: string[]  // Restaurant: multiple images
  highlights?: string[]
  features?: Array<{  // Restaurant: features with icons
    icon: string
    title: string
    description: string
  }>
  stats?: Array<{  // Restaurant: statistics
    number: string
    label: string
  }>
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

export interface ExperienceData {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string // Empty for current position
  description: string
  achievements?: string[]
}

export interface EducationData {
  id: string
  degree: string
  school: string
  location?: string
  startDate: string
  endDate: string
  description?: string
  gpa?: string
}

export interface ContactData {
  email?: string
  phone?: string
  location?: string
  address?: string  // Restaurant: full address
  hours?: string    // Restaurant: opening hours
  showForm?: boolean
  description?: string
}
