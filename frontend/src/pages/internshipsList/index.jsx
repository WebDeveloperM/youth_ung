import { internshipsData } from '@/datatest/internshipsData'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaDollarSign, FaUsers, FaCheckCircle, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function InternshipsList() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language

	return (
		<div className='w-full overflow-hidden relative z-0'>
			<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className='relative bg-gradient-to-br from-orange-900 via-amber-700 to-yellow-900 text-white py-12 md:py-20 px-4 md:px-12'>
				<div className='absolute inset-0 bg-[url("/images/ung1.png")] bg-cover bg-center opacity-10 pointer-events-none' />
				<div className='container mx-auto relative'>
					<motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className='max-w-4xl mx-auto text-center'>
						<div className='flex justify-center mb-4 md:mb-6'>
							<div className='bg-white/20 backdrop-blur-lg p-4 md:p-5 rounded-full'>
								<FaBriefcase className='text-4xl md:text-5xl' />
							</div>
						</div>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>{t('internships.title')}</h1>
						<p className='text-base sm:text-lg md:text-xl text-orange-100 px-2'>{t('internships.description')}</p>
					</motion.div>
				</div>
			</motion.section>

			<section className='py-10 md:py-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-900'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-orange-600 mb-2'>{internshipsData.filter(i => i.status === 'active').length}</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('internships.activeCount')}</div>
						</motion.div>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-blue-600 mb-2'>{internshipsData.reduce((sum, i) => sum + i.applicants, 0)}</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('internships.totalApplicants')}</div>
						</motion.div>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-green-600 mb-2'>{internshipsData.reduce((sum, i) => sum + i.positions, 0)}</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('internships.totalPositions')}</div>
						</motion.div>
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className='text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md'>
							<div className='text-3xl sm:text-4xl font-bold text-purple-600 mb-2'>{internshipsData.length}</div>
							<div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('internships.totalInternships')}</div>
						</motion.div>
					</div>
				</div>
			</section>

			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto max-w-7xl'>
					<div className='grid gap-6 md:gap-8'>
						{internshipsData.map((internship, index) => (
							<motion.article key={internship.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }} className='group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
								<div className='md:flex'>
									<div className='md:w-2/5 relative h-48 md:h-auto overflow-hidden'>
										<motion.img src={internship.image} alt={internship.title[currentLang]} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
										<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
										<div className='absolute top-4 left-4'>
											<span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'>
												<FaCheckCircle /> {t(`internships.status.${internship.status}`)}
											</span>
										</div>
										<div className='absolute bottom-4 right-4'>
											<span className='inline-block px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200'>
												{t(`internships.category.${internship.category}`)}
											</span>
										</div>
									</div>
									<div className='md:w-3/5 p-5 md:p-8 flex flex-col justify-between'>
										<div>
											<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>{internship.title[currentLang]}</h2>
											<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 line-clamp-2'>{internship.shortDescription[currentLang]}</p>
											<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6'>
												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaDollarSign className='text-orange-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>{t('internships.stipend')}</span>
														{internship.stipend}
													</div>
												</div>
												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaClock className='text-blue-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>{t('internships.duration')}</span>
														{internship.duration}
													</div>
												</div>
												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaCalendarAlt className='text-red-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>{t('internships.deadline')}</span>
														{internship.deadline}
													</div>
												</div>
												<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
													<FaMapMarkerAlt className='text-purple-500 flex-shrink-0' />
													<div>
														<span className='font-semibold block text-gray-800 dark:text-gray-200'>{t('internships.positions')}</span>
														{internship.positions} {t('internships.positionsAvailable')}
													</div>
												</div>
											</div>
										</div>
										<div className='flex flex-col sm:flex-row gap-3'>
											<Link to={`/internships/${internship.id}`} className='flex-1 text-center px-5 py-2.5 md:py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base'>
												{t('internships.viewDetails')} →
											</Link>
											{internship.status === 'active' && (
												<button className='flex-1 px-5 py-2.5 md:py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors shadow-md text-sm sm:text-base'>
													{t('internships.apply')}
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

			<motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='py-12 md:py-16 px-4 md:px-12 bg-gradient-to-br from-orange-900 via-amber-700 to-yellow-900 text-white'>
				<div className='container mx-auto max-w-4xl text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6'>{t('internships.cta.title')}</h2>
					<p className='text-base sm:text-lg md:text-xl text-orange-100 mb-6 md:mb-8 px-4'>{t('internships.cta.description')}</p>
					<Link to='/login' className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'>
						{t('internships.cta.button')} →
					</Link>
				</div>
			</motion.section>
		</div>
	)
}

