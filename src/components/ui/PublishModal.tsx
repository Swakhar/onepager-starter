import { useState } from 'react'
import { toast } from '@/components/ui/Toast'
import { Button } from './Button'
import { Site } from '@/types/site'

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
  site: Site
  onPublish: (withDomain?: string) => void
  onOpenDomainSearch: () => void
}

export function PublishModal({ isOpen, onClose, site, onPublish, onOpenDomainSearch }: PublishModalProps) {
  const [publishStep, setPublishStep] = useState<'initial' | 'domain-option' | 'success'>('initial')

  if (!isOpen) return null

  const handlePublishWithoutDomain = () => {
    onPublish()
    setPublishStep('success')
  }

  const handlePublishWithDomain = () => {
    onClose()
    onOpenDomainSearch()
  }

  const handleClose = () => {
    setPublishStep('initial')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {publishStep === 'initial' && (
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Ready to Publish?
              </h2>
              <p className="text-gray-400">
                Your site is looking great! Choose how you want to publish it.
              </p>
            </div>

            {/* Publishing Options */}
            <div className="space-y-4">
              {/* With Custom Domain */}
              <div
                onClick={handlePublishWithDomain}
                className="group p-6 bg-[#0f0f0f] border-2 border-indigo-600/50 rounded-xl hover:border-indigo-500 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      Publish with Custom Domain
                      <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                        Recommended
                      </span>
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Make your site truly yours with a custom domain like yourbrand.com
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        ✓ Professional appearance
                      </span>
                      <span className="flex items-center gap-1">
                        ✓ Better SEO
                      </span>
                      <span className="flex items-center gap-1">
                        ✓ Custom branding
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-600 group-hover:text-white transition-colors">
                    →
                  </div>
                </div>
              </div>

              {/* Without Custom Domain */}
              <div
                onClick={() => setPublishStep('domain-option')}
                className="group p-6 bg-[#0f0f0f] border-2 border-gray-700 rounded-xl hover:border-gray-600 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Publish with Free Subdomain
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Quick publish with our free subdomain: {site.slug}.onepager.com
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        ✓ Free forever
                      </span>
                      <span className="flex items-center gap-1">
                        ✓ Instant setup
                      </span>
                      <span className="flex items-center gap-1">
                        ✓ Add domain later
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-600 group-hover:text-white transition-colors">
                    →
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <p className="text-sm text-gray-500">
                You can change this anytime in Settings
              </p>
            </div>
          </div>
        )}

        {publishStep === 'domain-option' && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Publish with Free Subdomain
              </h2>
              <p className="text-gray-400">
                Your site will be available at:
              </p>
              <div className="mt-4 p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg">
                <code className="text-indigo-400 text-lg font-mono">
                  {site.slug}.onepager.com
                </code>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-1">Pro Tip</h4>
                    <p className="text-sm text-gray-400">
                      You can add a custom domain later from the Settings tab to make your site more professional!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setPublishStep('initial')}
                  variant="outline"
                  className="flex-1 border-gray-700 text-white hover:bg-[#2a2a2a]"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handlePublishWithoutDomain}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Publish Now →
                </Button>
              </div>
            </div>
          </div>
        )}

        {publishStep === 'success' && (
          <div className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 animate-bounce">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Site Published Successfully!
              </h2>
              <p className="text-gray-400 mb-6">
                Your site is now live and visible to everyone
              </p>

              <div className="p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg mb-6">
                <p className="text-sm text-gray-400 mb-2">Your site URL:</p>
                <a
                  href={`https://${site.slug}.onepager.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 text-lg font-mono break-all"
                >
                  {site.slug}.onepager.com
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${site.slug}.onepager.com`)
                    toast.info('Link copied to clipboard!')
                  }}
                  variant="outline"
                  className="flex-1 border-gray-700 text-white hover:bg-[#2a2a2a]"
                >
                  📋 Copy Link
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Done
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-gray-400">
                  💡 Want a custom domain? Go to <span className="text-indigo-400 font-semibold">Settings</span> tab and click "Search Domains"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
