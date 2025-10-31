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
      // Get current user (optional - if using auth)
      const { data: { user } } = await supabase.auth.getUser()
      
      // Convert camelCase to snake_case for Supabase
      const supabaseData = {
        id: site.id,
        template_id: site.templateId,
        title: site.title,
        slug: site.slug,
        data: site.data,
        settings: site.settings,
        published: site.published,
        created_at: site.createdAt,
        updated_at: site.updatedAt,
        ...(user && { user_id: user.id })
      }
      
      const { error } = await supabase
        .from('sites')
        .upsert([supabaseData], {
          onConflict: 'id'
        })
      
      if (error) throw error
      console.log('✅ Site saved to Supabase:', site.id)
      
      // Also sync to localStorage for offline support
      syncToLocalStorage(site)
      return
    } catch (err: any) {
      console.error('❌ Supabase save failed, falling back to localStorage', err.message || err)
    }
  }

  // Fallback to localStorage
  syncToLocalStorage(site)
}

/**
 * Sync site to localStorage
 */
function syncToLocalStorage(site: Site): void {
  if (typeof window !== 'undefined') {
    const sites = loadAllSitesFromLocalStorage()
    const index = sites.findIndex(s => s.id === site.id)
    
    if (index >= 0) {
      sites[index] = site
    } else {
      sites.push(site)
    }
    
    localStorage.setItem(LOCAL_KEY, JSON.stringify(sites))
    console.log('✅ Site saved to localStorage')
  }
}

/**
 * Load a specific site by ID from Supabase or localStorage
 */
export async function loadSite(id: string): Promise<Site | null> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (data) {
        console.log('✅ Site loaded from Supabase:', id)
        // Convert snake_case to camelCase
        const site: Site = {
          id: data.id,
          templateId: data.template_id,
          title: data.title,
          slug: data.slug,
          data: data.data || {},
          settings: data.settings || {},
          published: data.published || false,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
        return site
      }
    } catch (err: any) {
      console.error('❌ Supabase load failed, falling back to localStorage', err.message || err)
    }
  }

  // Fallback to localStorage
  if (typeof window === 'undefined') return null
  
  const sites = loadAllSitesFromLocalStorage()
  return sites.find(s => s.id === id) || null
}

/**
 * Load all sites from Supabase or localStorage
 */
export async function loadAllSites(): Promise<Site[]> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      let query = supabase.from('sites').select('*')
      
      // If user is authenticated, filter by user_id
      if (user) {
        query = query.eq('user_id', user.id)
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false })
      
      if (error) throw error
      if (data) {
        console.log('✅ Sites loaded from Supabase:', data.length)
        // Convert snake_case to camelCase
        const sites: Site[] = data.map((item: any) => ({
          id: item.id,
          templateId: item.template_id,
          title: item.title,
          slug: item.slug,
          data: item.data || {},
          settings: item.settings || {},
          published: item.published || false,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }))
        return sites
      }
    } catch (err: any) {
      console.error('❌ Supabase load failed, falling back to localStorage', err.message || err)
    }
  }

  // Fallback to localStorage
  return loadAllSitesFromLocalStorage()
}

/**
 * Load all sites from localStorage only
 */
function loadAllSitesFromLocalStorage(): Site[] {
  if (typeof window === 'undefined') return []
  
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return []
  
  try {
    const sites = JSON.parse(raw) as Site[]
    return sites.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch {
    return []
  }
}

/**
 * Delete a site from Supabase and localStorage
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
      console.log('✅ Site deleted from Supabase')
      
      // Also remove from localStorage
      removeFromLocalStorage(id)
      return
    } catch (err) {
      console.error('❌ Supabase delete failed, falling back to localStorage', err)
    }
  }

  // Fallback to localStorage
  removeFromLocalStorage(id)
}

/**
 * Remove site from localStorage
 */
function removeFromLocalStorage(id: string): void {
  if (typeof window !== 'undefined') {
    const sites = loadAllSitesFromLocalStorage()
    const filtered = sites.filter(s => s.id !== id)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered))
    console.log('✅ Site deleted from localStorage')
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
