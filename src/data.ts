/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Gig, Gift } from './types';

export const VIRTUAL_GIFTS: Gift[] = [
  { id: 'gift_1', name: 'Rose', icon: '🌹', cost: 10, color: 'text-red-500' },
  { id: 'gift_2', name: 'Heart', icon: '❤️', cost: 25, color: 'text-pink-500' },
  { id: 'gift_3', name: 'Star', icon: '⭐', cost: 50, color: 'text-purple-400' },
  { id: 'gift_4', name: 'Crown', icon: '👑', cost: 100, color: 'text-yellow-400' },
  { id: 'gift_5', name: 'Diamond', icon: '💎', cost: 500, color: 'text-cyan-400' },
  { id: 'gift_6', name: 'Rocket', icon: '🚀', cost: 1000, color: 'text-amber-500' },
  { id: 'gift_7', name: 'Golden Trophy', icon: '🏆', cost: 5000, color: 'text-yellow-500 animate-pulse' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    username: 'fatima_uiux',
    name: 'Fatima Malik',
    email: 'fatima@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    role: 'Freelancer',
    bio: 'Senior UI/UX & Brand Identity Designer. Creating visual systems and high-fidelity prototypes that drive business conversions across Pakistan and global startups.',
    skills: ['UI/UX Design', 'Figma', 'Wireframing', 'Prototyping', 'Brand Identity'],
    city: 'Lahore',
    country: 'Pakistan',
    rating: 4.9,
    completedJobs: 45,
    badge: 'Creator',
    subscription: 'Pro',
    coins: 1200,
    portfolio: [
      {
        id: 'p_1',
        title: 'Mobile Crypto Wallet Dashboard',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'p_2',
        title: 'SaaS Landing Page Concept',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300'
      }
    ],
    experiences: [
      { role: 'Senior UI Designer', company: 'Systems Limited', duration: '2024 - Present' },
      { role: 'UI/UX Associate', company: 'Devsinc', duration: '2022 - 2024' }
    ]
  },
  {
    id: 'user_2',
    username: 'hamza_motion',
    name: 'Hamza Siddiqui',
    email: 'hamza@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600',
    role: 'Freelancer',
    bio: 'Motion Graphics Artist & Video Editor. Crafting stunning Explainer Videos, Logo Animations, and 3D Visual Effects to bring digital content to life.',
    skills: ['Video Editing', 'After Effects', 'Premiere Pro', '3D Animation', 'Motion Graphics'],
    city: 'Karachi',
    country: 'Pakistan',
    rating: 4.8,
    completedJobs: 28,
    badge: 'Verified',
    subscription: 'VIP',
    coins: 850,
    portfolio: [
      {
        id: 'p_3',
        title: 'Fintech Explainer Concept Video',
        imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'p_4',
        title: '3D Abstract Logo Reveal',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=300'
      }
    ],
    experiences: [
      { role: 'Lead Motion Designer', company: 'PostMus', duration: '2023 - Present' },
      { role: 'Video Production Specialist', company: 'Symmetry Group', duration: '2021 - 2023' }
    ]
  },
  {
    id: 'user_3',
    username: 'zain_dev',
    name: 'Zain Ali',
    email: 'zain@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    role: 'Freelancer',
    bio: 'Full Stack Web Developer & Programming Consultant. Specializing in React, Node.js, Next.js, and WordPress custom e-commerce deployment.',
    skills: ['Programming', 'React', 'TypeScript', 'Node.js', 'WordPress', 'Next.js'],
    city: 'Islamabad',
    country: 'Pakistan',
    rating: 5.0,
    completedJobs: 19,
    badge: 'Verified',
    subscription: 'Pro',
    coins: 420,
    portfolio: [
      {
        id: 'p_5',
        title: 'Custom WordPress Storefront',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'p_6',
        title: 'Real-time Chat Engine',
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=300'
      }
    ],
    experiences: [
      { role: 'Software Engineer', company: 'VentureDive', duration: '2024 - Present' },
      { role: 'Full Stack Intern', company: 'Arpatech', duration: '2023 - 2024' }
    ]
  },
  {
    id: 'user_4',
    username: 'imran_builder',
    name: 'Imran Khan',
    email: 'imran@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    role: 'Client',
    bio: 'Startup Founder & Tech Investor. Seeking high-quality Pakistani developers, UI experts, and animators to fast-track corporate products.',
    skills: ['Entrepreneurship', 'Product Strategy', 'Venture Capital'],
    city: 'Lahore',
    country: 'Pakistan',
    rating: 4.6,
    completedJobs: 5,
    badge: 'Business',
    subscription: 'VIP',
    coins: 9400,
    portfolio: [],
    experiences: []
  },
  {
    id: 'user_admin',
    username: 'admin',
    name: 'Administrator',
    email: 'admin@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600',
    role: 'Admin',
    bio: 'Global MatchGig Platform Admin Panel. Monitoring coin supply minting, escrow conversions, and withdraw approval.',
    skills: ['Management'],
    city: 'Lahore',
    country: 'Pakistan',
    rating: 5.0,
    completedJobs: 0,
    badge: 'Verified',
    subscription: 'VIP',
    coins: 100000,
    portfolio: [],
    experiences: []
  }
];

export const INITIAL_GIGS: Gig[] = [
  {
    id: 'gig_1',
    title: 'I will design premium mobile App UI/UX and Interactive Prototype',
    description: 'Get a modern, visual iOS/Android app design in Figma with clickable prototyping, wireframes, and responsive layout designs tailored to your corporate goals.',
    price: 150,
    creatorId: 'user_1',
    category: 'UI/UX Design',
    rating: 4.9,
    deliveryTime: 3,
    revisions: 3,
    reviewsCount: 18,
    portfolioImages: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500']
  },
  {
    id: 'gig_2',
    title: 'I will create cohesive Brand Identity & Logo Suite',
    description: 'Modern, minimal corporate brand guides, typography sheets, primary logotypes, and design systems in Figma and Illustrator for startups.',
    price: 100,
    creatorId: 'user_1',
    category: 'Logo Design',
    rating: 4.8,
    deliveryTime: 2,
    revisions: 2,
    reviewsCount: 12,
    portfolioImages: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500']
  },
  {
    id: 'gig_3',
    title: 'I will create professional After Effects Explainer Video',
    description: 'Custom 2D character-led explainer videos, dynamic text overlays, visual charts, and clean, eye-safe professional motions with licensed audio syncing.',
    price: 250,
    creatorId: 'user_2',
    category: 'Video Editing',
    rating: 4.8,
    deliveryTime: 5,
    revisions: 4,
    reviewsCount: 24,
    portfolioImages: ['https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=500']
  },
  {
    id: 'gig_4',
    title: 'I will program complete React SaaS website from scratch',
    description: 'Fully typed responsive React application integrated with Tailwind CSS, custom API proxy routes, high-speed Vite bundles, and database configurations.',
    price: 400,
    creatorId: 'user_3',
    category: 'Programming',
    rating: 5.0,
    deliveryTime: 7,
    revisions: 5,
    reviewsCount: 9,
    portfolioImages: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500']
  }
];
