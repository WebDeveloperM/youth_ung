import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	FaCalendarAlt,
	FaClock,
	FaTrophy,
	FaUsers,
	FaCheckCircle,
	FaHourglassHalf,
	FaTimesCircle
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCompetitionsList } from '@/api/competitions'

export default function CompetitionsList() {
	const { t, i18n } = useTranslation()
	const [competitions, setCompetitions] = useState([])
	const [loading, setLoading] = useState(true)

	// Нормализуем язык (uz-UZ -> uz)
	const currentLang = i18n.language.split('-')[0]

	// Загружаем конкурсы с API
	useEffect(() => {
		const loadCompetitions = async () => {
			try {
				setLoading(true)
				const data = await getCompetitionsList()
				setCompetitions(Array.isArray(data) ? data : [])
			} catch (error) {
				console.error('Ошибка загрузки конкурсов:', error)
				setCompetitions([])
			} finally {
				setLoading(false)
			}
		}

		loadCompetitions()
	}, [])

	// Функция для получения заголовка на текущем языке
	const getTitle = (competition) => {
		return competition[`title_${currentLang}`] || competition.title_ru || competition.title_uz || competition.title_en || ''
	}

	// Функция для получения краткого описания на текущем языке
	const getShortDescription = (competition) => {
		return competition[`short_description_${currentLang}`] || competition.short_description_ru || competition.short_description_uz || competition.short_description_en || ''
	}

	// Сортировка: активные, предстоящие, завершенные
	const sortedCompetitions = [...competitions].sort((a, b) => {
		const statusOrder = { active: 0, upcoming: 1, closed: 2 }
		return statusOrder[a.status] - statusOrder[b.status]
	})

	if (loading) {
		return (
			<div className='w-full min-h-screen flex items-center justify-center'>
				<div className='text-xl'>Загрузка...</div>
			</div>
		)
	}

	const getStatusIcon = status => {
		switch (status) {
			case 'active':
				return <FaCheckCircle className='text-green-500' />
			case 'upcoming':
				return <FaHourglassHalf className='text-yellow-500' />
			case 'closed':
				return <FaTimesCircle className='text-red-500' />
			default:
				return null
		}
	}

	const getStatusBadge = status => {
		const badges = {
			active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			closed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
		}
		return badges[status] || ''
	}

	return (
		<div className='w-full overflow-hidden relative z-0'>
			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className='relative bg-gradient-to-br from-purple-900 via-indigo-700 to-blue-900 text-white py-12 md:py-20 px-4 md:px-12'
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
								<FaTrophy className='text-4xl md:text-5xl text-yellow-300' />
							</div>
						</div>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>
							{t('competitions.title')}
						</h1>
						<p className='text-base sm:text-lg md:text-xl text-blue-100 px-2'>
							{t('competitions.description')}
						</p>
					</motion.div>
				</div>
			</motion.section>

			{/* Stats Section */}
			<section className='py-10 md:py-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-900'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='text-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-green-600 mb-2'>
								{competitions.filter(c => c.status === 'active').length}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('competitions.activeCount')}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className='text-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-yellow-600 mb-2'>
								{competitions.filter(c => c.status === 'upcoming').length}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('competitions.upcomingCount')}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className='text-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-blue-600 mb-2'>
								{competitions.reduce((sum, c) => sum + c.participants, 0)}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('competitions.totalParticipants')}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className='text-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-purple-600 mb-2'>
								{competitions.length}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('competitions.totalCompetitions')}
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Competitions List */}
			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto max-w-7xl'>
					<div className='grid gap-6 md:gap-8'>
						{sortedCompetitions.map((competition, index) => (
							<motion.article
								key={competition.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className='group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'
							>
								<div className='md:flex'>
									{/* Image */}
									<div className='md:w-2/5 relative h-48 md:h-auto overflow-hidden'>
										<motion.img
											src={competition.image || '/images/placeholder.jpg'}
											alt={getTitle(competition)}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
										/>
										<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
										
										{/* Status Badge */}
										<div className='absolute top-4 left-4'>
											<span
												className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getStatusBadge(
													competition.status
												)}`}
											>
												{getStatusIcon(competition.status)}
												{t(`competitions.status.${competition.status}`)}
											</span>
										</div>

										{/* Category Badge */}
										<div className='absolute bottom-4 right-4'>
											<span className='inline-block px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200'>
												{t(`competitions.category.${competition.category}`)}
											</span>
										</div>
									</div>

									{/* Content */}
									<div className='md:w-3/5 p-5 md:p-8 flex flex-col justify-between'>
										<div>
											<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
												{getTitle(competition)}
											</h2>
											<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 line-clamp-2'>
												{getShortDescription(competition)}
											</p>

											{/* Info Grid */}
											<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6'>
												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaCalendarAlt className='text-blue-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('competitions.startDate')}
														</span>
														{competition.start_date}
													</div>
												</div>

												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaClock className='text-red-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('competitions.deadline')}
														</span>
														{competition.registration_deadline}
													</div>
												</div>

												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaUsers className='text-purple-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('competitions.participants')}
														</span>
														{competition.participants} {t('competitions.people')}
													</div>
												</div>

												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaTrophy className='text-yellow-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('competitions.prize')}
														</span>
														{competition.prize}
													</div>
												</div>
											</div>
										</div>

										{/* Action Button */}
										<div className='flex flex-col sm:flex-row gap-3'>
											<Link
												to={`/competitions/${competition.id}`}
												className='flex-1 text-center px-5 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base'
											>
												{t('competitions.viewDetails')} →
											</Link>
											{competition.status !== 'closed' && (
												<button className='flex-1 px-5 py-2.5 md:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md text-sm sm:text-base'>
													{t('competitions.register')}
												</button>
											)}
										</div>
									</div>
								</div>
							</motion.article>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className='py-12 md:py-16 px-4 md:px-12 bg-gradient-to-br from-purple-900 via-indigo-700 to-blue-900 text-white'
			>
				<div className='container mx-auto max-w-4xl text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6'>
						{t('competitions.cta.title')}
					</h2>
					<p className='text-base sm:text-lg md:text-xl text-blue-100 mb-6 md:mb-8 px-4'>
						{t('competitions.cta.description')}
					</p>
					<Link
						to='/login'
						className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'
					>
						{t('competitions.cta.button')} →
					</Link>
				</div>
			</motion.section>
		</div>
	)
}

