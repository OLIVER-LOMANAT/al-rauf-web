/**
 * Illustrative job openings. Replace with real roles confirmed by the owner.
 * Add a new object to `jobs` to publish a new opening — it appears on /careers
 * and gets its own page at /careers/[slug] automatically.
 */

export type Job = {
  slug: string
  title: string
  department: string
  type: 'Full-time' | 'Part-time'
  location: string
  postedAt: string
  brief: string[]
  responsibilities: string[]
  requirements: string[]
}

export const jobs: Job[] = [
  {
    slug: 'waitress',
    title: 'Waitress',
    department: 'Front of House',
    type: 'Full-time',
    location: 'Al Rauf Restaurant',
    postedAt: '2026-09-28',
    brief: [
      'To take orders and deliver them to our guests, maintaining and enhancing the quality of our customer service. You will work in close collaboration with colleagues and follow established health and safety standards.',
      'The right person has the patience, personality and perseverance to thrive in a busy, guest-focused environment.',
    ],
    responsibilities: [
      'Demonstrate pride in working for Al Rauf and a high level of commitment.',
      'Report for duty as per schedule — clean, tidy and wearing the correct uniform.',
      'Greet guests warmly, present menus and offer recommendations.',
      'Take accurate orders and serve food and drinks promptly.',
      'Attend departmental meetings and training sessions, and operate in line with company standards.',
    ],
    requirements: [
      'Proven restaurant serving or waitressing experience.',
      'Customer-oriented approach and patience.',
      'Problem solving and decision making skills.',
      'Excellent people skills.',
      'Responsible and trustworthy.',
    ],
  },
  {
    slug: 'waiter',
    title: 'Waiter',
    department: 'Front of House',
    type: 'Full-time',
    location: 'Al Rauf Restaurant',
    postedAt: '2026-09-28',
    brief: [
      'To welcome guests, take orders and serve them with warmth and care, keeping the dining room running smoothly through every service.',
    ],
    responsibilities: [
      'Set up and maintain tables before, during and after service.',
      'Take orders accurately and coordinate with the kitchen.',
      'Handle payments and settle bills with care.',
      'Keep the dining area clean and inviting at all times.',
    ],
    requirements: [
      'Previous experience as a waiter in a restaurant or cafe.',
      'Friendly, confident communication with guests.',
      'Ability to work shifts, weekends and holidays.',
      'Good knowledge of food hygiene standards.',
    ],
  },
  {
    slug: 'master-pastry-and-bakery-chef',
    title: 'Master Pastry and Bakery Chef',
    department: 'Kitchen',
    type: 'Full-time',
    location: 'Al Rauf Kitchen',
    postedAt: '2026-08-14',
    brief: [
      'To lead our pastry and bakery section — from morning breads to signature desserts — with consistency, creativity and pride.',
    ],
    responsibilities: [
      'Prepare breads, pastries and desserts to recipe and presentation standards.',
      'Develop new seasonal items together with the head chef.',
      'Manage stock, ordering and food cost for the section.',
      'Train and supervise junior pastry staff.',
      'Maintain strict hygiene and food safety standards.',
    ],
    requirements: [
      'Minimum 5 years of experience as a pastry or bakery chef.',
      'Strong knowledge of traditional breads and Middle Eastern sweets.',
      'Culinary qualification is an advantage.',
      'Leadership and organisational skills.',
    ],
  },
  {
    slug: 'barista',
    title: 'Barista',
    department: 'Cafe',
    type: 'Part-time',
    location: 'Al Rauf Cafe',
    postedAt: '2026-10-06',
    brief: [
      'To prepare and serve coffee and tea with skill and hospitality, making every cup a reason for guests to stay a little longer.',
    ],
    responsibilities: [
      'Prepare espresso drinks, Arabic coffee and teas to recipe.',
      'Maintain and clean coffee equipment daily.',
      'Keep the bar stocked, tidy and welcoming.',
      'Engage guests and share knowledge about our drinks.',
    ],
    requirements: [
      'Barista experience, including milk texturing.',
      'Passion for coffee and hospitality.',
      'Attention to detail and cleanliness.',
      'Able to work early mornings and weekends.',
    ],
  },
  {
    slug: 'sales-and-marketing-manager',
    title: 'Sales and Marketing Manager',
    department: 'Management',
    type: 'Full-time',
    location: 'Al Rauf Office',
    postedAt: '2026-07-02',
    brief: [
      'To grow the Al Rauf brand, bring new guests through the door and build lasting relationships with our community and partners.',
    ],
    responsibilities: [
      'Plan and run marketing campaigns across social media and local channels.',
      'Develop catering, events and corporate partnerships.',
      'Track performance and report on results.',
      'Work with the team to keep our story and brand consistent.',
    ],
    requirements: [
      'Proven experience in hospitality or F&B sales and marketing.',
      'Strong communication and negotiation skills.',
      'Comfortable with social media and digital tools.',
      'Arabic and English language skills are an advantage.',
    ],
  },
  {
    slug: 'cleaner',
    title: 'Cleaner',
    department: 'Operations',
    type: 'Full-time',
    location: 'Al Rauf Restaurant',
    postedAt: '2026-06-18',
    brief: ['To keep our restaurant, kitchen and guest areas spotless, safe and welcoming throughout the day.'],
    responsibilities: [
      'Clean dining areas, restrooms and back-of-house spaces.',
      'Follow cleaning schedules and checklists.',
      'Safely handle and store cleaning chemicals.',
      'Report maintenance issues promptly.',
    ],
    requirements: [
      'Previous cleaning experience is preferred.',
      'Reliable, punctual and hardworking.',
      'Good knowledge of hygiene standards.',
      'Able to stand and move for long periods.',
    ],
  },
]

export function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug)
}

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function postedAgo(isoDate: string, now = new Date()) {
  const days = Math.round((now.getTime() - new Date(isoDate).getTime()) / 86_400_000)
  if (days < 1) return 'Posted today'
  if (days < 30) return `Posted ${relativeTime.format(-days, 'day')}`
  if (days < 365) return `Posted ${relativeTime.format(-Math.round(days / 30), 'month')}`
  return `Posted ${relativeTime.format(-Math.round(days / 365), 'year')}`
}
