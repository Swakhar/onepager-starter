import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabase) {
    return res.status(500).json({ 
      error: 'Supabase not configured',
      message: 'Please check your environment variables'
    })
  }

  try {
    // Test connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('sites')
      .select('count')
      .limit(1)

    if (connectionError) {
      return res.status(500).json({ 
        error: 'Connection failed',
        message: connectionError.message,
        details: connectionError
      })
    }

    // Try to insert a test site
    const testSite = {
      id: `test-${Date.now()}`,
      template_id: 'modern-portfolio',
      title: 'Test Site',
      slug: 'test-site',
      data: {},
      settings: {},
      published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from('sites')
      .insert([testSite])
      .select()

    if (insertError) {
      return res.status(500).json({
        error: 'Insert failed',
        message: insertError.message,
        details: insertError,
        hint: 'You may need to disable RLS or add proper policies'
      })
    }

    // Clean up test site
    await supabase.from('sites').delete().eq('id', testSite.id)

    return res.status(200).json({ 
      success: true,
      message: 'Supabase is working correctly!',
      connection: 'OK',
      insert: 'OK',
      delete: 'OK'
    })
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Unexpected error',
      message: error.message 
    })
  }
}
