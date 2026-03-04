import { getNewsList } from '@/api/news'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'

// Strip HTML tags and collapse whitespace for safe plain-text previews
const stripHtml = html =>
	html
		.replace(/<[^>]*>/g, ' ')
		.replace(/&[a-z]+;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim()

export default function NewsListMainpage() {
	const { t, i18n } = useTranslation()
	const [latestNews, setLatestNews] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let cancelled = false
		const load = async () => {
			try {
				const news = await getNewsList({ limit: 3 })
				if (!cancelled) setLatestNews(news)
			} catch {
				// News load failure is non-critical; silently ignore
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		load()
		return () => { cancelled = true }
	}, [])

	const lang = i18n.language.split('-')[0].toLowerCase()

	const getTitle = news =>
		news[`title_${lang}`] || news.title_ru || news.title_en || ''

	const getExcerpt = news => {
		const raw =
			news[`content_${lang}`] ||
			news.content_ru ||
			news.content_en ||
			''
		return stripHtml(raw).substring(0, 150)
	}

	if (loading) {
		return (
			<section id='latest-news' className='py-6 px-4 md:px-12'>
				<div className='max-w-6xl mx-auto mb-12 text-center'>
					<h2 className='text-3xl md:text-4xl font-extrabold'>
						{t('news.latestNews')}
					</h2>
				</div>
				<div className='flex justify-center py-10'>
					<div className='w-12 h-12 rounded-full border-2 border-[#0078c2] border-t-transparent animate-spin' />
				</div>
			</section>
		)
	}

	return (
		<section
			id='latest-news'
			className='py-6 px-4 md:px-12'
			aria-labelledby='news-section-title'
		>
			<div className='max-w-6xl mx-auto mb-12 text-center'>
				<h2
					id='news-section-title'
					className='text-3xl md:text-4xl text-[var(--navy-blue)] font-extrabold'
				>
					{t('news.latestNews')}
				</h2>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto'>
				{latestNews.map((news, index) => {
					const title = getTitle(news)
					const excerpt = getExcerpt(news)

					return (
						<motion.article
							key={news.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className='group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-card'
						>
							{/* Thumbnail */}
							<div className='relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800'>
								{news.image ? (
									<img
										src={news.image}
										alt={title}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'>
										<span className='text-5xl text-gray-300'>📰</span>
									</div>
								)}
							</div>

							{/* Body */}
							<div className='p-6 flex flex-col'>
								<h3 className='text-base font-semibold mb-2 text-[#0f172a] dark:text-white group-hover:text-[#0078c2] transition-colors duration-300 line-clamp-2'>
									{title}
								</h3>
								<p className='text-gray-500 dark:text-gray-400 text-sm mb-4 flex-1 leading-relaxed line-clamp-3'>
									{excerpt}{excerpt.length >= 150 ? '…' : ''}
								</p>
								<div className='flex justify-between items-center text-xs text-gray-400 mt-auto'>
									<span className='flex items-center gap-1'>
										<FaEye className='text-[#0078c2]' />
										{news.views ?? 0}
									</span>
									<span>{news.date}</span>
								</div>
								<Link
									to={`/news/${news.id}`}
									className='mt-4 inline-block text-[#f97316] font-semibold hover:text-[#fb923c] transition-colors duration-300 text-sm'
								>
									{t('news.readMore')} →
								</Link>
							</div>
						</motion.article>
					)
				})}
			</div>

			<div className='mt-14 flex justify-center'>
				<Link
					to='/news'
					className='inline-block px-8 py-3 rounded-full bg-[#0078c2] text-white font-semibold shadow-md hover:bg-[#0064a3] transition-all duration-300'
				>
					{t('news.viewAll')} →
				</Link>
			</div>
		</section>
	)
}
