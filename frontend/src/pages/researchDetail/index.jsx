import Comments from '@/components/comments'
import { researchData } from '@/datatest/researchData'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt, FaDollarSign, FaShare, FaBook, FaQuoteRight, FaMicroscope, FaUsers } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ResearchDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLang = i18n.language
	const research = researchData.find(item => item.id === Number(id))

	if (!research) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center gap-4'>
					<FaMicroscope className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>{t('research.notFound')}</h2>
					<Link to='/research' className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
						<FaArrowLeft /> {t('research.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ title: research.title[currentLang], text: t('research.shareText'), url: window.location.href }).catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert(t('research.linkCopied'))
		}
	}

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'>
			<Link to='/research' className='inline-flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mb-4 md:mb-6 font-semibold transition-colors group'>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('research.back')}
			</Link>

			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'>
				<span className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
					{t(`research.status.${research.status}`)}
				</span>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{t(`research.category.${research.category}`)}
				</span>
			</motion.div>

			<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight'>
				{research.title[currentLang]}
			</motion.h1>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8 pb-6 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-green-50 dark:bg-green-950/30 rounded-xl'>
					<FaDollarSign size={24} className='text-green-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('research.budget')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{research.budget}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl'>
					<FaCalendarAlt size={24} className='text-blue-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('research.period')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{research.startDate.slice(0, 4)} - {research.endDate.slice(0, 4)}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-teal-50 dark:bg-teal-950/30 rounded-xl'>
					<FaBook size={24} className='text-teal-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('research.publications')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{research.publications}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl'>
					<FaQuoteRight size={24} className='text-cyan-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('research.citations')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{research.citations}</span>
					</div>
				</div>
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='flex justify-between items-center mb-4 md:mb-6'>
				<div className='flex items-center gap-2'>
					<FaUsers className='text-gray-500' />
					<div>
						<span className='text-xs text-gray-500 dark:text-gray-400 block'>{t('research.department')}</span>
						<span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>{research.department}</span>
					</div>
				</div>
				<button onClick={handleShare} className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm' aria-label={t('research.share')}>
					<FaShare size={14} />
					{t('research.share')}
				</button>
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className='mb-6'>
				<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t('research.authors')}:</h3>
				<div className='flex flex-wrap gap-2'>
					{research.authors.map((author, idx) => (
						<span key={idx} className='px-3 py-1.5 bg-green-50 dark:bg-green-950/30 rounded-full text-sm font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'>
							{author}
						</span>
					))}
				</div>
			</motion.div>

			<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className='relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl'>
				<img src={research.image} alt={research.title[currentLang]} className='w-full max-h-[400px] md:max-h-[600px] object-cover' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-green-500 prose-blockquote:bg-green-50 dark:prose-blockquote:bg-green-950/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-a:text-green-600 hover:prose-a:text-green-700 mb-8 md:mb-12' dangerouslySetInnerHTML={{ __html: research.content[currentLang] }} />

			{research.status === 'active' && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className='bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white mb-8 md:mb-12'>
					<h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4'>{t('research.joinResearch')}</h3>
					<p className='text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90'>{t('research.joinDescription')}</p>
					<Link to='/jobs' className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'>
						{t('research.viewVacancies')} →
					</Link>
				</motion.div>
			)}

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className='mt-8 md:mt-12'>
				<Comments contentType="research" objectId={research.id} />
			</motion.div>
		</motion.section>
	)
}

