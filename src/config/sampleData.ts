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

export const restaurantElegantSampleData: TemplateData = {
  hero: {
    slides: [
      {
        id: '1',
        badge: 'Welcome',
        title: 'ITALIAN CUISINE',
        subtitle: 'Authentic Flavors',
        description: 'Experience the finest Italian dining with our chef\'s special recipes passed down through generations.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop',
        ctaPrimary: { text: 'View Menu', link: '#menu' },
        ctaSecondary: { text: 'Book Table', link: '#reservations' }
      },
      {
        id: '2',
        badge: 'Delicious',
        title: 'HANDCRAFTED PASTA',
        subtitle: 'Made Fresh Daily',
        description: 'Our pasta is made fresh every morning using traditional Italian techniques and the finest ingredients.',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1920&h=1080&fit=crop',
        ctaPrimary: { text: 'Order Now', link: '#menu' },
        ctaSecondary: { text: 'View Menu', link: '#menu' }
      },
      {
        id: '3',
        badge: 'Elegant',
        title: 'FINE DINING EXPERIENCE',
        subtitle: 'Unforgettable Moments',
        description: 'Join us for an evening of exceptional food, wine, and ambiance in our elegant dining room.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop',
        ctaPrimary: { text: 'Reserve Now', link: '#reservations' },
        ctaSecondary: { text: 'Learn More', link: '#about' }
      }
    ]
  },
  about: {
    title: 'About Us',
    subtitle: 'Our Story',
    description: 'Bella Italia brings authentic Italian cuisine to your table. Founded in 1995 by Chef Giovanni Rossi, our restaurant has been a cornerstone of fine dining, serving traditional recipes with a modern twist.',
    story: 'Our passion for food and dedication to quality has earned us numerous accolades over the years. Every dish is crafted with love and the freshest ingredients sourced from local markets and imported directly from Italy.',
    features: [
      {
        icon: 'award',
        title: 'Award Winning',
        description: 'Recognized by Michelin Guide for exceptional cuisine'
      },
      {
        icon: 'heart',
        title: 'Made with Love',
        description: 'Every dish prepared with passion and authentic recipes'
      },
      {
        icon: 'users',
        title: 'Family Tradition',
        description: 'Recipes passed down through generations'
      },
      {
        icon: 'clock',
        title: 'Fresh Daily',
        description: 'Ingredients sourced fresh every morning'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=500&fit=crop'
    ],
    stats: [
      { number: '28+', label: 'Years' },
      { number: '150K', label: 'Happy Guests' },
      { number: '50+', label: 'Dishes' }
    ]
  },
  menu: {
    title: 'Our Menu',
    subtitle: 'Culinary Excellence',
    items: [
      {
        id: 'menu-1',
        name: 'Bruschetta al Pomodoro',
        description: 'Toasted bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil',
        price: '$12',
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
        rating: 5,
        tags: ['Vegetarian', 'Popular']
      },
      {
        id: 'menu-2',
        name: 'Caprese Salad',
        description: 'Fresh mozzarella, ripe tomatoes, and basil drizzled with balsamic glaze',
        price: '$14',
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop',
        rating: 5,
        tags: ['Vegetarian', 'Gluten-Free']
      },
      {
        id: 'menu-3',
        name: 'Spaghetti Carbonara',
        description: 'Classic Roman pasta with eggs, pecorino cheese, guanciale, and black pepper',
        price: '$24',
        category: 'main course',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
        isSpecial: true,
        rating: 5,
        tags: ['Chef\'s Special', 'Traditional']
      },
      {
        id: 'menu-4',
        name: 'Osso Buco',
        description: 'Braised veal shanks with saffron risotto and gremolata',
        price: '$38',
        category: 'main course',
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e36f?w=400&h=300&fit=crop',
        isSpecial: true,
        rating: 5,
        tags: ['Chef\'s Special', 'Premium']
      },
      {
        id: 'menu-5',
        name: 'Margherita Pizza',
        description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil',
        price: '$18',
        category: 'main course',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        rating: 5,
        tags: ['Vegetarian', 'Popular']
      },
      {
        id: 'menu-6',
        name: 'Branzino al Forno',
        description: 'Oven-baked Mediterranean sea bass with lemon, herbs, and roasted vegetables',
        price: '$32',
        category: 'main course',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
        rating: 4,
        tags: ['Gluten-Free', 'Fresh']
      },
      {
        id: 'menu-7',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream',
        price: '$10',
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
        rating: 5,
        tags: ['Signature', 'Popular']
      },
      {
        id: 'menu-8',
        name: 'Panna Cotta',
        description: 'Silky vanilla cream with berry compote',
        price: '$9',
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
        rating: 4,
        tags: ['Gluten-Free']
      },
      {
        id: 'menu-9',
        name: 'Espresso',
        description: 'Authentic Italian espresso from premium Arabica beans',
        price: '$4',
        category: 'beverages',
        rating: 5,
        tags: ['Traditional']
      },
      {
        id: 'menu-10',
        name: 'House Chianti',
        description: 'Premium Tuscan red wine, full-bodied with notes of cherry and spice',
        price: '$12',
        category: 'beverages',
        rating: 5,
        tags: ['Wine', 'Premium']
      }
    ]
  },
  gallery: {
    title: 'Gallery',
    subtitle: 'Our Restaurant',
    images: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        alt: 'Restaurant interior',
        category: 'Interior'
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop',
        alt: 'Italian pasta dish',
        category: 'Food'
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        alt: 'Dining table setup',
        category: 'Interior'
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=1200&fit=crop',
        alt: 'Pizza preparation',
        category: 'Food'
      },
      {
        id: 'gallery-5',
        src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        alt: 'Fine dining atmosphere',
        category: 'Interior'
      },
      {
        id: 'gallery-6',
        src: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop',
        alt: 'Gourmet dessert',
        category: 'Food'
      },
      {
        id: 'gallery-7',
        src: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=1200&fit=crop',
        alt: 'Wine cellar',
        category: 'Interior'
      },
      {
        id: 'gallery-8',
        src: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop',
        alt: 'Private dining event',
        category: 'Events'
      }
    ]
  },
  testimonials: {
    title: 'What Our Guests Say',
    subtitle: 'Customer Reviews',
    items: [
      {
        id: 'test-1',
        content: 'Absolutely incredible dining experience! The pasta was perfection, and the service was impeccable. This is authentic Italian cuisine at its finest.',
        author: 'Sarah Johnson',
        role: 'Food Critic',
        company: 'Gourmet Magazine',
        rating: 5,
        date: 'Oct 2025'
      },
      {
        id: 'test-2',
        content: 'Best Italian restaurant I\'ve been to outside of Italy. The ambiance is perfect for a romantic dinner, and every dish exceeded our expectations.',
        author: 'Michael Chen',
        role: 'Regular Customer',
        rating: 5,
        date: 'Nov 2025'
      },
      {
        id: 'test-3',
        content: 'The tiramisu alone is worth the visit! Chef Giovanni\'s attention to detail and use of authentic ingredients makes this place truly special.',
        author: 'Emma Rodriguez',
        role: 'Travel Blogger',
        rating: 5,
        date: 'Nov 2025'
      },
      {
        id: 'test-4',
        content: 'We celebrated our anniversary here and it was magical. From the wine selection to the dessert, everything was perfect. Highly recommended!',
        author: 'David & Lisa Thompson',
        role: 'Guests',
        rating: 5,
        date: 'Sept 2025'
      }
    ]
  },
  reservations: {
    title: 'Book Your Table',
    subtitle: 'Reserve Now',
    description: 'Reserve your table for an unforgettable dining experience. We recommend booking in advance, especially for weekend dinners.'
  },
  contact: {
    phone: '+1 (555) 789-0123',
    email: 'info@bellaitalia.com',
    address: '456 Culinary Boulevard, Downtown District, New York, NY 10001',
    hours: 'Monday - Thursday: 5:00 PM - 10:00 PM\nFriday - Saturday: 5:00 PM - 11:00 PM\nSunday: 4:00 PM - 9:00 PM'
  },
  footer: {
    about: {
      title: 'Bella Italia',
      description: 'Bringing authentic Italian flavors and traditions to your table since 1995. Every dish tells a story of passion, heritage, and culinary excellence.'
    },
    services: [
      { title: 'Dine In', link: '#menu' },
      { title: 'Private Events', link: '#reservations' },
      { title: 'Catering', link: '#contact' },
      { title: 'Gift Cards', link: '#contact' },
      { title: 'Wine Tasting', link: '#reservations' }
    ],
    blog: [
      {
        title: 'The Art of Making Perfect Carbonara',
        date: 'Nov 10, 2025',
        author: 'Chef Giovanni',
        comments: 24,
        link: '#'
      },
      {
        title: 'Wine Pairing Guide for Italian Cuisine',
        date: 'Nov 5, 2025',
        author: 'Sommelier Marco',
        comments: 18,
        link: '#'
      },
      {
        title: 'Behind the Scenes: A Day in Our Kitchen',
        date: 'Oct 28, 2025',
        author: 'Chef Giovanni',
        comments: 32,
        link: '#'
      }
    ]
  },
  social: {
    facebook: 'https://facebook.com/bellaitalia',
    instagram: 'https://instagram.com/bellaitalia',
    twitter: 'https://twitter.com/bellaitalia',
    youtube: 'https://youtube.com/bellaitalia'
  },
}
