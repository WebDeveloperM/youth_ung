import { useState, useEffect } from 'react'
import Comments from '@/components/Comments'
import ApplicationForm from '@/components/ApplicationForm'
import { getJobDetail } from '@/api/jobs'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaUsers, FaShare, FaCheckCircle, FaBriefcase } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function JobDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLang = i18n.language
	const [job, setJob] = useState(null)
	const [loading, setLoading] = useState(true)
	const [showApplicationForm, setShowApplicationForm] = useState(false)

	useEffect(() => {
		loadJobDetail()
	}, [id])

	const loadJobDetail = async () => {
		try {
			setLoading(true)
			const data = await getJobDetail(id)
			
			// Transform backend data to frontend format
			const transformedJob = {
				id: data.id,
				title: {
					uz: data.title_uz,
					ru: data.title_ru,
					en: data.title_en,
				},
				shortDescription: {
					uz: data.short_description_uz,
					ru: data.short_description_ru,
					en: data.short_description_en,
				},
				content: {
					uz: data.content_uz,
					ru: data.content_ru,
					en: data.content_en,
				},
				image: data.image || '/images/default-job.jpg',
				salary: data.salary,
				location: data.location,
				type: data.type,
				experience: data.experience,
				deadline: data.deadline,
				category: data.category,
				employment_type: data.employment_type,
				status: data.status,
				applicants: data.applicants || 0,
				positions: data.positions || 1,
			}
			
			setJob(transformedJob)
			console.log('✅ Вакансия загружена:', transformedJob)
		} catch (error) {
			console.error('❌ Ошибка загрузки вакансии:', error)
			setJob(null)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<div className='flex justify-center items-center'>
					<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600'></div>
				</div>
			</div>
		)
	}

	if (!job) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center gap-4'>
					<FaBriefcase className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>{t('jobs.notFound')}</h2>
					<Link to='/jobs' className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
						<FaArrowLeft /> {t('jobs.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ title: job.title[currentLang], text: t('jobs.shareText'), url: window.location.href }).catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert(t('jobs.linkCopied'))
		}
	}

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'>
			<Link to='/jobs' className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 md:mb-6 font-semibold transition-colors group'>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('jobs.back')}
			</Link>

			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'>
				<span className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
					<FaCheckCircle /> {t(`jobs.status.${job.status}`)}
				</span>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{t(`jobs.category.${job.category}`)}
				</span>
			</motion.div>

			<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight'>
				{job.title[currentLang]}
			</motion.h1>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8 pb-6 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-green-50 dark:bg-green-950/30 rounded-xl'>
					<FaMoneyBillWave size={24} className='text-green-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('jobs.salary')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{job.salary}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-red-50 dark:bg-red-950/30 rounded-xl'>
					<FaMapMarkerAlt size={24} className='text-red-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('jobs.location')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{job.location}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl'>
					<FaClock size={24} className='text-blue-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('jobs.experience')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{job.experience}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl'>
					<FaUsers size={24} className='text-purple-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('jobs.positions')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{job.positions} {t('jobs.positionsAvailable')}</span>
					</div>
				</div>
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='flex justify-end mb-4 md:mb-6'>
				<button onClick={handleShare} className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm sm:text-base' aria-label={t('jobs.share')}>
					<FaShare size={14} />
					{t('jobs.share')}
				</button>
			</motion.div>

			<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className='relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl'>
				<img src={job.image} alt={job.title[currentLang]} className='w-full max-h-[400px] md:max-h-[600px] object-cover' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-a:text-blue-600 hover:prose-a:text-blue-700 mb-8 md:mb-12' dangerouslySetInnerHTML={{ __html: job.content[currentLang] }} />

			{job.status === 'active' && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white mb-8 md:mb-12'>
					<h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4'>{t('jobs.applyNow') || 'Ҳозироқ ариза юборинг'}</h3>
					<p className='text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90'>{t('jobs.applyDescription') || 'Бу вакансияга ариза юборинг ва ўз карьерангизни бошланг!'}</p>
					<button 
						onClick={() => setShowApplicationForm(true)}
						className='px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'
					>
						{t('jobs.applyButton') || 'Ариза юбориш'} →
					</button>
				</motion.div>
			)}

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className='mt-8 md:mt-12'>
				<Comments contentType="job" objectId={job.id} />
			</motion.div>

			{/* Application Form Modal */}
			{showApplicationForm && (
				<ApplicationForm
					contentType="job"
					objectId={job.id}
					contentTitle={job.title[currentLang]}
					onClose={() => setShowApplicationForm(false)}
					onSuccess={() => {
						toast.success('✅ Ариза муваффақиятли юборилди! Тез орада сиз билан боғланамиз.')
						setShowApplicationForm(false)
						// Refresh job to update applicants count
						loadJobDetail()
					}}
				/>
			)}
		</motion.section>
	)
}

