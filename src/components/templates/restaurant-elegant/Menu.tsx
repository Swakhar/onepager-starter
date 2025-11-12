/**
 * Restaurant Elegant - Menu Section
 * 
 * Elegant menu display with categories and filtering
 * Perfect for showcasing dishes with prices
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Sparkles } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: string
  image?: string
  isSpecial?: boolean
  rating?: number
  tags?: string[]
}

interface MenuProps {
  title: string
  subtitle?: string
  items: MenuItem[]
  showImages?: boolean
}

export default function Menu({ title, subtitle, items, showImages = true }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(items.map((item) => item.category)))]

  // Filter items by category
  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, #d97706 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

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

          {/* Decorative Divider */}
          <div className="mx-auto mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
            <Sparkles className="h-5 w-5 text-amber-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-6 py-3 font-medium capitalize transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 md:grid-cols-2"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Special Badge */}
                {item.isSpecial && (
                  <div className="absolute right-4 top-4 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Chef's Special
                    </span>
                  </div>
                )}

                <div className="flex gap-6">
                  {/* Image */}
                  {showImages && item.image && (
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="mb-1 font-serif text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-amber-600">
                          {item.name}
                        </h3>
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < item.rating!
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 font-serif text-2xl font-bold text-amber-600">
                        {item.price}
                      </div>
                    </div>

                    <p className="mb-3 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/0 transition-all duration-300 group-hover:border-amber-500/20" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <a
            href="#reservations"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
          >
            <span>Make a Reservation</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
