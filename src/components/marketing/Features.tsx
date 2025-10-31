import { Card, CardContent } from '@/components/ui/Card'

const features = [
  {
    icon: '🎨',
    title: 'Visual Editor',
    description: 'Edit your site in real-time with our intuitive drag-and-drop editor. See changes instantly.',
  },
  {
    icon: '📱',
    title: 'Mobile Responsive',
    description: 'All templates are fully responsive and look perfect on any device - phone, tablet, or desktop.',
  },
  {
    icon: '⚡️',
    title: 'Fast & SEO Optimized',
    description: 'Lightning-fast loading speeds and built-in SEO optimization to help you rank higher.',
  },
  {
    icon: '🎯',
    title: 'Custom Domains',
    description: 'Connect your own domain or use our free subdomain to get online instantly.',
  },
  {
    icon: '🔒',
    title: 'Secure & Reliable',
    description: 'Your site is hosted on secure servers with 99.9% uptime guarantee.',
  },
  {
    icon: '💼',
    title: 'Professional Templates',
    description: 'Choose from dozens of professionally designed templates for any use case.',
  },
]

export default function Features() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful features for everyone
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From beginners to professionals, our platform has all the tools you need to create an amazing online presence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-4xl">{feature.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            And many more features to help you succeed online
          </p>
        </div>
      </div>
    </section>
  )
}
