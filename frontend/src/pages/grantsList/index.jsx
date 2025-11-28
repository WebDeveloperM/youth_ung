import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaDollarSign, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getGrantsList } from '@/api/grants'

export default function GrantsList() {
	const { t, i18n } = useTranslation()
	const [grants, setGrants] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadGrants()
	}, [])

	const loadGrants = async () => {
		try {
			setLoading(true)
			const data = await getGrantsList()
			setGrants(data)
		} catch (error) {
			console.error('Ошибка загрузки грантов:', error)
		} finally {
			setLoading(false)
		}
	}

	// Получаем поля в зависимости от языка (нормализация!)
	const getTitle = (grant) => {
		const lang = i18n.language.split('-')[0].toLowerCase()
		return grant[`title_${lang}`] || grant.title_ru || grant.title_en || ''
	}

	const getShortDescription = (grant) => {
		const lang = i18n.language.split('-')[0].toLowerCase()
		return grant[`short_description_${lang}`] || grant.short_description_ru || grant.short_description_en || ''
	}

	if (loading) {
		return (
			<div className='w-full overflow-hidden relative z-0'>
				<div className='text-center py-20'>
					<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0078c2]'></div>
				</div>
			</div>
		)
	}

	const getStatusIcon = status => {
		return status === 'active' ? (
			<FaCheckCircle className='text-green-500' />
		) : (
			<FaTimesCircle className='text-red-500' />
		)
	}

	const getStatusBadge = status => {
		return status === 'active'
			? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
			: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
	}

	return (
		<div className='w-full overflow-hidden relative z-0'>
			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className='relative bg-gradient-to-br from-green-900 via-emerald-700 to-teal-900 text-white py-12 md:py-20 px-4 md:px-12'
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
								<FaDollarSign className='text-4xl md:text-5xl' />
							</div>
						</div>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>
							{t('grants.title')}
						</h1>
						<p className='text-base sm:text-lg md:text-xl text-green-100 px-2'>
							{t('grants.description')}
						</p>
					</motion.div>
				</div>
			</motion.section>

			{/* Stats Section */}
			<section className='py-10 md:py-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-900'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'
					>
						<div className='text-3xl sm:text-4xl font-bold text-green-600 mb-2'>
							{grants.filter(g => g.status === 'active').length}
						</div>
						<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
							{t('grants.activeCount')}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'
					>
						<div className='text-3xl sm:text-4xl font-bold text-blue-600 mb-2'>
							{grants.reduce((sum, g) => sum + (g.applicants || 0), 0)}
						</div>
						<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
							{t('grants.totalApplicants')}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md col-span-2 md:col-span-1'
					>
						<div className='text-3xl sm:text-4xl font-bold text-purple-600 mb-2'>
							{grants.length}
						</div>
						<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('grants.totalGrants')}
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Grants List */}
			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto max-w-7xl'>
					<div className='grid gap-6 md:gap-8'>
						{grants.map((grant, index) => {
							const title = getTitle(grant)
							const shortDesc = getShortDescription(grant)
							
							return (
							<motion.article
								key={grant.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className='group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'
							>
								<div className='md:flex'>
									{/* Image */}
									<div className='md:w-2/5 relative h-48 md:h-auto overflow-hidden bg-gray-200'>
										{grant.image ? (
											<motion.img
												src={grant.image}
												alt={title}
												className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200'>
												<span className='text-6xl text-green-400'>💰</span>
											</div>
										)}
										<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

										{/* Status Badge */}
										<div className='absolute top-4 left-4'>
											<span
												className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getStatusBadge(
													grant.status
												)}`}
											>
												{getStatusIcon(grant.status)}
												{t(`grants.status.${grant.status}`)}
											</span>
										</div>

										{/* Category Badge */}
										<div className='absolute bottom-4 right-4'>
											<span className='inline-block px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200'>
												{t(`grants.category.${grant.category}`)}
											</span>
										</div>
									</div>

									{/* Content */}
									<div className='md:w-3/5 p-5 md:p-8 flex flex-col justify-between'>
										<div>
											<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
												{title}
											</h2>
											<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 line-clamp-2'>
												{shortDesc}
											</p>

											{/* Info Grid */}
											<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6'>
												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaDollarSign className='text-green-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('grants.amount')}
														</span>
														{grant.amount}
													</div>
												</div>

												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaClock className='text-blue-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('grants.duration')}
														</span>
														{grant.duration}
													</div>
												</div>

												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaCalendarAlt className='text-red-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('grants.deadline')}
														</span>
														{grant.deadline}
													</div>
												</div>

												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaUsers className='text-purple-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>
															{t('grants.applicants')}
														</span>
														{grant.applicants} {t('grants.people')}
													</div>
												</div>
											</div>
										</div>

										{/* Action Button */}
										<div className='flex flex-col sm:flex-row gap-3'>
											<Link
												to={`/grants/${grant.id}`}
												className='flex-1 text-center px-5 py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base'
											>
												{t('grants.viewDetails')} →
											</Link>
											{grant.status === 'active' && (
												<button className='flex-1 px-5 py-2.5 md:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base'>
													{t('grants.apply')}
												</button>
											)}
										</div>
									</div>
								</div>
							</motion.article>
							)
						})}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className='py-12 md:py-16 px-4 md:px-12 bg-gradient-to-br from-green-900 via-emerald-700 to-teal-900 text-white'
			>
				<div className='container mx-auto max-w-4xl text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6'>
						{t('grants.cta.title')}
					</h2>
					<p className='text-base sm:text-lg md:text-xl text-green-100 mb-6 md:mb-8 px-4'>
						{t('grants.cta.description')}
					</p>
					<Link
						to='/login'
						className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'
					>
						{t('grants.cta.button')} →
					</Link>
				</div>
			</motion.section>
		</div>
	)
}

