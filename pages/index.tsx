import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-indigo-600 shadow-lg mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              No coding required • Launch in minutes
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create Stunning
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                One-Page Websites
              </span>
              in Minutes
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional portfolios, resumes, and landing pages. No coding skills needed. 
              <span className="font-semibold text-gray-900"> Just pick a template and customize.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/50 px-8 py-4 text-lg font-semibold"
                  >
                    Go to Dashboard →
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/50 px-8 py-4 text-lg font-semibold"
                    >
                      Get Started Free →
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span className="font-medium">5.0 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span className="font-medium">Launch in 5 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span className="font-medium">No Coding Needed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-indigo-600">Stand Out</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make creating your perfect one-page site effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Templates</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from beautifully designed templates for portfolios, resumes, and business cards
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">✏️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Editor</h3>
              <p className="text-gray-600 leading-relaxed">
                Edit content, colors, and fonts with our intuitive drag-and-drop editor. See changes instantly
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Responsive</h3>
              <p className="text-gray-600 leading-relaxed">
                Every template looks perfect on all devices. Preview mobile, tablet, and desktop views
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with Next.js for blazing fast performance and optimal SEO
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🖼️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Image Upload</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop images or paste URLs. Automatic optimization for web
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Domains</h3>
              <p className="text-gray-600 leading-relaxed">
                Publish to your own domain or use our free hosting with SSL
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Launch Your Site in <span className="text-indigo-600">3 Easy Steps</span>
            </h2>
            <p className="text-xl text-gray-600">
              From template to published site in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 pt-12">
                <div className="text-6xl mb-6 text-center">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Choose Template</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Pick from our collection of professionally designed templates for portfolios, resumes, and more
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 pt-12">
                <div className="text-6xl mb-6 text-center">✏️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Customize Content</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Add your content, images, and branding. Change colors and fonts to match your style
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 pt-12">
                <div className="text-6xl mb-6 text-center">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Publish & Share</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Hit publish and share your beautiful site with the world. Update anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Create Your Perfect Site?
              </h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Join thousands of creators who have already launched their one-page sites. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-10 py-6 bg-white text-indigo-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white/10 transition-all">
                    View Templates
                  </Button>
                </Link>
              </div>
              <p className="mt-8 text-sm text-indigo-200">
                ✓ No credit card required  ✓ Free forever  ✓ Launch in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2025 OnePager. Built with ❤️ using Next.js & Tailwind CSS</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/templates" className="hover:text-white transition-colors">Templates</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
