import { TemplateData, ColorScheme, FontScheme } from './template'

export interface Site {
  id: string
  userId?: string
  templateId: string
  title: string
  slug: string
  data: TemplateData
  settings: SiteSettings
  published: boolean
  customDomain?: string
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  colors: ColorScheme
  fonts: FontScheme
  seo: SEOSettings
  layout: LayoutSettings
  branding?: BrandingSettings
}

export interface SEOSettings {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  favicon?: string
}

export interface LayoutSettings {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  spacing: 'compact' | 'normal' | 'relaxed'
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  sectionOrder: string[] // Array of section IDs
}

export interface BrandingSettings {
  logo?: string
  logoText?: string
  showBranding?: boolean
}

export interface CreateSiteInput {
  templateId: string
  title: string
  slug?: string
}

export interface UpdateSiteInput {
  title?: string
  slug?: string
  data?: Partial<TemplateData>
  settings?: Partial<SiteSettings>
  published?: boolean
}
