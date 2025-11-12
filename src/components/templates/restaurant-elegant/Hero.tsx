/**
 * Restaurant Elegant - Hero Section
 * 
 * Fullscreen carousel/slider with elegant overlay
 * Inspired by fine dining restaurant aesthetic
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroSlide {
  id: string
  badge?: string
  title: string
  subtitle?: string
  description: string
  image: string
  ctaPrimary?: {
    text: string
    link: string
  }
  ctaSecondary?: {
    text: string
    link: string
  }
}

interface HeroProps {
  slides: HeroSlide[]
  autoplay?: boolean
  autoplayDelay?: number
}

export default function Hero({ slides, autoplay = true, autoplayDelay = 5000 }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [currentSlide, autoplay, autoplayDelay])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  const slide = slides[currentSlide]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex h-full items-center justify-center px-4">
            <div className="max-w-4xl text-center">
              {/* Badge */}
              {slide.badge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-4 inline-block"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-2 text-sm font-medium tracking-wider text-amber-400 backdrop-blur-sm">
                    {slide.badge}
                  </span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-4 font-serif text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mb-4 font-serif text-2xl font-light italic text-amber-400 md:text-3xl"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                {slide.ctaPrimary && (
                  <a
                    href={slide.ctaPrimary.link}
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
                  >
                    <span className="relative z-10">{slide.ctaPrimary.text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </a>
                )}
                {slide.ctaSecondary && (
                  <a
                    href={slide.ctaSecondary.link}
                    className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20"
                  >
                    {slide.ctaSecondary.text}
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 hover:scale-110 md:left-8"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 hover:scale-110 md:right-8"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-12 bg-amber-500'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-16 w-full fill-white md:h-24"
        >
          <path d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  )
}
