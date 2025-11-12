/**
 * Restaurant Elegant - About Section
 * 
 * Two-column layout with image gallery and story
 * Elegant typography with serif fonts
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Award, Heart, Users, Clock } from 'lucide-react'

interface AboutProps {
  title: string
  subtitle?: string
  description: string
  story?: string
  features?: Array<{
    icon: string
    title: string
    description: string
  }>
  images?: string[]
  stats?: Array<{
    number: string
    label: string
  }>
}

export default function About({
  title,
  subtitle,
  description,
  story,
  features,
  images = [],
  stats,
}: AboutProps) {
  const iconMap: Record<string, any> = {
    award: Award,
    heart: Heart,
    users: Users,
    clock: Clock,
  }

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      {/* Decorative Background Elements */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-amber-50 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-50 opacity-50 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          {subtitle && (
            <span className="mb-4 inline-block font-serif text-sm font-medium tracking-wider text-amber-600 uppercase">
              {subtitle}
            </span>
          )}
          <h2 className="mx-auto max-w-3xl font-serif text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            {title}
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {images.length > 0 ? (
              <div className="grid gap-4">
                {/* Main large image */}
                <div className="group relative overflow-hidden rounded-2xl">
                  <img
                    src={images[0]}
                    alt="Restaurant interior"
                    className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Smaller images grid */}
                {images.length > 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {images.slice(1, 3).map((image, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl"
                      >
                        <img
                          src={image}
                          alt={`Restaurant image ${index + 2}`}
                          className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100" />
            )}

            {/* Decorative Gold Border */}
            <div className="absolute -bottom-6 -left-6 h-32 w-32 border-4 border-amber-500 rounded-tl-3xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-gray-700">
                {description}
              </p>

              {story && (
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  {story}
                </p>
              )}
            </div>

            {/* Features Grid */}
            {features && features.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {features.map((feature, index) => {
                  const IconComponent = iconMap[feature.icon.toLowerCase()] || Award
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 rounded-full bg-amber-100 p-3 transition-colors duration-300 group-hover:bg-amber-500">
                          <IconComponent className="h-6 w-6 text-amber-600 transition-colors duration-300 group-hover:text-white" />
                        </div>
                        <div>
                          <h3 className="mb-1 font-serif text-lg font-semibold text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-amber-200 pt-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="mb-2 font-serif text-4xl font-bold text-amber-600">
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
