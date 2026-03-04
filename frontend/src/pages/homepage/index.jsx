import { EnergyCarousel } from '@/components/carousel'
import Hero from '@/components/hero/Hero'
import NewsListMainpage from '@/components/newsListMainpage'
import { motion } from 'framer-motion'
import {
	Award,
	Briefcase,
	GraduationCap,
	Lightbulb,
	Microscope,
	Trophy,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const CATEGORIES = [
	{
		key: 'jobs',
		href: '/jobs',
		Icon: Briefcase,
		color: 'from-blue-500 to-blue-700',
		bg: 'bg-blue-50 dark:bg-blue-950/40',
		border: 'border-blue-100 dark:border-blue-800/40',
	},
	{
		key: 'internships',
		href: '/internships',
		Icon: GraduationCap,
		color: 'from-emerald-500 to-emerald-700',
		bg: 'bg-emerald-50 dark:bg-emerald-950/40',
		border: 'border-emerald-100 dark:border-emerald-800/40',
	},
	{
		key: 'scholarships',
		href: '/scholarships',
		Icon: Award,
		color: 'from-purple-500 to-purple-700',
		bg: 'bg-purple-50 dark:bg-purple-950/40',
		border: 'border-purple-100 dark:border-purple-800/40',
	},
	{
		key: 'competitions',
		href: '/competitions',
		Icon: Trophy,
		color: 'from-orange-500 to-orange-700',
		bg: 'bg-orange-50 dark:bg-orange-950/40',
		border: 'border-orange-100 dark:border-orange-800/40',
	},
	{
		key: 'innovations',
		href: '/innovations',
		Icon: Lightbulb,
		color: 'from-cyan-500 to-cyan-700',
		bg: 'bg-cyan-50 dark:bg-cyan-950/40',
		border: 'border-cyan-100 dark:border-cyan-800/40',
	},
	{
		key: 'research',
		href: '/research',
		Icon: Microscope,
		color: 'from-pink-500 to-pink-700',
		bg: 'bg-pink-50 dark:bg-pink-950/40',
		border: 'border-pink-100 dark:border-pink-800/40',
	},
]

function QuickLinks() {
	const { t } = useTranslation()

	// Use short menu labels that already exist in translations
	const labelKey = {
		jobs: 'menu.sub.jobs',
		internships: 'menu.sub.internship',
		scholarships: 'menu.sub.scholarships',
		competitions: 'menu.sub.competitions',
		innovations: 'menu.sub.innovations',
		research: 'menu.sub.research',
	}

	return (
		<section aria-labelledby='categories-title'>
			<h2
				id='categories-title'
				className='text-2xl md:text-3xl font-bold text-center mb-10 text-[var(--navy-blue)]'
			>
				{t('homepage.explore')}
			</h2>
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
				{CATEGORIES.map((cat, i) => (
					<motion.div
						key={cat.href}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: i * 0.06 }}
					>
						<Link
							to={cat.href}
							className={`flex flex-col items-center gap-3 p-5 rounded-2xl ${cat.bg} border ${cat.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
						>
							<div
								className={`w-12 h-12 rounded-xl bg-linear-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
							>
								<cat.Icon className='text-white' size={22} />
							</div>
							<span className='text-xs font-semibold text-center text-[var(--navy-blue)] dark:text-white leading-tight line-clamp-2'>
								{t(labelKey[cat.key])}
							</span>
						</Link>
					</motion.div>
				))}
			</div>
		</section>
	)
}

export function HomePage() {
	return (
		<div className='relative'>
			{/* Full-bleed background for hero */}
			<div className='absolute w-full h-[90vh] -z-10 overflow-hidden'>
				<img
					src='/youth_background.jpeg'
					className='w-full h-full object-cover'
					alt=''
					aria-hidden='true'
				/>
				<div className='absolute inset-0 bg-slate-800/60 mix-blend-multiply' />
				<div className='absolute inset-0 bg-linear-to-b from-transparent via-background/10 to-background' />
			</div>

			<Hero />

			<div className='container mx-auto px-4 space-y-20 pb-20'>
				<QuickLinks />
				<NewsListMainpage />
				<EnergyCarousel />
			</div>
		</div>
	)
}
