import { useState } from 'react'
import Link from 'next/link'
import ModernPortfolio from '@/components/templates/modern-portfolio'
import { modernPortfolioSampleData } from '@/config/sampleData'
import { templates } from '@/config/templates'
import { Button } from '@/components/ui/Button'

export default function TemplateDemoPage() {
  const template = templates['modern-portfolio']
  const [showControls, setShowControls] = useState(true)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Control Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg transition-all duration-300 ${
        showControls ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {/* Left Side - Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/templates">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 -ml-2">
                  <span className="text-base">←</span>
                  <span className="ml-2 hidden sm:inline">Back</span>
                </Button>
              </Link>
              
              <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-gray-900">
                    {template.name}
                  </h1>
                  {template.isPremium && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      ⭐ PRO
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Live Preview - All features interactive
                </p>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button 
                  className="px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium bg-white text-gray-900 shadow-sm"
                  title="Desktop View"
                >
                  <span className="hidden sm:inline">🖥️ Desktop</span>
                  <span className="sm:hidden">🖥️</span>
                </button>
                <button 
                  className="px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
                  title="Tablet View"
                >
                  <span className="hidden sm:inline">📱 Tablet</span>
                  <span className="sm:hidden">📱</span>
                </button>
                <button 
                  className="px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
                  title="Mobile View"
                >
                  <span className="hidden sm:inline">📱 Mobile</span>
                  <span className="sm:hidden">📱</span>
                </button>
              </div>

              <div className="h-8 w-px bg-gray-300"></div>

              {/* CTA Buttons */}
              <Link href="/signup" className="flex-1 sm:flex-initial">
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 text-sm sm:text-base font-semibold"
                >
                  <span className="hidden sm:inline">✨ Use This Template</span>
                  <span className="sm:hidden">✨ Use</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className={`fixed ${showControls ? 'top-20 sm:top-24' : 'top-4'} right-4 z-50 bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group`}
        title={showControls ? 'Hide Controls' : 'Show Controls'}
      >
        <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform inline-block">
          {showControls ? '👁️' : '👁️‍🗨️'}
        </span>
      </button>

      {/* Demo Banner */}
      <div className={`transition-all duration-300 ${showControls ? 'pt-24 sm:pt-28' : 'pt-16'}`}>
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold mb-4 border border-white/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Interactive Demo
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Experience {template.name}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-indigo-100 max-w-2xl mx-auto mb-6 sm:mb-8">
              This is a fully interactive preview. Scroll through all sections to see how your site will look.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">
                  {template.sections.length}
                </div>
                <div className="text-xs sm:text-sm text-indigo-200">Sections</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">100%</div>
                <div className="text-xs sm:text-sm text-indigo-200">Customizable</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">5min</div>
                <div className="text-xs sm:text-sm text-indigo-200">Setup</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">∞</div>
                <div className="text-xs sm:text-sm text-indigo-200">Possibilities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Sections Info */}
        <div className="bg-white border-b border-gray-200 py-6 sm:py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📦</span> Included Sections:
            </h3>
            <div className="flex flex-wrap gap-2">
              {template.sections.map((section) => (
                <span
                  key={section.id}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  {section.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-white shadow-2xl">
        <ModernPortfolio
          data={modernPortfolioSampleData}
          colors={template.defaultColors}
          fonts={template.defaultFonts}
        />
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 animate-bounce">
            <span className="text-3xl sm:text-4xl">🚀</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Own?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-indigo-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Start with this template and customize every aspect to match your brand. No coding required!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/signup">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-50 shadow-2xl font-semibold"
              >
                ✨ Start Building Now →
              </Button>
            </Link>
            <Link href="/templates">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold"
              >
                Browse More Templates
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: '🎨', text: 'Fully Customizable' },
              { icon: '⚡', text: 'Lightning Fast' },
              { icon: '📱', text: 'Mobile Responsive' },
              { icon: '🔒', text: 'Secure Hosting' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl sm:text-3xl mb-2">{feature.icon}</div>
                <div className="text-xs sm:text-sm font-medium">{feature.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
