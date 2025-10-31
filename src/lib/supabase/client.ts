import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if both URL and key are provided
export const supabase = (url && key && url !== '' && key !== '') 
  ? createClient(url, key) 
  : null

// Browser client for client-side operations
export const getSupabaseClient = () => supabase
