import { useState, useEffect } from 'react'
import Comments from '@/components/Comments'
import { FaEye, FaHeart } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getNewsDetail, likeNews } from '@/api/news'

export default function NewsDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const [news, setNews] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		loadNews()
	}, [id])

	const loadNews = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await getNewsDetail(id)
			setNews(data)
		} catch (error) {
			console.error('Ошибка загрузки новости:', error)
			setError(error)
		} finally {
			setLoading(false)
		}
	}

	const handleLike = async () => {
		try {
			const newLikes = await likeNews(id)
			setNews({ ...news, likes: newLikes })
		} catch (error) {
			console.error('Ошибка добавления лайка:', error)
		}
	}

	// Получаем заголовок и контент в зависимости от языка
	const getTitle = () => {
		// Нормализуем язык (берем первые 2 символа: 'uz-UZ' -> 'uz')
		const lang = i18n.language.split('-')[0].toLowerCase()
		return news[`title_${lang}`] || news.title_ru || news.title_en || 'Заголовок отсутствует'
	}

	const getContent = () => {
		// Нормализуем язык (берем первые 2 символа: 'uz-UZ' -> 'uz')
		const lang = i18n.language.split('-')[0].toLowerCase()
		return news[`content_${lang}`] || news.content_ru || news.content_en || '<p>Контент отсутствует</p>'
	}

	if (loading) {
		return (
			<div className='text-center mt-20'>
				<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0078c2]'></div>
			</div>
		)
	}

	if (error || !news) {
		return (
			<div className='text-center mt-20 text-gray-500'>{t('news.notFound')}</div>
		)
	}

	const title = getTitle()
	const content = getContent()

	return (
		<section className='container mx-auto py-10 px-4'>
			<Link to='/news' className='text-blue-500 hover:underline mb-4 block'>
				← {t('news.back')}
			</Link>
			{news.image ? (
				<img
					src={news.image}
					alt={title}
					className='rounded-xl w-full max-h-[480px] object-cover mb-6'
				/>
			) : (
				<div className='rounded-xl w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 mb-6 flex items-center justify-center'>
					<span className='text-6xl text-gray-400'>📰</span>
				</div>
			)}
			<h1 className='text-3xl font-bold text-blue-700 mb-4'>{title}</h1>
			<div className='flex gap-3 items-center text-gray-400 text-sm mb-4'>
				<div className='flex gap-0.5 items-center'>{news.date}</div>
				<button
					onClick={handleLike}
					className='flex gap-0.5 items-center hover:text-red-500 transition-colors cursor-pointer'
				>
					<FaHeart size={16} />
					{news.likes}
				</button>
				<div className='flex gap-0.5 items-center'>
					<FaEye size={16} />
					{news.views}
				</div>
			</div>
			<div
				className='prose max-w-none prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-blue-500 prose-blockquote:italic'
				dangerouslySetInnerHTML={{ __html: content }}
			/>
			<Comments contentType="news" objectId={news.id} />
		</section>
	)
}
