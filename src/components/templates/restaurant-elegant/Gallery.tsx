/**
 * Restaurant Elegant - Gallery Section
 * 
 * Elegant image gallery with hover effects
 * Masonry or grid layout for restaurant/food photos
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'

interface GalleryImage {
  id: string
  src: string
  alt: string
  category?: string
}

interface GalleryProps {
  title: string
  subtitle?: string
  images: GalleryImage[]
}

export default function Gallery({ title, subtitle, images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4">
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

        {/* Gallery Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => setSelectedImage(image)}
              style={{
                gridRow: index % 7 === 0 ? 'span 2' : 'span 1',
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>
                {image.category && (
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-medium text-white">
                      {image.category}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
