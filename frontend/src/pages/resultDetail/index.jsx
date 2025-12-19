import { useState, useEffect } from 'react'
import Comments from '@/components/comments'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt, FaShare, FaChartLine, FaTrophy, FaCheckCircle } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getResultDetail } from '@/api/results'

export default function ResultDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLang = i18n.language
	const [result, setResult] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadResult = async () => {
			try {
				const data = await getResultDetail(id)
				setResult(data)
			} catch (error) {
				console.error('Error loading result:', error)
			} finally {
				setLoading(false)
			}
		}
		loadResult()
	}, [id])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		)
	}

	if (!result) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center gap-4'>
					<FaChartLine className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>{t('results.notFound')}</h2>
					<Link to='/results' className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'>
						<FaArrowLeft /> {t('results.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ 
				title: result[`title_${currentLang}`] || result.title_ru, 
				text: t('results.shareText'), 
				url: window.location.href 
			}).catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert(t('results.linkCopied'))
		}
	}

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'>
			<Link to='/results' className='inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-4 md:mb-6 font-semibold transition-colors group'>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('results.back')}
			</Link>

			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'>
				<span className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
					<FaCheckCircle size={14} />
					{t(`results.status.${result.status}`)}
				</span>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{t(`results.category.${result.category}`)}
				</span>
				<button onClick={handleShare} className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
					<FaShare /> {t('results.share')}
				</button>
			</motion.div>

			<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight'>
				{result[`title_${currentLang}`] || result.title_ru}
			</motion.h1>

			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className='flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-sm md:text-base'>
				<span className='inline-flex items-center gap-2'>
					<FaCalendarAlt className='text-indigo-600 dark:text-indigo-400' /> 
					{result.year} {t('results.year')}
				</span>
			</motion.div>

			{result.image && (
				<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className='relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl'>
					<img src={result.image} alt={result[`title_${currentLang}`] || result.title_ru} className='w-full max-h-[400px] md:max-h-[600px] object-cover' />
					<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
				</motion.div>
			)}

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className='mb-8'>
				<p className='text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium'>
					{result[`short_description_${currentLang}`] || result.short_description_ru}
				</p>
			</motion.div>

			{/* Metrics */}
			{result.metrics && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
					{result.metrics.split(',').map((metric, idx) => (
						<div key={idx} className='text-center p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl'>
							<div className='text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1'>{metric.trim()}</div>
						</div>
					))}
				</motion.div>
			)}

			{/* Achievements */}
			{result.achievements && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='mb-8'>
					<h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2'>
						<FaTrophy className='text-yellow-500' />
						{t('results.achievements')}
					</h3>
					<ul className='space-y-3'>
						{result.achievements.split(',').map((achievement, idx) => (
							<li key={idx} className='text-gray-700 dark:text-gray-300 flex items-start gap-3'>
								<FaCheckCircle className='text-green-500 mt-1 flex-shrink-0' />
								<span>{achievement.trim()}</span>
							</li>
						))}
					</ul>
				</motion.div>
			)}

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className='prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-950/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-a:text-indigo-600 hover:prose-a:text-indigo-700 mb-8 md:mb-12' dangerouslySetInnerHTML={{ __html: result[`content_${currentLang}`] || result.content_ru }} />

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className='mt-8 md:mt-12'>
				{result?.id && <Comments contentType="result" objectId={result.id} />}
			</motion.div>
		</motion.section>
	)
}

