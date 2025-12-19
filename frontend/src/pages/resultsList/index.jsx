import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaCalendarAlt, FaTrophy, FaCheckCircle, FaLeaf, FaFlask, FaRocket, FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getResultsList } from '@/api/results'

export default function ResultsList() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language
	const [results, setResults] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadResults = async () => {
			try {
				const data = await getResultsList({ is_published: true })
				setResults(data || [])
			} catch (error) {
				console.error('Error loading results:', error)
			} finally {
				setLoading(false)
			}
		}
		loadResults()
	}, [])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		)
	}

	const getCategoryIcon = (category) => {
		switch (category) {
			case 'project':
				return <FaRocket className="text-purple-500" />
			case 'program':
				return <FaUsers className="text-blue-500" />
			case 'research':
				return <FaFlask className="text-green-500" />
			case 'ecology':
				return <FaLeaf className="text-emerald-500" />
			default:
				return <FaChartLine className="text-gray-500" />
		}
	}

	return (
		<div className='w-full overflow-hidden relative z-0'>
			<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className='relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 text-white py-12 md:py-20 px-4 md:px-12'>
				<div className='absolute inset-0 bg-[url("/images/ung1.png")] bg-cover bg-center opacity-10 pointer-events-none' />
				<div className='container mx-auto relative'>
					<motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className='max-w-4xl mx-auto text-center'>
						<div className='flex justify-center mb-4 md:mb-6'>
							<div className='bg-white/20 backdrop-blur-lg p-4 md:p-5 rounded-full'>
								<FaChartLine className='text-4xl md:text-5xl' />
							</div>
						</div>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>{t('results.title')}</h1>
						<p className='text-base sm:text-lg md:text-xl text-purple-100 px-2'>{t('results.description')}</p>
					</motion.div>
				</div>
			</motion.section>

			<section className='py-10 md:py-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-900'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-indigo-600 mb-2'>{results.filter(r => r.status === 'completed').length}</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('results.completedCount')}</div>
						</motion.div>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-purple-600 mb-2'>{results.length * 100}+</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('results.totalImpact')}</div>
						</motion.div>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-pink-600 mb-2'>{results.length}</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('results.totalResults')}</div>
						</motion.div>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-cyan-600 mb-2'>2024</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('results.currentYear')}</div>
						</motion.div>
					</div>
				</div>
			</section>

			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto max-w-7xl'>
					<div className='grid gap-6 md:gap-8'>
						{results.map((item, index) => (
							<motion.article key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }} className='group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
								<div className='md:flex'>
									<div className='md:w-2/5 relative h-48 md:h-auto overflow-hidden'>
										<motion.img src={item.image} alt={item[`title_${currentLang}`] || item.title_ru} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
										<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
										<div className='absolute top-4 left-4'>
											<span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
												<FaCheckCircle size={14} />
												{t(`results.status.${item.status}`)}
											</span>
										</div>
										<div className='absolute bottom-4 right-4'>
											<span className='inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200'>
												{getCategoryIcon(item.category)}
												{t(`results.category.${item.category}`)}
											</span>
										</div>
									</div>
									<div className='md:w-3/5 p-5 md:p-8 flex flex-col justify-between'>
										<div>
											<div className='flex items-center gap-2 mb-2'>
												<FaCalendarAlt className='text-gray-400' size={16} />
												<span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>{item.year} {t('results.year')}</span>
											</div>
											<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>{item[`title_${currentLang}`] || item.title_ru}</h2>
											<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 line-clamp-2'>{item[`short_description_${currentLang}`] || item.short_description_ru}</p>
											
											{/* Metrics */}
											{item.metrics && (
												<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6'>
													{item.metrics.split(',').slice(0, 4).map((metric, idx) => (
														<div key={idx} className='text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg'>
															<div className='text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-1'>{metric.trim()}</div>
														</div>
													))}
												</div>
											)}

											{/* Achievements */}
											{item.achievements && (
												<div className='mb-4'>
													<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2'>
														<FaTrophy className='text-yellow-500' />
														{t('results.achievements')}
													</h3>
													<ul className='space-y-1'>
														{item.achievements.split(',').slice(0, 3).map((achievement, idx) => (
															<li key={idx} className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2'>
																<FaCheckCircle className='text-green-500 mt-0.5 flex-shrink-0' size={12} />
																<span>{achievement.trim()}</span>
															</li>
														))}
													</ul>
												</div>
											)}
										</div>
										<div className='flex flex-col sm:flex-row gap-3'>
											<Link to={`/results/${item.id}`} className='flex-1 text-center px-5 py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base'>
												{t('results.viewDetails')} →
											</Link>
										</div>
									</div>
								</div>
							</motion.article>
						))}
					</div>
				</div>
			</section>

			<motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='py-12 md:py-16 px-4 md:px-12 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 text-white'>
				<div className='container mx-auto max-w-4xl text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6'>{t('results.cta.title')}</h2>
					<p className='text-base sm:text-lg md:text-xl text-purple-100 mb-6 md:mb-8 px-4'>{t('results.cta.description')}</p>
					<Link to='/about' className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'>
						{t('results.cta.button')} →
					</Link>
				</div>
			</motion.section>
		</div>
	)
}

