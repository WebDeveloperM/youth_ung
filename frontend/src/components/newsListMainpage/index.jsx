import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getNewsList } from '@/api/news'

export default function NewsListMainpage() {
	const { t, i18n } = useTranslation()
	const [latestNews, setLatestNews] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadNews()
	}, [])

	const loadNews = async () => {
		try {
			setLoading(true)
			const news = await getNewsList({ limit: 3 })
			setLatestNews(news)
		} catch (error) {
			console.error('Ошибка загрузки новостей:', error)
		} finally {
			setLoading(false)
		}
	}

	// Получаем заголовок и контент в зависимости от языка
	const getTitle = (news) => {
		// Нормализуем язык (берем первые 2 символа: 'uz-UZ' -> 'uz')
		const lang = i18n.language.split('-')[0].toLowerCase()
		return news[`title_${lang}`] || news.title_ru || news.title_en || ''
	}

	const getContent = (news) => {
		// Нормализуем язык (берем первые 2 символа: 'uz-UZ' -> 'uz')
		const lang = i18n.language.split('-')[0].toLowerCase()
		return news[`content_${lang}`] || news.content_ru || news.content_en || '<p>Контент отсутствует</p>'
	}

	if (loading) {
		return (
			<section className='relative overflow-hidden py-6 px-4 md:px-12'>
				<div className='max-w-6xl mx-auto mb-12 text-center'>
					<h2 className='text-3xl md:text-4xl font-extrabold'>
						{t('news.latestNews')}
					</h2>
				</div>
				<div className='text-center py-10'>
					<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0078c2]'></div>
				</div>
			</section>
		)
	}

	return (
		<section
			className='relative overflow-hidden  py-6 px-4 md:px-12'
			aria-labelledby='news-title'
		>
			<div className='max-w-6xl mx-auto mb-12 text-center'>
				<h2 id='news-title' className='text-3xl md:text-4xl font-extrabold'>
					{t('news.latestNews')}
				</h2>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 container mx-auto py-10 px-4'>
				{latestNews.map((news, index) => {
					const title = getTitle(news)
					const content = getContent(news)
					
					return (
						<motion.article
							key={news.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className='group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
						>
							<div className='relative h-48 overflow-hidden bg-gray-200'>
								{news.image ? (
									<motion.img
										src={news.image}
										alt={title}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200'>
										<span className='text-4xl text-gray-400'>📰</span>
									</div>
								)}
								<div className='absolute inset-0 group-hover:opacity-40 transition-all duration-500' />
							</div>

							<div className='p-6 flex flex-col text-[#0f172a]'>
								<h3 className='text-lg font-semibold mb-2 group-hover:text-[#0078c2] transition-colors duration-300'>
									{title}
								</h3>
								<p
									className='text-gray-600 text-sm mb-4 flex-1 leading-relaxed line-clamp-3'
									dangerouslySetInnerHTML={{
										__html: content.substring(0, 150) + '...',
									}}
								/>
								<div className='flex justify-between items-center mt-auto text-sm text-gray-500'>
									<div className='flex items-center gap-3'>
										<span className='flex items-center gap-1'>
											<FaEye className='text-[#0078c2]' /> {news.views}
										</span>
									</div>
									<span>{news.date}</span>
								</div>
								<Link
									to={`/news/${news.id}`}
									className='mt-4 inline-block text-[#f97316] font-semibold hover:text-[#fb923c] transition-colors duration-300'
								>
									{t('news.readMore')} →
								</Link>
							</div>
						</motion.article>
					)
				})}
			</div>

			<div className='mt-16 flex justify-center'>
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
