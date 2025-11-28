import { useState, useEffect } from 'react'
import Comments from '@/components/Comments'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaEye, FaHeart, FaLightbulb, FaShare } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getInnovationDetail } from '@/api/innovations'

export default function InnovationDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const [innovation, setInnovation] = useState(null)
	const [loading, setLoading] = useState(true)

	// Нормализуем язык (uz-UZ -> uz)
	const currentLang = i18n.language.split('-')[0]

	// Функция для получения заголовка на текущем языке
	const getTitle = (innov) => {
		if (!innov) return ''
		return innov[`title_${currentLang}`] || innov.title_ru || innov.title_uz || innov.title_en || ''
	}

	// Функция для получения контента на текущем языке
	const getContent = (innov) => {
		if (!innov) return ''
		return innov[`content_${currentLang}`] || innov.content_ru || innov.content_uz || innov.content_en || ''
	}

	// Загружаем инновацию с API
	useEffect(() => {
		const loadInnovation = async () => {
			try {
				setLoading(true)
				const data = await getInnovationDetail(id)
				setInnovation(data)
			} catch (error) {
				console.error('Ошибка загрузки инновации:', error)
				setInnovation(null)
			} finally {
				setLoading(false)
			}
		}

		loadInnovation()
	}, [id])

	if (loading) {
		return (
			<div className='w-full min-h-screen flex items-center justify-center'>
				<div className='text-xl'>Загрузка...</div>
			</div>
		)
	}

	if (!innovation) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='flex flex-col items-center gap-4'
				>
					<FaLightbulb className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>
						{t('innovations.notFound')}
					</h2>
					<Link
						to='/innovations'
						className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
					>
						<FaArrowLeft /> {t('innovations.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: getTitle(innovation),
					text: t('innovations.shareText'),
					url: window.location.href,
				})
				.catch(err => console.log('Error sharing:', err))
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href)
			alert(t('innovations.linkCopied'))
		}
	}

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='container mx-auto py-10 px-4 max-w-5xl'
		>
			{/* Back Button */}
			<Link
				to='/innovations'
				className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 font-semibold transition-colors group'
			>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('innovations.back')}
			</Link>

			{/* Category Badge */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2 }}
				className='mb-4'
			>
				<span className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase shadow-md'>
					<FaLightbulb />
					{t(`innovations.categories.${innovation.category}`)}
				</span>
			</motion.div>

			{/* Title */}
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight'
			>
				{getTitle(innovation)}
			</motion.h1>

			{/* Meta Information */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className='flex flex-wrap gap-4 items-center text-gray-500 dark:text-gray-400 text-sm mb-6 pb-6 border-b border-gray-200 dark:border-gray-700'
			>
				<div className='flex items-center gap-1 hover:text-blue-600 transition-colors cursor-default'>
					<FaEye size={18} className='text-blue-600' />
					<span className='font-semibold'>{innovation.views}</span>
					<span>{t('innovations.views')}</span>
				</div>
				<div className='w-1 h-1 rounded-full bg-gray-400' />
				<div className='flex items-center gap-1 hover:text-red-500 transition-colors cursor-default'>
					<FaHeart size={16} className='text-red-500' />
					<span className='font-semibold'>{innovation.likes}</span>
					<span>{t('innovations.likes')}</span>
				</div>
				<div className='w-1 h-1 rounded-full bg-gray-400' />
				<div className='flex items-center gap-1'>
					<span className='font-semibold'>{innovation.date}</span>
				</div>
				<div className='ml-auto'>
					<button
						onClick={handleShare}
						className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 rounded-lg transition-colors'
						aria-label={t('innovations.share')}
					>
						<FaShare size={14} />
						{t('innovations.share')}
					</button>
				</div>
			</motion.div>

			{/* Main Image */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.5 }}
				className='relative rounded-2xl overflow-hidden mb-8 shadow-2xl'
			>
				<img
					src={innovation.image || '/images/placeholder.jpg'}
					alt={getTitle(innovation)}
					className='w-full max-h-[600px] object-cover'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
			</motion.div>

			{/* Content */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='prose prose-lg max-w-none 
					prose-headings:text-gray-800 dark:prose-headings:text-gray-200
					prose-p:text-gray-700 dark:prose-p:text-gray-300
					prose-strong:text-gray-900 dark:prose-strong:text-gray-100
					prose-li:text-gray-700 dark:prose-li:text-gray-300
					prose-img:rounded-xl prose-img:shadow-lg
					prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30
					prose-blockquote:rounded-r-lg prose-blockquote:py-2
					prose-a:text-blue-600 hover:prose-a:text-blue-700
					mb-12'
				dangerouslySetInnerHTML={{ __html: getContent(innovation) }}
			/>

			{/* Comments Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className='mt-12'
			>
				<Comments contentType="innovation" objectId={innovation.id} />
			</motion.div>
		</motion.section>
	)
}

