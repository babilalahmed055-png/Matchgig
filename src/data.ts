/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Gig, Gift } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    username: 'designer_fatima',
    name: 'Fatima Malik',
    email: 'fatima@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600',
    role: 'Freelancer',
    bio: 'Expert Brand Identity & Logo Designer. I create modern visual systems that engage audiences and build brands.',
    skills: ['Logo Design', 'UI/UX Design', 'Brand Identity', 'Adobe Illustrator'],
    city: 'Lahore',
    country: 'Pakistan',
    coins: 4500,
    rating: 4.9,
    completedJobs: 142,
    badge: 'Creator',
    subscription: 'VIP',
    experiences: [
      { role: 'Senior UX Designer', company: 'Creative Studio Ltd', duration: '2023 - Present' },
      { role: 'Brand consultant', company: 'Digital Catalyst', duration: '2021 - 2023' }
    ],
    portfolio: [
      { id: 'p1', title: 'Urban Clothing Brand Guidelines', imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=400' },
      { id: 'p2', title: 'SaaS Analytics Interface Design', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400' },
      { id: 'p3', title: 'Minimalist Artisan Honey Jar Packaging', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'user_2',
    username: 'editor_hamza',
    name: 'Hamza Siddiqui',
    email: 'hamza@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    role: 'Freelancer',
    bio: 'Professional Cinema Video Editor & Motion Designer. Let us transform your raw camera footage into cinematic gold.',
    skills: ['Video Editing', 'Motion Graphics', 'YouTube Post-Production', 'After Effects'],
    city: 'Karachi',
    country: 'Pakistan',
    coins: 1250,
    rating: 4.8,
    completedJobs: 98,
    badge: 'Verified',
    subscription: 'Pro',
    experiences: [
      { role: 'Lead Video Producer', company: 'Broadwave Media', duration: '2022 - Present' },
      { role: 'Freelance Videographer', company: 'Self Employed', duration: '2019 - 2022' }
    ],
    portfolio: [
      { id: 'ph1', title: 'Luxury Travel Promo (Zion Park)', imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400' },
      { id: 'ph2', title: 'Cyberpunk Explainer Animation', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'user_3',
    username: 'coder_zain',
    name: 'Zain Ali',
    email: 'zain@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=600',
    role: 'Freelancer',
    bio: 'Full-stack developer from Lahore specializing in high-performance web applications using React, Node.js, and TypeScript.',
    skills: ['Programming', 'React', 'NodeJS', 'TypeScript', 'NextJS', 'Tailwind'],
    city: 'Islamabad',
    country: 'Pakistan',
    coins: 520,
    rating: 5.0,
    completedJobs: 56,
    badge: 'Business',
    subscription: 'VIP',
    experiences: [
      { role: 'Senior Software Architect', company: 'DevTech Softwares', duration: '2024 - Present' }
    ],
    portfolio: [
      { id: 'p_z1', title: 'Fintech Mobile Dashboard', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400' },
      { id: 'p_z2', title: 'E-commerce platform build', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'user_4',
    username: 'client_imran',
    name: 'Imran Khan',
    email: 'imran@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=600',
    role: 'Client',
    bio: 'Founder of PeakScale Digital. Actively looking to hire superstars for visual identities, social media management, & web portals.',
    skills: ['Product Launch', 'Hiring Talent', 'Growth Hacking'],
    city: 'Rawalpindi',
    country: 'Pakistan',
    coins: 25000,
    rating: 4.7,
    completedJobs: 0,
    badge: 'Verified',
    subscription: 'VIP',
    experiences: [],
    portfolio: []
  },
  {
    id: 'user_5',
    username: 'regular_usman',
    name: 'Usman Shah',
    email: 'usman@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=600',
    role: 'Regular',
    bio: 'Aspiring multimedia producer. I love supporting underground creators, purchasing coins to appreciate stars, and chatting.',
    skills: ['Graphic Design', 'Figma'],
    city: 'Peshawar',
    country: 'Pakistan',
    coins: 750,
    rating: 0,
    completedJobs: 0,
    badge: 'None',
    subscription: 'Free',
    experiences: [],
    portfolio: []
  },
  {
    id: 'admin_user',
    username: 'admin',
    name: 'Ali Raza',
    email: 'admin@matchgig.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=600',
    role: 'Admin',
    bio: 'System Administrator and Lead Community Moderator at MatchGig. Monitoring gift streams, wallet transactions, and system safety.',
    skills: ['Operations Management', 'Cyber Security'],
    city: 'Multan',
    country: 'Pakistan',
    coins: 999999,
    rating: 5.0,
    completedJobs: 0,
    badge: 'Verified',
    subscription: 'VIP',
    experiences: [],
    portfolio: []
  }
];

export const INITIAL_GIGS: Gig[] = [
  {
    id: 'gig_1',
    creatorId: 'user_1',
    title: 'Modern Retro Brand Identity & Logo system',
    description: 'Looking to set your startup apart? I will formulate a spectacular, cohesive visual guidelines deck and handcraft custom modern minimal vector logos. Packages include editable master source files (.AI, .SVG), typography sheets, and high-fidelity 3D brand mockups.',
    price: 350,
    deliveryTime: 3,
    revisions: 5,
    portfolioImages: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=500'
    ],
    category: 'Logo Design',
    rating: 4.9,
    reviewsCount: 48
  },
  {
    id: 'gig_2',
    creatorId: 'user_1',
    title: 'User Interface / UX Design for Mobile Apps',
    description: 'I will design state-of-the-art UX maps and custom Figma mobile screen sets for your SaaS or delivery applications. Includes interactive component sheets, styling guides, and click-through developer layouts.',
    price: 800,
    deliveryTime: 7,
    revisions: 9,
    portfolioImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500'
    ],
    category: 'UI/UX Design',
    rating: 4.8,
    reviewsCount: 31
  },
  {
    id: 'gig_3',
    creatorId: 'user_2',
    title: 'Professional Cinematic Video Editing for YouTube & Ads',
    description: 'Ready to scale your watch hours and hook your audience? I offer high-intensity vertical short edits, video podcasts, full documentary grading, and custom dynamic title cards. Includes color grading, audio leveling, and select background soundscapes.',
    price: 150,
    deliveryTime: 2,
    revisions: 3,
    portfolioImages: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=500'
    ],
    category: 'Video Editing',
    rating: 4.8,
    reviewsCount: 79
  },
  {
    id: 'gig_4',
    creatorId: 'user_3',
    title: 'Complete SaaS Web Portal build with React & NodeJS',
    description: 'A fully custom, optimized web application tailored exactly to your client needs. Scalable NodeJS server structure, clean React dashboard integration, state-of-the-art UI with Tailwind CSS, and lightweight local or cloud sync database layout.',
    price: 1200,
    deliveryTime: 14,
    revisions: 99,
    portfolioImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500'
    ],
    category: 'Programming',
    rating: 5.0,
    reviewsCount: 22
  }
];

export const VIRTUAL_GIFTS: Gift[] = [
  { id: 'gift_1', name: 'Rose', icon: '🎁', cost: 10, color: 'text-red-500' },
  { id: 'gift_2', name: 'Heart', icon: '❤️', cost: 25, color: 'text-pink-500' },
  { id: 'gift_3', name: 'Star', icon: '⭐', cost: 50, color: 'text-purple-400' },
  { id: 'gift_4', name: 'Crown', icon: '👑', cost: 100, color: 'text-yellow-400 font-bold' },
  { id: 'gift_5', name: 'Diamond', icon: '💎', cost: 500, color: 'text-cyan-400' },
  { id: 'gift_6', name: 'Rocket', icon: '🚀', cost: 1000, color: 'text-amber-500' },
  { id: 'gift_7', name: 'Golden Trophy', icon: '🏆', cost: 5000, color: 'text-yellow-500 animate-pulse' }
];

export const COIN_PACKAGES = [
  { id: 'coin_p1', amount: 100, price: 100, bonus: 0, currency: 'PKR' },
  { id: 'coin_p2', amount: 500, price: 450, bonus: 25, currency: 'PKR' },
  { id: 'coin_p3', amount: 1000, price: 850, bonus: 100, currency: 'PKR' },
  { id: 'coin_p4', amount: 5000, price: 4000, bonus: 750, currency: 'PKR' }
];
