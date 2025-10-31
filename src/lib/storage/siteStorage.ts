import { Site } from '@/types/site'
import { supabase } from '../supabase/client'

const LOCAL_KEY = 'onepager-sites'

/**
 * Save a site to Supabase or localStorage as fallback
 */
export async function saveSite(site: Site): Promise<void> {
  // Try Supabase first (if configured)
  if (supabase) {
    try {
      const { error } = await supabase
        .from('sites')
        .upsert([site])
      
      if (error) throw error
      console.log('Site saved to Supabase')
      return
    } catch (err) {
      console.error('Supabase save failed, falling back to localStorage', err)
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const sites = loadAllSites()
    const index = sites.findIndex(s => s.id === site.id)
    
    if (index >= 0) {
      sites[index] = site
    } else {
      sites.push(site)
    }
    
    localStorage.setItem(LOCAL_KEY, JSON.stringify(sites))
    console.log('Site saved to localStorage')
  }
}

/**
 * Load a specific site by ID
 */
export function loadSite(id: string): Site | null {
  if (typeof window === 'undefined') return null
  
  const sites = loadAllSites()
  return sites.find(s => s.id === id) || null
}

/**
 * Load all sites from localStorage
 */
export function loadAllSites(): Site[] {
  if (typeof window === 'undefined') return []
  
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return []
  
  try {
    return JSON.parse(raw) as Site[]
  } catch {
    return []
  }
}

/**
 * Delete a site
 */
export async function deleteSite(id: string): Promise<void> {
  // Try Supabase first
  if (supabase) {
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return
    } catch (err) {
      console.error('Supabase delete failed, falling back to localStorage', err)
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const sites = loadAllSites()
    const filtered = sites.filter(s => s.id !== id)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered))
  }
}

/**
 * Create a new site with default values
 */
export function createNewSite(templateId: string, title: string): Site {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  return {
    id: `site-${Date.now()}`,
    templateId,
    title,
    slug,
    data: {},
    settings: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        background: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280',
      },
      fonts: {
        heading: '"Inter", sans-serif',
        body: '"Inter", sans-serif',
        headingSizes: {
          h1: 'text-4xl md:text-5xl lg:text-6xl',
          h2: 'text-3xl md:text-4xl lg:text-5xl',
          h3: 'text-2xl md:text-3xl lg:text-4xl',
        },
      },
      seo: {
        title,
        description: '',
      },
      layout: {
        maxWidth: 'xl',
        spacing: 'normal',
        borderRadius: 'md',
        sectionOrder: [],
      },
    },
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
