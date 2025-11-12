import { TemplateConfig } from '@/types/template'
import { colorPalettes } from './colors'
import { fontOptions, headingSizes } from './fonts'

export const templates: Record<string, TemplateConfig> = {
  'modern-portfolio': {
    id: 'modern-portfolio',
    name: 'Modern Portfolio',
    description: 'A clean and modern portfolio template perfect for designers, developers, and creatives',
    category: 'portfolio',
    thumbnail: '/templates/modern-portfolio.png',
    isPremium: false,
    sections: [
      { id: 'hero', name: 'Hero', type: 'hero', isRequired: true, isReorderable: false },
      { id: 'about', name: 'About', type: 'about', isRequired: false, isReorderable: true },
      { id: 'projects', name: 'Projects', type: 'projects', isRequired: false, isReorderable: true },
      { id: 'skills', name: 'Skills', type: 'skills', isRequired: false, isReorderable: true },
      { id: 'contact', name: 'Contact', type: 'contact', isRequired: true, isReorderable: false },
    ],
    defaultColors: colorPalettes.modern,
    defaultFonts: {
      heading: fontOptions.modern.heading,
      body: fontOptions.modern.body,
      headingSizes,
    },
  },
  'business-card': {
    id: 'business-card',
    name: 'Digital Business Card',
    description: 'A sleek digital business card to share your contact information and social links',
    category: 'business',
    thumbnail: '/templates/business-card.png',
    isPremium: false,
    sections: [
      { id: 'hero', name: 'Profile', type: 'hero', isRequired: true, isReorderable: false },
      { id: 'about', name: 'About', type: 'about', isRequired: false, isReorderable: true },
      { id: 'contact', name: 'Contact', type: 'contact', isRequired: true, isReorderable: false },
    ],
    defaultColors: colorPalettes.elegant,
    defaultFonts: {
      heading: fontOptions.elegant.heading,
      body: fontOptions.elegant.body,
      headingSizes,
    },
  },
  'creative-resume': {
    id: 'creative-resume',
    name: 'Creative Resume',
    description: 'Stand out with a creative online resume showcasing your experience and skills',
    category: 'resume',
    thumbnail: '/templates/creative-resume.png',
    isPremium: true,
    sections: [
      { id: 'hero', name: 'Profile', type: 'hero', isRequired: true, isReorderable: false },
      { id: 'about', name: 'Summary', type: 'about', isRequired: true, isReorderable: true },
      { id: 'skills', name: 'Skills', type: 'skills', isRequired: true, isReorderable: true },
      { id: 'projects', name: 'Experience', type: 'projects', isRequired: true, isReorderable: true },
      { id: 'contact', name: 'Contact', type: 'contact', isRequired: true, isReorderable: false },
    ],
    defaultColors: colorPalettes.vibrant,
    defaultFonts: {
      heading: fontOptions.creative.heading,
      body: fontOptions.creative.body,
      headingSizes,
    },
  },
  'restaurant-elegant': {
    id: 'restaurant-elegant',
    name: 'Restaurant Elegant',
    description: 'Premium template for fine dining restaurants with elegant design and reservations',
    category: 'restaurant',
    thumbnail: '/templates/restaurant-elegant.png',
    isPremium: false,
    sections: [
      { id: 'hero', name: 'Hero Slider', type: 'hero', isRequired: true, isReorderable: false },
      { id: 'about', name: 'About Us', type: 'about', isRequired: true, isReorderable: true },
      { id: 'menu', name: 'Menu', type: 'menu', isRequired: true, isReorderable: true },
      { id: 'gallery', name: 'Gallery', type: 'gallery', isRequired: false, isReorderable: true },
      { id: 'testimonials', name: 'Testimonials', type: 'testimonials', isRequired: false, isReorderable: true },
      { id: 'reservations', name: 'Reservations', type: 'reservations', isRequired: true, isReorderable: true },
      { id: 'footer', name: 'Footer', type: 'footer', isRequired: true, isReorderable: false },
    ],
    defaultColors: {
      primary: '#d97706', // Amber-600
      secondary: '#fbbf24', // Amber-400
      accent: '#f59e0b', // Amber-500
      background: '#ffffff',
      backgroundAlt: '#FFFBEB', // Amber-50 (cream)
      text: '#1f2937', // Gray-800
      textSecondary: '#6b7280', // Gray-500
    },
    defaultFonts: {
      heading: 'Playfair Display',
      body: 'Inter',
      headingSizes,
    },
  },
}

export const getTemplate = (id: string): TemplateConfig | undefined => {
  return templates[id]
}

export const getAllTemplates = (): TemplateConfig[] => {
  return Object.values(templates)
}

export const getTemplatesByCategory = (category: string): TemplateConfig[] => {
  return Object.values(templates).filter((t) => t.category === category)
}
