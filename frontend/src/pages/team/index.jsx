import { teamData, teamStats } from '@/datatest/teamData'
import { motion } from 'framer-motion'
import {
	FaEnvelope,
	FaPhone,
	FaLinkedinIn,
	FaTelegramPlane,
	FaInstagram,
	FaGithub,
	FaUsers,
	FaBriefcase,
	FaCalendarAlt,
	FaStar
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function TeamPage() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language
	const [selectedDepartment, setSelectedDepartment] = useState('all')

	const departments = [
		{ id: 'all', name: t('team.departments.all') },
		{ id: 'leadership', name: t('team.departments.leadership') },
		{ id: 'innovation', name: t('team.departments.innovation') },
		{ id: 'education', name: t('team.departments.education') },
		{ id: 'media', name: t('team.departments.media') },
		{ id: 'sports', name: t('team.departments.sports') }
	]

	const getSocialIcon = platform => {
		const icons = {
			linkedin: <FaLinkedinIn />,
			telegram: <FaTelegramPlane />,
			instagram: <FaInstagram />,
			github: <FaGithub />
		}
		return icons[platform]
	}

	const getAllMembers = () => {
		return [
			...teamData.leadership,
			...teamData.innovation,
			...teamData.education,
			...teamData.media,
			...teamData.sports
		]
	}

	const getFilteredMembers = () => {
		if (selectedDepartment === 'all') {
			return getAllMembers()
		}
		return teamData[selectedDepartment] || []
	}

	return (
		<div className='w-full overflow-hidden relative z-0'>
			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className='relative bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-900 text-white py-12 md:py-20 px-4 md:px-12'
			>
				<div className='absolute inset-0 bg-[url("/images/ung1.png")] bg-cover bg-center opacity-10 pointer-events-none' />
				<div className='container mx-auto relative'>
					<motion.div
						initial={{ y: 30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className='max-w-4xl mx-auto text-center'
					>
						<div className='flex justify-center mb-4 md:mb-6'>
							<div className='bg-white/20 backdrop-blur-lg p-4 md:p-5 rounded-full'>
								<FaUsers className='text-4xl md:text-5xl' />
							</div>
						</div>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>
							{t('team.title')}
						</h1>
						<p className='text-base sm:text-lg md:text-xl text-blue-100 px-2'>
							{t('team.description')}
						</p>
					</motion.div>
				</div>
			</motion.section>

			{/* Stats Section */}
			<section className='py-10 md:py-16 px-4 md:px-12 bg-white dark:bg-gray-900'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='text-center p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl'
						>
							<FaUsers className='text-3xl md:text-4xl text-blue-600 mx-auto mb-2 md:mb-3' />
							<div className='text-3xl sm:text-4xl font-bold text-blue-600 mb-1'>
								{teamStats.totalMembers}+
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('team.stats.members')}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className='text-center p-4 md:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl'
						>
							<FaBriefcase className='text-3xl md:text-4xl text-purple-600 mx-auto mb-2 md:mb-3' />
							<div className='text-3xl sm:text-4xl font-bold text-purple-600 mb-1'>
								{teamStats.departments}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('team.stats.departments')}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className='text-center p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl'
						>
							<FaCalendarAlt className='text-3xl md:text-4xl text-green-600 mx-auto mb-2 md:mb-3' />
							<div className='text-3xl sm:text-4xl font-bold text-green-600 mb-1'>
								{teamStats.avgAge}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('team.stats.avgAge')}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className='text-center p-4 md:p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-xl'
						>
							<FaStar className='text-3xl md:text-4xl text-orange-600 mx-auto mb-2 md:mb-3' />
							<div className='text-3xl sm:text-4xl font-bold text-orange-600 mb-1'>
								{teamStats.experience}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('team.stats.experience')}
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Department Filter */}
			<section className='py-6 md:py-8 px-4 md:px-12 bg-gray-50 dark:bg-gray-800'>
				<div className='container mx-auto'>
					<div className='flex flex-wrap justify-center gap-2 md:gap-3'>
						{departments.map(dept => (
							<button
								key={dept.id}
								onClick={() => setSelectedDepartment(dept.id)}
								className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
									selectedDepartment === dept.id
										? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
										: 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
							>
								{dept.name}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Team Members */}
			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto'>
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
						{getFilteredMembers().map((member, index) => (
							<motion.div
								key={member.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.05, duration: 0.5 }}
								className='group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'
							>
								{/* Image */}
								<div className='relative h-56 sm:h-64 overflow-hidden'>
									<motion.img
										src={member.image}
										alt={member.name[currentLang]}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
									
									{/* Social Links Overlay */}
									<div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
										{member.social &&
											Object.entries(member.social).map(([platform, url]) => (
												<a
													key={platform}
													href={url}
													target='_blank'
													rel='noopener noreferrer'
													className='bg-white/90 dark:bg-gray-900/90 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors'
													aria-label={platform}
												>
													{getSocialIcon(platform)}
												</a>
											))}
									</div>
								</div>

								{/* Content */}
								<div className='p-5 md:p-6'>
									<h3 className='text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
										{member.name[currentLang]}
									</h3>
									<p className='text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3'>
										{member.position[currentLang]}
									</p>
									<p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
										{member.bio[currentLang]}
									</p>

									{/* Contact Info */}
									<div className='space-y-2'>
										<a
											href={`mailto:${member.email}`}
											className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
										>
											<FaEnvelope className='flex-shrink-0' />
											<span className='truncate'>{member.email}</span>
										</a>
										{member.phone && (
											<a
												href={`tel:${member.phone}`}
												className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
											>
												<FaPhone className='flex-shrink-0' />
												<span>{member.phone}</span>
											</a>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Join Team CTA */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className='py-12 md:py-16 px-4 md:px-12 bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-900 text-white'
			>
				<div className='container mx-auto max-w-4xl text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6'>
						{t('team.cta.title')}
					</h2>
					<p className='text-base sm:text-lg md:text-xl text-blue-100 mb-6 md:mb-8 px-4'>
						{t('team.cta.description')}
					</p>
					<a
						href='mailto:youth@uzbekneftegaz.uz'
						className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'
					>
						{t('team.cta.button')} →
					</a>
				</div>
			</motion.section>
		</div>
	)
}

