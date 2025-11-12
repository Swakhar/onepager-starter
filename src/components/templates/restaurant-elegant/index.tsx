/**
 * Restaurant Elegant Template
 * 
 * Premium restaurant template for fine dining establishments
 * Features: Fullscreen hero slider, elegant menu, gallery, reservations
 * Perfect for: Italian, French, Fine Dining restaurants
 * 
 * Sections: hero, about, menu, gallery, testimonials, reservations, footer
 */

import Hero from './Hero'
import About from './About'
import Menu from './Menu'
import Gallery from './Gallery'
import Testimonials from './Testimonials'
import Reservations from './Reservations'
import Footer from './Footer'

// Default section order for this template
export const defaultSectionOrder = [
  'hero',
  'about',
  'menu',
  'gallery',
  'testimonials',
  'reservations',
  'footer',
]

// Supported sections for this template
export const templateSupportedSections = [
  'hero',
  'about',
  'menu',
  'gallery',
  'testimonials',
  'reservations',
  'footer',
]

// Template metadata
export const templateMetadata = {
  id: 'restaurant-elegant',
  name: 'Restaurant Elegant',
  description: 'Premium template for fine dining restaurants with elegant design',
  category: 'Restaurant',
  tags: ['restaurant', 'elegant', 'fine-dining', 'italian', 'french', 'premium'],
  previewImage: '/templates/restaurant-elegant/preview.jpg',
  features: [
    'Fullscreen hero slider with autoplay',
    'Elegant about section with image gallery',
    'Menu with categories and filtering',
    'Photo gallery with lightbox',
    'Customer testimonials',
    'Reservation booking form',
    'Multi-column footer',
  ],
}

// Main template component
export default function RestaurantElegant({ data, colors, fonts }: { data: any; colors?: any; fonts?: any }) {
  // Destructure with defaults
  const hero = data?.hero
  const about = data?.about
  const menu = data?.menu
  const gallery = data?.gallery
  const testimonials = data?.testimonials
  const reservations = data?.reservations
  const footer = data?.footer
  const contact = data?.contact
  const social = data?.social
  const sectionOrder = data?.sectionOrder || defaultSectionOrder

  // Section component mapping
  const sectionComponents: Record<string, (isAlternate: boolean) => JSX.Element | null> = {
    hero: () =>
      hero ? (
        <Hero
          slides={hero.slides || [
            {
              id: '1',
              badge: hero.badge,
              title: hero.title,
              subtitle: hero.subtitle,
              description: hero.description,
              image: hero.backgroundImage || '/images/restaurant-hero.jpg',
              ctaPrimary: hero.cta?.primary,
              ctaSecondary: hero.cta?.secondary,
            },
          ]}
          autoplay={true}
          autoplayDelay={5000}
        />
      ) : null,

    about: () =>
      about ? (
        <About
          title={about.title}
          subtitle={about.subtitle}
          description={about.description}
          story={about.story}
          features={about.features}
          images={about.images}
          stats={about.stats}
        />
      ) : null,

    menu: () =>
      menu?.items && menu.items.length > 0 ? (
        <Menu
          title={menu.title || 'Our Menu'}
          subtitle={menu.subtitle}
          items={menu.items}
          showImages={true}
        />
      ) : null,

    gallery: () =>
      gallery?.images && gallery.images.length > 0 ? (
        <Gallery
          title={gallery.title || 'Gallery'}
          subtitle={gallery.subtitle}
          images={gallery.images}
        />
      ) : null,

    testimonials: () =>
      testimonials?.items && testimonials.items.length > 0 ? (
        <Testimonials
          title={testimonials.title || 'What Our Guests Say'}
          subtitle={testimonials.subtitle}
          items={testimonials.items}
        />
      ) : null,

    reservations: () =>
      reservations ? (
        <Reservations
          title={reservations.title || 'Book a Table'}
          subtitle={reservations.subtitle}
          description={reservations.description}
          contact={contact}
        />
      ) : null,

    footer: () => (
      <Footer
        about={footer?.about}
        services={footer?.services}
        blog={footer?.blog}
        contact={contact}
        social={social}
        siteName={data?.title || 'Restaurant'}
      />
    ),
  }

  return (
    <div className="restaurant-elegant-template" style={{
      '--primary-color': colors?.primary || '#d97706',
      '--secondary-color': colors?.secondary || '#fbbf24',
      '--accent-color': colors?.accent || '#f59e0b',
    } as React.CSSProperties}>
      {sectionOrder.map((sectionId: string, index: number) => {
        const SectionComponent = sectionComponents[sectionId]
        if (!SectionComponent) return null

        const isAlternate = index % 2 === 1
        return <div key={sectionId}>{SectionComponent(isAlternate)}</div>
      })}
    </div>
  )
}

// Export all components for editor usage
export {
  Hero,
  About,
  Menu,
  Gallery,
  Testimonials,
  Reservations,
  Footer,
}
