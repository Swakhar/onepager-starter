/**
 * Restaurant Elegant - Reservations Section
 * 
 * Booking form with contact information
 * Elegant design for taking reservations
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Phone, Mail, MapPin } from 'lucide-react'

interface ReservationsProps {
  title: string
  subtitle?: string
  description?: string
  contact?: {
    phone?: string
    email?: string
    address?: string
    hours?: string
  }
}

export default function Reservations({ title, subtitle, description, contact }: ReservationsProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Reservation:', formData)
    alert('Thank you! We will confirm your reservation shortly.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-50 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-amber-50 opacity-50 blur-3xl" />

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
          {description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {description}
            </p>
          )}
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700">
                    <Calendar className="mr-1 inline h-4 w-4" />
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="mb-2 block text-sm font-medium text-gray-700">
                    <Clock className="mr-1 inline h-4 w-4" />
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label htmlFor="guests" className="mb-2 block text-sm font-medium text-gray-700">
                    <Users className="mr-1 inline h-4 w-4" />
                    Guests *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                    <option value="10+">10+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                  Special Requests
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors duration-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Any dietary restrictions, special occasions, or seating preferences..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
              >
                Book Your Table
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Contact Cards */}
            {contact?.phone && (
              <div className="group flex items-start gap-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="flex-shrink-0 rounded-full bg-amber-500 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold text-gray-900">Phone</h3>
                  <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-amber-600">
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {contact?.email && (
              <div className="group flex items-start gap-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="flex-shrink-0 rounded-full bg-amber-500 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold text-gray-900">Email</h3>
                  <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-amber-600">
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            {contact?.address && (
              <div className="group flex items-start gap-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="flex-shrink-0 rounded-full bg-amber-500 p-4 transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">{contact.address}</p>
                </div>
              </div>
            )}

            {contact?.hours && (
              <div className="group flex items-start gap-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="flex-shrink-0 rounded-full bg-amber-500 p-4 transition-transform duration-300 group-hover:scale-110">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold text-gray-900">Hours</h3>
                  <p className="text-gray-600 whitespace-pre-line">{contact.hours}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
