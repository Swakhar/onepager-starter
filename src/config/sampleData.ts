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
  skills: [
    {
      id: '1',
      name: 'React & Next.js',
      level: 95,
      category: 'Frontend',
    },
    {
      id: '2',
      name: 'TypeScript',
      level: 90,
      category: 'Languages',
    },
    {
      id: '3',
      name: 'Node.js',
      level: 85,
      category: 'Backend',
    },
    {
      id: '4',
      name: 'UI/UX Design',
      level: 80,
      category: 'Design',
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

export const businessCardSampleData: TemplateData = {
  hero: {
    title: 'Sarah Chen',
    subtitle: 'Product Designer',
    description: 'Crafting delightful user experiences and bringing ideas to life through design.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
  },
  about: {
    title: 'About Me',
    description: 'I\'m a product designer with a passion for creating intuitive and beautiful digital experiences. With 7+ years in the industry, I specialize in UX/UI design, prototyping, and design systems.',
  },
  skills: [
    {
      id: '1',
      name: 'UI/UX Design',
      level: 95,
      category: 'Design',
    },
    {
      id: '2',
      name: 'Figma',
      level: 95,
      category: 'Tools',
    },
    {
      id: '3',
      name: 'Prototyping',
      level: 90,
      category: 'Design',
    },
    {
      id: '4',
      name: 'Design Systems',
      level: 85,
      category: 'Design',
    },
  ],
  contact: {
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
  },
  social: {
    linkedin: 'https://linkedin.com',
    dribbble: 'https://dribbble.com',
    behance: 'https://behance.net',
    website: 'https://sarahchen.design',
  },
}

export const creativeResumeSampleData: TemplateData = {
  hero: {
    title: 'Michael Rodriguez',
    subtitle: 'Senior Software Engineer',
    description: 'Building scalable applications and leading engineering teams to success.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop',
  },
  about: {
    title: 'Professional Summary',
    description: 'Results-driven software engineer with 8+ years of experience in full-stack development. Proven track record of leading teams, architecting scalable solutions, and delivering high-quality software on time. Passionate about clean code, mentoring, and continuous learning.',
  },
  experience: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: '',
      description: 'Leading a team of 5 engineers building cloud-native applications using microservices architecture.',
      achievements: [
        'Architected and deployed a new payment system processing $10M+ annually',
        'Reduced API response time by 40% through optimization and caching',
        'Mentored 3 junior developers, 2 of whom were promoted to mid-level roles',
      ],
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      description: 'Full-stack developer working on core product features and infrastructure.',
      achievements: [
        'Built RESTful APIs serving 50k+ daily active users',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Led migration from monolith to microservices architecture',
      ],
    },
    {
      id: '3',
      title: 'Junior Developer',
      company: 'WebSolutions LLC',
      location: 'Austin, TX',
      startDate: 'Jul 2016',
      endDate: 'May 2018',
      description: 'Developed client websites and internal tools using modern web technologies.',
      achievements: [
        'Delivered 15+ client projects with 100% on-time completion rate',
        'Improved page load times by 50% through optimization',
      ],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2012',
      endDate: '2016',
      gpa: '3.8',
      description: 'Focus on Software Engineering and Artificial Intelligence',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'JavaScript/TypeScript',
      level: 95,
      category: 'Languages',
    },
    {
      id: '2',
      name: 'React & Node.js',
      level: 95,
      category: 'Frameworks',
    },
    {
      id: '3',
      name: 'AWS & Docker',
      level: 85,
      category: 'DevOps',
    },
    {
      id: '4',
      name: 'PostgreSQL & MongoDB',
      level: 85,
      category: 'Databases',
    },
    {
      id: '5',
      name: 'System Design',
      level: 90,
      category: 'Architecture',
    },
    {
      id: '6',
      name: 'Team Leadership',
      level: 85,
      category: 'Soft Skills',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Open Source Monitoring Tool',
      description: 'Created a popular open-source application monitoring and alerting system with 2k+ GitHub stars.',
      tags: ['Node.js', 'React', 'WebSocket', 'MongoDB'],
      github: 'https://github.com',
    },
    {
      id: '2',
      title: 'ML Model Deployment Platform',
      description: 'Built an internal platform for deploying and managing machine learning models at scale.',
      tags: ['Python', 'Kubernetes', 'TensorFlow', 'FastAPI'],
    },
  ],
  contact: {
    email: 'michael.rodriguez@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
  },
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    website: 'https://michaelrodriguez.dev',
  },
}
