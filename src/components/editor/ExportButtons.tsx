import { useState } from 'react'
import { toast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Site } from '@/types/site'

interface ExportButtonsProps {
  site: Site
}

export function ExportButtons({ site }: ExportButtonsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleCopyLink = () => {
    const url = site.customDomain 
      ? `https://${site.customDomain}` 
      : `https://${site.slug}.onepager.com`
    
    navigator.clipboard.writeText(url)
    toast.info('✓ Link copied to clipboard!')
  }

  const handleEmbedCode = () => {
    const url = site.customDomain 
      ? `https://${site.customDomain}` 
      : `https://${site.slug}.onepager.com`
    
    const embedCode = `<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    toast.info('✓ Embed code copied! Paste it into any website to display your page.')
  }

  const handleQRCode = () => {
    const url = site.customDomain 
      ? `https://${site.customDomain}` 
      : `https://${site.slug}.onepager.com`
    
    // Open QR code generator (using external service)
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`, '_blank')
  }

  const handleShareSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const url = site.customDomain 
      ? `https://${site.customDomain}` 
      : `https://${site.slug}.onepager.com`
    
    const text = `Check out my ${site.title}!`
    
    let shareUrl = ''
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleDownloadScreenshot = async () => {
    setIsExporting(true)
    try {
      // In production, this would use a screenshot service
      toast.info('📸 Screenshot feature coming soon! This will capture a high-quality image of your site that you can download and share on social media.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="border-gray-700 bg-transparent hover:bg-gray-800 text-white font-medium"
      >
        🔗 Share
      </Button>

      {/* Dropdown Menu */}
      {showExportMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowExportMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border-2 border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-800 bg-[#0f0f0f]">
              <h3 className="font-semibold text-white text-sm">Share Your Site</h3>
              <p className="text-xs text-gray-400 mt-0.5">Choose how to share your creation</p>
            </div>
            
            <div className="p-2 space-y-1">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">�</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">Copy Link</div>
                  <div className="text-xs text-gray-400">Share URL directly</div>
                </div>
              </button>

              {/* QR Code */}
              <button
                onClick={handleQRCode}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📱</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">Generate QR Code</div>
                  <div className="text-xs text-gray-400">Perfect for business cards</div>
                </div>
              </button>

              {/* Embed Code */}
              <button
                onClick={handleEmbedCode}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📋</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">Copy Embed Code</div>
                  <div className="text-xs text-gray-400">Add to any website</div>
                </div>
              </button>

              <div className="h-px bg-gray-800 my-2" />

              {/* Social Sharing */}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-400 mb-2">SHARE ON SOCIAL</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleShareSocial('twitter')}
                    className="p-3 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors text-center"
                  >
                    <span className="text-2xl block">𝕏</span>
                    <span className="text-xs text-gray-400 mt-1 block">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShareSocial('linkedin')}
                    className="p-3 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 transition-colors text-center"
                  >
                    <span className="text-2xl block">in</span>
                    <span className="text-xs text-gray-400 mt-1 block">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShareSocial('facebook')}
                    className="p-3 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors text-center"
                  >
                    <span className="text-2xl block">f</span>
                    <span className="text-xs text-gray-400 mt-1 block">Facebook</span>
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-800 my-2" />

              {/* Download Screenshot */}
              <button
                onClick={handleDownloadScreenshot}
                disabled={isExporting}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors text-left disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">�</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">
                    {isExporting ? 'Generating...' : 'Download Preview'}
                  </div>
                  <div className="text-xs text-gray-400">High-quality screenshot</div>
                </div>
                <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                  Soon
                </span>
              </button>
            </div>

            <div className="p-3 bg-[#0f0f0f] border-t border-gray-800">
              <p className="text-xs text-gray-500 text-center">
                💡 Tip: Share your site to increase visibility
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
