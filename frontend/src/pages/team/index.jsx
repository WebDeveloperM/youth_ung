import { useState, useEffect } from 'react'
import { getTeamMembersList } from '@/api/team'
import { motion } from 'framer-motion'
import {
	FaEnvelope,
	FaPhone,
	FaLinkedinIn,
	FaTelegramPlane,
	FaUsers
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function TeamPage() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language
	const [selectedDepartment, setSelectedDepartment] = useState('all')
	const [teamMembers, setTeamMembers] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadTeamMembers()
	}, [])

	const loadTeamMembers = async () => {
		try {
			setLoading(true)
			const response = await getTeamMembersList()
			const members = response.results || response
			
			// Transform backend data to frontend format
			const transformedMembers = members.map(member => {
				// Ensure photo URL is absolute
				let photoUrl = member.photo || '/images/default-avatar.jpg'
				if (photoUrl && !photoUrl.startsWith('http') && !photoUrl.startsWith('/')) {
					photoUrl = `http://localhost:8000${photoUrl}`
				} else if (photoUrl && photoUrl.startsWith('/uploads/')) {
					photoUrl = `http://localhost:8000${photoUrl}`
				}
				
				console.log('📸 Rasm URL:', photoUrl)
				
				return {
					id: member.id,
					name: {
						uz: member.name_uz,
						ru: member.name_ru,
						en: member.name_en,
					},
					position: {
						uz: member.position_uz,
						ru: member.position_ru,
						en: member.position_en,
					},
					bio: {
						uz: member.bio_uz,
						ru: member.bio_ru,
						en: member.bio_en,
					},
					photo: photoUrl,
					email: member.email,
					phone: member.phone,
					social: {
						linkedin: member.linkedin || '',
						telegram: member.telegram || '',
					},
					order: member.order,
					is_active: member.is_active,
				}
			})
			
			setTeamMembers(transformedMembers)
			console.log('✅ Jamoa a\'zolari yuklandi:', transformedMembers.length)
		} catch (error) {
			console.error('❌ Ошибка загрузки команды:', error)
			setTeamMembers([])
		} finally {
			setLoading(false)
		}
	}

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
		}
		return icons[platform] || null
	}

	const getAllMembers = () => {
		return teamMembers
	}

	const getFilteredMembers = () => {
		// For now, return all members since we don't have department filtering in backend
		// TODO: Add department field to backend model if needed
		return teamMembers
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
					{loading ? (
						<div className='flex justify-center items-center py-20'>
							<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600'></div>
						</div>
					) : teamMembers.length === 0 ? (
						<div className='text-center py-20'>
							<FaUsers className='mx-auto text-6xl text-gray-300 mb-4' />
							<h3 className='text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2'>
								{t('team.noMembers') || 'Ҳозирча жамоа аъзолари йўқ'}
							</h3>
							<p className='text-gray-500'>{t('team.checkBackLater') || 'Кейинроқ текширинг'}</p>
						</div>
					) : (
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
										src={member.photo || '/images/default-avatar.jpg'}
										alt={member.name[currentLang]}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
										onError={(e) => {
											e.target.src = '/images/default-avatar.jpg'
										}}
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
									
									{/* Social Links Overlay */}
									<div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
										{member.social &&
											Object.entries(member.social)
												.filter(([platform, url]) => url && url.trim() !== '')
												.map(([platform, url]) => (
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
									{member.bio && member.bio[currentLang] && (
										<p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
											{member.bio[currentLang]}
										</p>
									)}

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
					)}
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

