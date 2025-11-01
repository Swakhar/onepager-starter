import { Input } from '@/components/ui/Input'
import { Site } from '@/types/site'

interface SEOPanelProps {
  site: Site
  onUpdate: (updates: Partial<Site>) => void
}

export function SEOPanel({ site, onUpdate }: SEOPanelProps) {
  const updateSEO = (updates: Partial<typeof site.settings.seo>) => {
    onUpdate({
      settings: {
        ...site.settings,
        seo: {
          ...site.settings.seo,
          ...updates
        }
      }
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
        
        {/* Meta Title */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Meta Title
          </label>
          <Input
            value={site.settings.seo.title}
            onChange={(e) => updateSEO({ title: e.target.value })}
            placeholder="Your Site Title | Brand Name"
            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400">
            {site.settings.seo.title.length}/60 characters (recommended)
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Meta Description
          </label>
          <textarea
            value={site.settings.seo.description}
            onChange={(e) => updateSEO({ description: e.target.value })}
            placeholder="A compelling description of your site"
            rows={3}
            className="w-full px-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-400">
            {site.settings.seo.description.length}/160 characters (recommended)
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Keywords
          </label>
          <Input
            value={site.settings.seo.keywords?.join(', ') || ''}
            onChange={(e) => updateSEO({ 
              keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
            })}
            placeholder="keyword1, keyword2, keyword3"
            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400">
            Separate keywords with commas
          </p>
        </div>

        {/* OG Image */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Social Share Image (OG Image)
          </label>
          <Input
            value={site.settings.seo.ogImage || ''}
            onChange={(e) => updateSEO({ ogImage: e.target.value })}
            placeholder="https://yoursite.com/og-image.jpg"
            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400">
            Recommended: 1200x630px
          </p>
        </div>

        {/* Favicon */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Favicon
          </label>
          <Input
            value={site.settings.seo.favicon || ''}
            onChange={(e) => updateSEO({ favicon: e.target.value })}
            placeholder="https://yoursite.com/favicon.ico"
            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400">
            Recommended: 32x32px or 16x16px
          </p>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-3">Google Preview</h4>
          <div className="space-y-1">
            <div className="text-blue-400 text-sm hover:underline cursor-pointer">
              {site.settings.seo.title || 'Your Site Title'}
            </div>
            <div className="text-xs text-green-600">
              {site.customDomain || `yoursite.com/${site.slug}`}
            </div>
            <div className="text-sm text-gray-400">
              {site.settings.seo.description || 'Your site description will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
