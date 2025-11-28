import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getNewsList } from '@/api/news'

export default function NewsList() {
	const { t, i18n } = useTranslation()
	const [latestNews, setLatestNews] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadNews()
	}, [])

	const loadNews = async () => {
		try {
			setLoading(true)
			const news = await getNewsList()
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
			<section className='overflow-hidden py-6 px-4 md:px-12'>
				<div className='mx-auto mb-12 text-center text-[var(--navy-blue)]'>
					<h2 className='text-3xl md:text-4xl font-bold'>
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
			className='overflow-hidden py-6 px-4 md:px-12'
			aria-labelledby='news-title'
		>
			<div className='mx-auto mb-12 text-center text-[var(--navy-blue)]'>
				<h2 id='news-title' className='text-3xl md:text-4xl font-bold'>
					{t('news.latestNews')}
				</h2>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 container mx-auto py-4 px-4'>
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

							<div className='p-6 flex flex-col justify-between'>
								<div className='flex flex-col gap-3'>
									<h3 className='text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400 group-hover:text-[#0078c2] transition-colors duration-300'>
										{title}
									</h3>
									<p
										className='text-muted-foreground text-sm mb-4 flex-1 leading-relaxed line-clamp-3'
										dangerouslySetInnerHTML={{
											__html: content.substring(0, 150) + '...',
										}}
									/>
								</div>

								<div className='flex flex-col'>
									<div className='flex justify-between items-center text-sm text-gray-500'>
										<div className='flex items-center gap-3'>
											<span className='flex items-center gap-1'>
												<FaEye className='text-[#0078c2]' /> {news.views}
											</span>
										</div>
										<span>{news.date}</span>
									</div>
									<Link
										to={`/news/${news.id}`}
										className='mt-2 inline-block text-[#f97316] font-semibold hover:text-[#fb923c] transition-colors duration-300'
									>
									{t('news.readMore')} →
									</Link>
								</div>
							</div>
						</motion.article>
					)
				})}
			</div>
		</section>
	)
}
