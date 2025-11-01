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
        
        {/* Domain Connection Banner - Only show if published and no custom domain */}
        {site.published && !site.customDomain && (
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500/50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🌐</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  Your site is live! Connect a custom domain
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full animate-pulse">
                    Recommended
                  </span>
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  Currently using: <code className="text-indigo-400 font-mono">{site.slug}.onepager.com</code>
                </p>
                <p className="text-sm text-gray-400 mb-3">
                  Make your site more professional with your own domain. Stand out with yourbrand.com instead of a subdomain.
                </p>
                <Button
                  onClick={() => setShowDomainSearch(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                >
                  🔍 Search & Connect Domain →
                </Button>
              </div>
            </div>
          </div>
        )}
        
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
            Your site will be available at: {site.slug}.onepager.com
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
          <label className="block text-sm font-medium text-white flex items-center gap-2">
            Custom Domain
            {!site.customDomain && site.published && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                Upgrade Available
              </span>
            )}
          </label>
          {site.customDomain ? (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xl">✓</span>
                  </div>
                  <div>
                    <span className="text-white font-semibold text-lg block">{site.customDomain}</span>
                    <span className="text-green-400 text-xs">Connected & Active</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDomainSearch(true)}
                    className="text-gray-300 hover:text-white hover:bg-white/10 border border-gray-600"
                  >
                    🔄 Change
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm('Are you sure you want to disconnect this domain?')) {
                        onUpdate({ customDomain: undefined })
                      }
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-900"
                  >
                    🗑️ Remove
                  </Button>
                </div>
              </div>
              <div className="pl-13 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>SSL Certificate Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>DNS Configured</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>Auto-renewal Enabled</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0f0f0f] border-2 border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mb-4">
                  <span className="text-3xl">🌐</span>
                </div>
                <h4 className="font-bold text-white mb-2 text-lg">Make Your Site Professional</h4>
                <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                  Connect a custom domain to boost credibility, improve SEO, and create a memorable brand presence.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-2xl mb-1">📈</div>
                    <div className="text-gray-400">Better SEO</div>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-gray-400">Brand Trust</div>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-2xl mb-1">🔒</div>
                    <div className="text-gray-400">Free SSL</div>
                  </div>
                </div>
                <Button
                  data-domain-search
                  onClick={() => setShowDomainSearch(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                >
                  🔍 Search & Connect Domain →
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Domains starting from $12.99/year
                </p>
              </div>
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
