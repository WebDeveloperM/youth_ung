import Comments from '@/components/Comments'
import { grantsData } from '@/datatest/grantsData'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaDollarSign, FaUsers, FaShare, FaCheckCircle } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function GrantDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLang = i18n.language

	const grant = grantsData.find(item => item.id === Number(id))

	if (!grant) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center gap-4'>
					<FaDollarSign className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>{t('grants.notFound')}</h2>
					<Link to='/grants' className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
						<FaArrowLeft /> {t('grants.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ title: grant.title[currentLang], text: t('grants.shareText'), url: window.location.href })
				.catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert(t('grants.linkCopied'))
		}
	}

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'>
			<Link to='/grants' className='inline-flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mb-4 md:mb-6 font-semibold transition-colors group'>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('grants.back')}
			</Link>

			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'>
				<span className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
					<FaCheckCircle /> {t(`grants.status.${grant.status}`)}
				</span>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{t(`grants.category.${grant.category}`)}
				</span>
			</motion.div>

			<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight'>
				{grant.title[currentLang]}
			</motion.h1>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8 pb-6 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-green-50 dark:bg-green-950/30 rounded-xl'>
					<FaDollarSign size={24} className='text-green-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('grants.amount')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{grant.amount}</span>
					</div>
				</div>

				<div className='flex items-center gap-3 p-3 md:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl'>
					<FaClock size={24} className='text-blue-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('grants.duration')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{grant.duration}</span>
					</div>
				</div>

				<div className='flex items-center gap-3 p-3 md:p-4 bg-red-50 dark:bg-red-950/30 rounded-xl'>
					<FaCalendarAlt size={24} className='text-red-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('grants.deadline')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{grant.deadline}</span>
					</div>
				</div>

				<div className='flex items-center gap-3 p-3 md:p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl'>
					<FaUsers size={24} className='text-purple-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('grants.applicants')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{grant.applicants} {t('grants.people')}</span>
					</div>
				</div>
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='flex justify-end mb-4 md:mb-6'>
				<button onClick={handleShare} className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm sm:text-base' aria-label={t('grants.share')}>
					<FaShare size={14} />
					{t('grants.share')}
				</button>
			</motion.div>

			<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className='relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl'>
				<img src={grant.image} alt={grant.title[currentLang]} className='w-full max-h-[400px] md:max-h-[600px] object-cover' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-green-500 prose-blockquote:bg-green-50 dark:prose-blockquote:bg-green-950/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-a:text-green-600 hover:prose-a:text-green-700 mb-8 md:mb-12' dangerouslySetInnerHTML={{ __html: grant.content[currentLang] }} />

			{grant.status === 'active' && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 md:p-8 text-white mb-8 md:mb-12'>
					<h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4'>{t('grants.applyNow')}</h3>
					<p className='text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90'>{t('grants.applyDescription')}</p>
					<button className='px-6 md:px-8 py-3 md:py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'>
						{t('grants.applyButton')} →
					</button>
				</motion.div>
			)}

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className='mt-8 md:mt-12'>
				<Comments contentType="grant" objectId={grant.id} />
			</motion.div>
		</motion.section>
	)
}

