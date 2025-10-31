import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-16 sm:pt-32 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-96 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 blur-3xl rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5">
            <span className="text-sm font-medium text-indigo-700">
              ✨ No coding required
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Build Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {' '}Professional Website{' '}
            </span>
            in Minutes
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Create stunning one-page websites with our easy-to-use visual editor. 
            Choose from beautiful templates, customize everything, and publish instantly.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/dashboard">
              <Button size="lg" className="shadow-lg shadow-indigo-500/30">
                Get Started Free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg">
                Browse Templates
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-x-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white" />
                ))}
              </div>
              <span className="font-medium">Join 1,000+ creators</span>
            </div>
            <span className="text-gray-400">•</span>
            <span>⭐️ 4.9/5 rating</span>
          </div>
        </div>

        {/* Preview Image/Demo */}
        <div className="mt-16 sm:mt-24">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <div className="rounded-xl shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
              <div className="bg-white p-8">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                {/* Placeholder content */}
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg animate-pulse" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
