const steps = [
  {
    number: '01',
    title: 'Choose a Template',
    description: 'Browse our collection of professional templates and pick the one that fits your style.',
    icon: '🎯',
  },
  {
    number: '02',
    title: 'Customize Everything',
    description: 'Use our visual editor to change colors, fonts, content, images, and more. No coding needed.',
    icon: '✏️',
  },
  {
    number: '03',
    title: 'Publish Instantly',
    description: 'Hit publish and your site goes live immediately. Share your link or connect a custom domain.',
    icon: '🚀',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Simple process
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How it works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Create your professional website in just 3 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20" />
                )}

                <div className="relative">
                  {/* Number Badge */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl shadow-lg mb-4 mx-auto lg:mx-0">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="text-center lg:text-left">
                    <div className="text-sm font-semibold text-indigo-600 mb-2">
                      STEP {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video/Demo placeholder */}
        <div className="mt-20 mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10">
            <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Watch Demo Video</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
