import logo from '/white.png'
import { authAPI } from '@/api/auth'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Users, Briefcase, Lightbulb, UserCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [user, setUser] = useState(() => authAPI.getCurrentUser())

	useEffect(() => {
		const handleAuth = () => setUser(authAPI.getCurrentUser())
		window.addEventListener('auth-changed', handleAuth)
		return () => window.removeEventListener('auth-changed', handleAuth)
	}, [])

	const stats = [
		{ end: 1000, suffix: '+', label: t('hero.activeMembers'), Icon: Users },
		{ end: 10, suffix: '+', label: t('hero.inPractice'), Icon: Briefcase },
		{ end: 100, suffix: '+', label: t('hero.ideas'), Icon: Lightbulb },
	]

	const openAuthModal = () => {
		window.dispatchEvent(new Event('open-auth-modal'))
	}

	return (
		<section
			className='relative min-h-[90vh] flex items-center'
			aria-labelledby='hero-title'
		>
			<div className='container mx-auto px-6 py-24 md:py-32'>
				<div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>

					{/* LEFT: Content */}
					<motion.div
						className='flex-1 text-center lg:text-left'
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, ease: 'easeOut' }}
					>
						{/* Live badge */}
						<motion.div
							className='inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2 text-sm text-white mb-8'
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<span className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
							O&apos;zbekneftgaz Yoshlar Harakati
						</motion.div>

						{/* Headline */}
						<h1
							id='hero-title'
							className='font-[Montserrat] text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6'
						>
							{t('hero.title')}{' '}
							<span className='text-[#00d4ff]'>
								{t('hero.titleHighlight')}
							</span>
						</h1>

						{/* Description */}
						<p className='text-white/75 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0'>
							{t('hero.description')}
						</p>

						{/* CTA buttons */}
						<div className='flex flex-wrap gap-4 justify-center lg:justify-start'>
							{user ? (
								/* Logged in: show profile button */
								<motion.button
									onClick={() => navigate('/profile')}
									className='inline-flex items-center gap-2 bg-[#00A2DE] hover:bg-[#0077B6] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30'
									whileHover={{ scale: 1.03, y: -2 }}
									whileTap={{ scale: 0.97 }}
								>
									<UserCircle size={18} />
									{user.first_name
										? `${user.first_name} ${user.last_name || ''}`.trim()
										: t('userMenu.profile')}
								</motion.button>
							) : (
								/* Not logged in: open auth modal */
								<motion.button
									onClick={openAuthModal}
									className='inline-flex items-center gap-2 bg-[#00A2DE] hover:bg-[#0077B6] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30'
									whileHover={{ scale: 1.03, y: -2 }}
									whileTap={{ scale: 0.97 }}
								>
									{t('login')}
									<ArrowRight size={18} />
								</motion.button>
							)}
							<motion.button
								onClick={() =>
									document
										.getElementById('latest-news')
										?.scrollIntoView({ behavior: 'smooth' })
								}
								className='inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300'
								whileHover={{ scale: 1.03, y: -2 }}
								whileTap={{ scale: 0.97 }}
							>
								{t('news.latestNews')}
							</motion.button>
						</div>
					</motion.div>

					{/* RIGHT: Glass card — logo + stats */}
					<motion.div
						className='w-full lg:w-[500px] shrink-0'
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
					>
						<div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 shadow-2xl'>
							{/* Logo */}
							<div className='flex justify-center mb-10'>
								<img
									src={logo}
									alt="O'zbekneftgaz Yoshlari logotipi"
									className='w-56 h-56 object-contain drop-shadow-lg'
								/>
							</div>

							{/* Stats */}
							<div className='grid grid-cols-3 gap-4'>
								{stats.map((item, idx) => (
									<motion.div
										key={idx}
										className='flex flex-col items-center text-center bg-white/10 hover:bg-white/20 rounded-2xl p-5 transition-colors duration-300'
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 + idx * 0.1 }}
									>
										<item.Icon size={22} className='text-[#00d4ff] mb-2' />
										<span className='block text-2xl font-bold text-white'>
											<CountUp
												end={item.end}
												duration={2.5}
												suffix={item.suffix}
												enableScrollSpy
											/>
										</span>
										<span className='block text-white/60 text-[10px] uppercase tracking-widest mt-1 leading-tight'>
											{item.label}
										</span>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

export default Hero
