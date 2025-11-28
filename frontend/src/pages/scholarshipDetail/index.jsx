import { useState, useEffect } from 'react'
import Comments from '@/components/Comments'
import ApplicationForm from '@/components/ApplicationForm'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaDollarSign, FaUsers, FaShare, FaCheckCircle, FaPaperPlane } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getScholarshipDetail } from '@/api/scholarships'

export default function ScholarshipDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const [scholarship, setScholarship] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [showApplicationForm, setShowApplicationForm] = useState(false)

	useEffect(() => {
		loadScholarship()
	}, [id])

	const loadScholarship = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await getScholarshipDetail(id)
			setScholarship(data)
		} catch (error) {
			console.error('Ошибка загрузки стипендии:', error)
			setError(error)
		} finally {
			setLoading(false)
		}
	}

	// Получаем поля в зависимости от языка
	const getTitle = () => {
		if (!scholarship) return ''
		const lang = i18n.language.split('-')[0].toLowerCase()
		return scholarship[`title_${lang}`] || scholarship.title_ru || scholarship.title_en || ''
	}

	const getShortDescription = () => {
		if (!scholarship) return ''
		const lang = i18n.language.split('-')[0].toLowerCase()
		return scholarship[`short_description_${lang}`] || scholarship.short_description_ru || scholarship.short_description_en || ''
	}

	const getContent = () => {
		if (!scholarship) return ''
		const lang = i18n.language.split('-')[0].toLowerCase()
		return scholarship[`content_${lang}`] || scholarship.content_ru || scholarship.content_en || ''
	}

	if (loading) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0078c2]'></div>
			</div>
		)
	}

	if (!scholarship || error) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center gap-4'>
					<FaDollarSign className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>{t('scholarships.notFound')}</h2>
					<Link to='/scholarships' className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
						<FaArrowLeft /> {t('scholarships.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const title = getTitle()
	const content = getContent()

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ title: getTitle(), text: t('scholarships.shareText'), url: window.location.href }).catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert(t('scholarships.linkCopied'))
		}
	}

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'>
			<Link to='/scholarships' className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 md:mb-6 font-semibold transition-colors group'>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('scholarships.back')}
			</Link>

			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'>
				<span className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
					<FaCheckCircle /> {t(`scholarships.status.${scholarship.status}`)}
				</span>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{t(`scholarships.category.${scholarship.category}`)}
				</span>
			</motion.div>

			<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight'>
				{title}
			</motion.h1>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8 pb-6 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl'>
					<FaDollarSign size={24} className='text-blue-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('scholarships.amount')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{scholarship.amount}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl'>
					<FaClock size={24} className='text-purple-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('scholarships.duration')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{scholarship.duration}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-red-50 dark:bg-red-950/30 rounded-xl'>
					<FaCalendarAlt size={24} className='text-red-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('scholarships.deadline')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{scholarship.deadline}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-green-50 dark:bg-green-950/30 rounded-xl'>
					<FaUsers size={24} className='text-green-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('scholarships.recipients')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{scholarship.recipients} {t('scholarships.people')}</span>
					</div>
				</div>
			</motion.div>

		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='flex gap-3 justify-end mb-4 md:mb-6'>
			<button 
				onClick={() => setShowApplicationForm(true)}
				className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg transform hover:scale-105 text-sm sm:text-base'
			>
				<FaPaperPlane size={16} />
				{t('scholarships.apply')}
			</button>
			<button 
				onClick={handleShare} 
				className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm sm:text-base' 
				aria-label={t('scholarships.share')}
			>
				<FaShare size={14} />
				{t('scholarships.share')}
			</button>
		</motion.div>

		{scholarship.image ? (
			<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className='relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl'>
				<img src={scholarship.image} alt={title} className='w-full max-h-[400px] md:max-h-[600px] object-cover' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
			</motion.div>
		) : (
			<div className='rounded-2xl w-full h-64 bg-gradient-to-br from-blue-100 to-purple-200 mb-6 md:mb-8 flex items-center justify-center'>
				<span className='text-8xl text-blue-400'>🎓</span>
			</div>
		)}

		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-a:text-blue-600 hover:prose-a:text-blue-700 mb-8 md:mb-12' dangerouslySetInnerHTML={{ __html: content }} />

			{scholarship.status === 'active' && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-8 md:mb-12'>
					<h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4'>{t('scholarships.applyNow')}</h3>
					<p className='text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90'>{t('scholarships.applyDescription')}</p>
					<button className='px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'>
						{t('scholarships.applyButton')} →
					</button>
				</motion.div>
			)}

		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className='mt-8 md:mt-12'>
			<Comments contentType="scholarship" objectId={scholarship.id} />
		</motion.div>

		{/* Application Form Modal */}
		{showApplicationForm && (
			<ApplicationForm
				contentType="scholarship"
				objectId={scholarship.id}
				contentTitle={title}
				onClose={() => setShowApplicationForm(false)}
				onSuccess={() => {
					// Обновить счетчик recipients
					setScholarship({ ...scholarship, recipients: scholarship.recipients + 1 })
				}}
			/>
		)}
	</motion.section>
)
}

