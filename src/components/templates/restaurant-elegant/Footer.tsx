/**
 * Restaurant Elegant - Contact/Footer Section
 * 
 * Multi-column footer with elegant design
 * Includes about, services, blog, and contact info
 */

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail,
  Heart,
  ExternalLink
} from 'lucide-react'

interface FooterProps {
  about?: {
    title: string
    description: string
  }
  services?: Array<{
    title: string
    link?: string
  }>
  blog?: Array<{
    title: string
    date: string
    author: string
    comments: number
    link?: string
  }>
  contact?: {
    address?: string
    phone?: string
    email?: string
  }
  social?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
  siteName?: string
}

export default function Footer({
  about,
  services,
  blog,
  contact,
  social,
  siteName = 'Restaurant',
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, url: social?.facebook, label: 'Facebook' },
    { icon: Instagram, url: social?.instagram, label: 'Instagram' },
    { icon: Twitter, url: social?.twitter, label: 'Twitter' },
    { icon: Youtube, url: social?.youtube, label: 'YouTube' },
  ].filter(link => link.url)

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-20 pb-8">
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
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-amber-500 opacity-10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-500 opacity-10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 font-serif text-2xl font-bold text-white">
              {about?.title || 'About Us'}
            </h3>
            <p className="mb-6 leading-relaxed text-gray-400">
              {about?.description || 'Experience the finest culinary journey with our authentic dishes and exceptional service.'}
            </p>
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-full bg-white/5 p-3 transition-all duration-300 hover:bg-amber-500"
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
                    </a>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Services Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="mb-6 font-serif text-2xl font-bold text-white">
              Services
            </h3>
            <ul className="space-y-3">
              {services && services.length > 0 ? (
                services.map((service, index) => (
                  <li key={index}>
                    <a
                      href={service.link || '#'}
                      className="group flex items-center text-gray-400 transition-colors duration-300 hover:text-amber-500"
                    >
                      <span className="mr-2 h-1 w-1 rounded-full bg-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {service.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#" className="text-gray-400 hover:text-amber-500">Dine In</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-amber-500">Takeaway</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-amber-500">Delivery</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-amber-500">Catering</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-amber-500">Private Events</a></li>
                </>
              )}
            </ul>
          </motion.div>

          {/* Recent Blog Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="mb-6 font-serif text-2xl font-bold text-white">
              Recent Blog
            </h3>
            <div className="space-y-4">
              {blog && blog.length > 0 ? (
                blog.slice(0, 3).map((post, index) => (
                  <a
                    key={index}
                    href={post.link || '#'}
                    className="group block"
                  >
                    <h4 className="mb-2 text-sm font-medium leading-snug text-gray-300 transition-colors duration-300 group-hover:text-amber-500">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </a>
                ))
              ) : (
                <>
                  <div>
                    <h4 className="mb-2 text-sm text-gray-300">The Art of Italian Cuisine</h4>
                    <p className="text-xs text-gray-500">Nov 10, 2025 • Chef Mario</p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm text-gray-300">Wine Pairing Secrets</h4>
                    <p className="text-xs text-gray-500">Nov 8, 2025 • Sommelier Anna</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="mb-6 font-serif text-2xl font-bold text-white">
              Contact
            </h3>
            <div className="space-y-4">
              {contact?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-amber-500" />
                  <p className="text-sm leading-relaxed text-gray-400">
                    {contact.address}
                  </p>
                </div>
              )}
              {contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-500" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-gray-400 transition-colors duration-300 hover:text-amber-500"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-500" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-gray-400 transition-colors duration-300 hover:text-amber-500"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-gray-400">
              © {currentYear} {siteName}. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-400">
              Crafted with <Heart className="h-4 w-4 fill-amber-500 text-amber-500" /> by{' '}
              <a
                href="https://colorlib.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-500 transition-colors duration-300 hover:text-amber-400"
              >
                Colorlib
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
