import { getJobsList } from '@/api/jobs'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	FaBriefcase,
	FaCheckCircle,
	FaClock,
	FaMapMarkerAlt,
	FaMoneyBillWave,
	FaUsers,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function JobsList() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language
	const [jobs, setJobs] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadJobs()
	}, [])

	const loadJobs = async () => {
		try {
			setLoading(true)
			const response = await getJobsList({ status: 'active' })
			const jobsData = response.results || response

			// Transform backend data to frontend format
			const transformedJobs = jobsData.map(job => ({
				id: job.id,
				title: {
					uz: job.title_uz,
					ru: job.title_ru,
					en: job.title_en,
				},
				shortDescription: {
					uz: job.short_description_uz,
					ru: job.short_description_ru,
					en: job.short_description_en,
				},
				content: {
					uz: job.content_uz,
					ru: job.content_ru,
					en: job.content_en,
				},
				image: job.image || '/images/default-job.jpg',
				salary: job.salary,
				location: job.location,
				type: job.type,
				experience: job.experience,
				deadline: job.deadline,
				category: job.category,
				employment_type: job.employment_type,
				status: job.status,
				applicants: job.applicants || 0,
				positions: job.positions || 1,
			}))

			setJobs(transformedJobs)
			console.log('✅ Вакансиялар юкланди:', transformedJobs.length)
		} catch (error) {
			console.error('❌ Ошибка загрузки вакансий:', error)
			setJobs([])
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='w-full overflow-hidden relative z-0'>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className='relative bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white py-12 md:py-20 px-4 md:px-12'
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
								<FaBriefcase className='text-4xl md:text-5xl' />
							</div>
						</div>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>
							{t('jobs.title')}
						</h1>
						<p className='text-base sm:text-lg md:text-xl text-blue-100 px-2'>
							{t('jobs.description')}
						</p>
					</motion.div>
				</div>
			</motion.section>

			<section className='py-10 md:py-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-900'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-blue-600 mb-2'>
								{jobs.filter(j => j.status === 'active').length}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('jobs.activeCount')}
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-green-600 mb-2'>
								{jobs.reduce((sum, j) => sum + j.applicants, 0)}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('jobs.totalApplicants')}
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-purple-600 mb-2'>
								{jobs.reduce((sum, j) => sum + j.positions, 0)}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('jobs.totalPositions')}
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'
						>
							<div className='text-3xl sm:text-4xl font-bold text-orange-600 mb-2'>
								{jobs.length}
							</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
								{t('jobs.totalJobs')}
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto max-w-7xl'>
					{loading ? (
						<div className='flex justify-center items-center py-20'>
							<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600'></div>
						</div>
					) : jobs.length === 0 ? (
						<div className='text-center py-20'>
							<FaBriefcase className='mx-auto text-6xl text-gray-300 mb-4' />
							<h3 className='text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2'>
								{t('jobs.noJobsAvailable') || 'Ҳозирча вакансиялар йўқ'}
							</h3>
							<p className='text-gray-500'>
								{t('jobs.checkBackLater') || 'Кейинроқ текширинг'}
							</p>
						</div>
					) : (
						<div className='grid gap-6 md:gap-8'>
							{jobs.map((job, index) => (
								<motion.article
									key={job.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1, duration: 0.5 }}
									className='group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'
								>
									<div className='md:flex'>
										<div className='md:w-2/5 relative h-48 md:h-auto overflow-hidden'>
											<motion.img
												src={job.image}
												alt={job.title[currentLang]}
												className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
											/>
											<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
											<div className='absolute top-4 left-4'>
												<span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
													<FaCheckCircle /> {t(`jobs.status.${job.status}`)}
												</span>
											</div>
											<div className='absolute bottom-4 right-4'>
												<span className='inline-block px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200'>
													{t(`jobs.category.${job.category}`)}
												</span>
											</div>
										</div>
										<div className='md:w-3/5 p-5 md:p-8 flex flex-col justify-between'>
											<div>
												<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
													{job.title[currentLang]}
												</h2>
												<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 line-clamp-2'>
													{job.shortDescription[currentLang]}
												</p>
												<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6'>
													<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
														<FaMoneyBillWave className='text-green-500 flex-shrink-0' />
														<div>
															<span className='font-semibold block text-gray-800 dark:text-gray-200'>
																{t('jobs.salary')}
															</span>
															{job.salary}
														</div>
													</div>
													<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
														<FaMapMarkerAlt className='text-red-500 flex-shrink-0' />
														<div>
															<span className='font-semibold block text-gray-800 dark:text-gray-200'>
																{t('jobs.location')}
															</span>
															{job.location}
														</div>
													</div>
													<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
														<FaClock className='text-blue-500 flex-shrink-0' />
														<div>
															<span className='font-semibold block text-gray-800 dark:text-gray-200'>
																{t('jobs.experience')}
															</span>
															{job.experience}
														</div>
													</div>
													<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
														<FaUsers className='text-purple-500 flex-shrink-0' />
														<div>
															<span className='font-semibold block text-gray-800 dark:text-gray-200'>
																{t('jobs.positions')}
															</span>
															{job.positions} {t('jobs.positionsAvailable')}
														</div>
													</div>
												</div>
											</div>
											<div className='flex flex-col sm:flex-row gap-3'>
												<Link
													to={`/jobs/${job.id}`}
													className='flex-1 text-center px-5 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base'
												>
													{t('jobs.viewDetails')} →
												</Link>
												{job.status === 'active' && (
													<button className='flex-1 px-5 py-2.5 md:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md text-sm sm:text-base'>
														{t('jobs.apply')}
													</button>
												)}
											</div>
										</div>
									</div>
								</motion.article>
							))}
						</div>
					)}
				</div>
			</section>

			<motion.section
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className='py-12 md:py-16 px-4 md:px-12 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white'
			>
				<div className='container mx-auto max-w-4xl text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6'>
						{t('jobs.cta.title')}
					</h2>
					<p className='text-base sm:text-lg md:text-xl text-blue-100 mb-6 md:mb-8 px-4'>
						{t('jobs.cta.description')}
					</p>
					<Link
						to='/about'
						className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'
					>
						{t('jobs.cta.button')} →
					</Link>
				</div>
			</motion.section>
		</div>
	)
}
