import { useState, useEffect } from 'react'
import Link from 'next/link'
import Hero from '@/components/marketing/Hero'
import Features from '@/components/marketing/Features'
import HowItWorks from '@/components/marketing/HowItWorks'
import CTA from '@/components/marketing/CTA'
import { Button } from '@/components/ui/Button'

export default function NewLandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-lg sm:text-xl font-bold">O</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OnePager
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                How It Works
              </a>
              <Link href="/templates">
                <span className="text-gray-700 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Templates
                </span>
              </Link>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Pricing
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex hover:bg-gray-100 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 font-semibold text-sm sm:text-base">
                  Start Free →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Social Proof Bar */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              TRUSTED BY PROFESSIONALS WORLDWIDE
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 items-center opacity-60">
            {['Google', 'Microsoft', 'Amazon', 'Meta'].map((company, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">
                  {company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Built for Speed & Scale
            </h2>
            <p className="text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto">
              Join thousands of professionals creating stunning websites in minutes
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: '50K+', label: 'Sites Created', icon: '🌐' },
              { value: '99.9%', label: 'Uptime', icon: '⚡' },
              { value: '5min', label: 'Avg. Build Time', icon: '⏱️' },
              { value: '4.9/5', label: 'User Rating', icon: '⭐' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="text-center p-6 sm:p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl sm:text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-indigo-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4 border border-indigo-100">
              <span>⭐⭐⭐⭐⭐</span>
              <span>Loved by thousands</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real people building amazing sites
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Freelance Designer',
                avatar: '👩‍💼',
                text: 'OnePager saved me hours! I created a stunning portfolio in just 10 minutes. The templates are gorgeous and so easy to customize.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Startup Founder',
                avatar: '👨‍💻',
                text: 'As a non-technical founder, this was a game-changer. I built our landing page without writing a single line of code.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Marketing Manager',
                avatar: '👩‍🎨',
                text: 'The ease of use is incredible. I can create and update pages on the fly. Perfect for our fast-paced marketing campaigns.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div 
                key={idx}
                className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">O</span>
                </div>
                <span className="text-lg font-bold text-white">OnePager</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                Create stunning one-page websites in minutes. No coding required.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4 text-sm">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link href="/templates"><span className="hover:text-white transition-colors cursor-pointer">Templates</span></Link></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4 text-sm">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4 text-sm">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 OnePager. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-xl">𝕏</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-xl">in</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-xl">f</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
