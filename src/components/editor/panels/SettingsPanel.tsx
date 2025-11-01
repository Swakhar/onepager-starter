import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Site } from '@/types/site'
import DomainSearch from '@/components/domains/DomainSearch'

interface SettingsPanelProps {
  site: Site
  onUpdate: (updates: Partial<Site>) => void
}

export function SettingsPanel({ site, onUpdate }: SettingsPanelProps) {
  const [showDomainSearch, setShowDomainSearch] = useState(false)

  if (showDomainSearch) {
    return (
      <div className="h-full flex flex-col bg-[#1a1a1a]">
        <div className="p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            onClick={() => setShowDomainSearch(false)}
            className="text-white hover:bg-[#2a2a2a] -ml-2"
          >
            ← Back to Settings
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DomainSearch 
            currentDomain={site.customDomain}
            onConnect={(domain: string) => {
              onUpdate({ customDomain: domain })
              setShowDomainSearch(false)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Site Settings</h3>
        
        {/* Site Title */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Site Title
          </label>
          <Input
            value={site.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="My Awesome Site"
            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Site Slug */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Site Slug
          </label>
          <Input
            value={site.slug}
            onChange={(e) => onUpdate({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
            placeholder="my-awesome-site"
            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400">
            Your site will be available at: yoursite.com/{site.slug}
          </p>
        </div>

        {/* Site Description */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            value={site.settings.seo.description || ''}
            onChange={(e) => onUpdate({ 
              settings: { 
                ...site.settings, 
                seo: { ...site.settings.seo, description: e.target.value }
              }
            })}
            placeholder="A brief description of your site"
            rows={3}
            className="w-full px-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Custom Domain */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-white">
            Custom Domain
          </label>
          {site.customDomain ? (
            <div className="bg-[#0f0f0f] border border-green-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white font-medium">{site.customDomain}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDomainSearch(true)}
                    className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                  >
                    Change
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate({ customDomain: undefined })}
                    className="text-red-400 hover:text-red-300 hover:bg-[#2a2a2a]"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Your domain is connected and active
              </p>
            </div>
          ) : (
            <div className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-3">
                Connect a custom domain to make your site truly yours
              </p>
              <Button
                onClick={() => setShowDomainSearch(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                🔍 Search Domains
              </Button>
            </div>
          )}
        </div>

        {/* Published Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            Status
          </label>
          <div className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {site.published ? 'Published' : 'Draft'}
                </p>
                <p className="text-sm text-gray-400">
                  {site.published 
                    ? 'Your site is live and visible to everyone' 
                    : 'Your site is only visible to you'}
                </p>
              </div>
              <button
                onClick={() => onUpdate({ published: !site.published })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  site.published ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    site.published ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
