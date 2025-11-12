/**
 * Restaurant Elegant - Testimonials Section
 * 
 * Customer reviews with elegant card design
 * Includes ratings and customer info
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  content: string
  author: string
  role?: string
  company?: string
  rating: number
  image?: string
  date?: string
}

interface TestimonialsProps {
  title: string
  subtitle?: string
  items: Testimonial[]
}

export default function Testimonials({ title, subtitle, items }: TestimonialsProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-amber-500 opacity-10 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-amber-500 opacity-10 blur-3xl" />

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
            <span className="mb-4 inline-block font-serif text-sm font-medium tracking-wider text-amber-500 uppercase">
              {subtitle}
            </span>
          )}
          <h2 className="mx-auto max-w-3xl font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {title}
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              {/* Quote Icon */}
              <div className="mb-6 inline-flex rounded-full bg-amber-500/10 p-3">
                <Quote className="h-6 w-6 text-amber-500" />
              </div>

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="mb-6 font-serif text-lg leading-relaxed text-gray-200">
                "{testimonial.content}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500/20"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                      {testimonial.company && ` • ${testimonial.company}`}
                    </div>
                  )}
                  {testimonial.date && (
                    <div className="text-xs text-gray-500">{testimonial.date}</div>
                  )}
                </div>
              </div>

              {/* Decorative Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/0 transition-all duration-300 group-hover:border-amber-500/20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
