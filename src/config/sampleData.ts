import { TemplateData } from '@/types/template'

export const modernPortfolioSampleData: TemplateData = {
  hero: {
    title: 'Hi, I\'m Alex Johnson',
    subtitle: 'Full-Stack Developer & Designer',
    description: 'I create beautiful, functional websites and applications that help businesses grow. With 5+ years of experience, I specialize in React, Next.js, and modern web technologies.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    cta: {
      primary: {
        text: 'View My Work',
        link: '#projects',
      },
      secondary: {
        text: 'Contact Me',
        link: '#contact',
      },
    },
  },
  about: {
    title: 'About Me',
    description: 'I\'m a passionate developer who loves turning ideas into reality. I have a strong foundation in both frontend and backend development, with a keen eye for design and user experience. When I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    highlights: [
      '5+ years of professional development experience',
      'Expert in React, Next.js, and TypeScript',
      'Strong focus on performance and accessibility',
      'Contributor to open-source projects',
    ],
  },
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A fully-featured online store with payment processing, inventory management, and admin dashboard.',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop',
      tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'],
      link: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative project management tool with real-time updates and team features.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      tags: ['React', 'Firebase', 'Material-UI'],
      link: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'A beautiful weather app with forecasts, alerts, and location-based features.',
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&h=400&fit=crop',
      tags: ['Vue.js', 'API Integration', 'Charts'],
      link: 'https://example.com',
    },
  ],
  contact: {
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    showForm: true,
  },
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    website: 'https://example.com',
  },
}
