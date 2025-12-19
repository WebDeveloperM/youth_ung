import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaEye, FaDownload, FaHeart, FaCalendar, FaTag, FaUser } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { getArticleDetail, likeArticle, downloadArticlePDF } from '@/api/articles'

export default function ArticleDetail() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { t, i18n } = useTranslation()
	const [article, setArticle] = useState(null)
	const [loading, setLoading] = useState(true)
	const [liked, setLiked] = useState(false)

	useEffect(() => {
		loadArticle()
	}, [id])

	const loadArticle = async () => {
		try {
			setLoading(true)
			const data = await getArticleDetail(id)
			setArticle(data)
		} catch (error) {
			console.error('Maqolani yuklashda xatolik:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleLike = async () => {
		if (liked) return
		try {
			const result = await likeArticle(id)
			setArticle({ ...article, likes: result.likes })
			setLiked(true)
		} catch (error) {
			console.error('Like qo\'yishda xatolik:', error)
		}
	}

	const handleDownload = async () => {
		try {
			const result = await downloadArticlePDF(id)
			if (result.file_url) {
				window.open(result.file_url, '_blank')
				setArticle({ ...article, downloads: result.downloads })
			}
		} catch (error) {
			console.error('PDF yuklashda xatolik:', error)
			alert(t('articles.pdfNotAvailable'))
		}
	}

	const getTitle = () => {
		if (!article) return ''
		const lang = i18n.language.split('-')[0].toLowerCase()
		return article[`title_${lang}`] || article.title_ru || article.title_en || ''
	}

	const getAbstract = () => {
		if (!article) return ''
		const lang = i18n.language.split('-')[0].toLowerCase()
		return article[`abstract_${lang}`] || article.abstract_ru || article.abstract_en || ''
	}

	const getContent = () => {
		if (!article) return ''
		const lang = i18n.language.split('-')[0].toLowerCase()
		return article[`content_${lang}`] || article.content_ru || article.content_en || ''
	}

	const getKeywords = () => {
		if (!article) return ''
		const lang = i18n.language.split('-')[0].toLowerCase()
		return article[`keywords_${lang}`] || article.keywords_ru || article.keywords_en || ''
	}

	const getCategoryLabel = (category) => {
		return t(`articles.category.${category}`) || category
	}

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0078c2]'></div>
			</div>
		)
	}

	if (!article) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-gray-800 mb-4'>{t('articles.notFound')}</h2>
					<Link to='/articles' className='text-[#0078c2] hover:underline'>
						{t('articles.backToList')}
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				{/* Back Button */}
				<button
					onClick={() => navigate('/articles')}
					className='flex items-center gap-2 text-[#0078c2] hover:text-[#005a94] mb-6 transition-colors'
				>
					<FaArrowLeft />
					<span>{t('articles.submit.backButton')}</span>
				</button>

				{/* Article Card */}
				<motion.article
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-white rounded-2xl shadow-lg overflow-hidden'
				>
					{/* Cover Image */}
					{article.cover_image && (
						<div className='relative h-64 md:h-96 overflow-hidden'>
							<img
								src={article.cover_image}
								alt={getTitle()}
								className='w-full h-full object-cover'
							/>
							{article.is_featured && (
								<div className='absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold'>
									⭐ {t('articles.featured')}
								</div>
							)}
						</div>
					)}

					{/* Content */}
					<div className='p-6 md:p-10'>
						{/* Category Badge */}
						<div className='mb-4'>
							<span className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full'>
								<FaTag />
								{getCategoryLabel(article.category)}
							</span>
						</div>

						{/* Title */}
						<h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
							{getTitle()}
						</h1>

						{/* Meta Information */}
						<div className='flex flex-wrap gap-4 mb-8 text-sm text-gray-600'>
							{article.author && (
								<div className='flex items-center gap-2'>
									<FaUser className='text-[#0078c2]' />
									<span>
										{article.author.first_name && article.author.last_name
											? `${article.author.first_name} ${article.author.last_name}`
											: article.author.username}
									</span>
								</div>
							)}
							{article.publication_date && (
								<div className='flex items-center gap-2'>
									<FaCalendar className='text-[#0078c2]' />
									<span>{new Date(article.publication_date).toLocaleDateString('uz-UZ')}</span>
								</div>
							)}
						</div>

						{/* Stats and Actions */}
						<div className='flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-200'>
							<div className='flex items-center gap-6 text-gray-600'>
								<span className='flex items-center gap-2'>
									<FaEye className='text-blue-500' />
									{article.views} {t('articles.views')}
								</span>
								<span className='flex items-center gap-2'>
									<FaDownload className='text-green-500' />
									{article.downloads} {t('articles.downloads')}
								</span>
								<span className='flex items-center gap-2'>
									<FaHeart className={liked ? 'text-red-500' : 'text-gray-400'} />
									{article.likes} {t('articles.likes')}
								</span>
							</div>

							<div className='flex gap-3'>
								<button
									onClick={handleLike}
									disabled={liked}
									className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
										liked
											? 'bg-red-100 text-red-600 cursor-not-allowed'
											: 'bg-red-500 text-white hover:bg-red-600'
									}`}
								>
									<FaHeart />
									{liked ? t('articles.liked') : t('articles.like')}
								</button>
								{article.pdf_file && (
									<button
										onClick={handleDownload}
										className='flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
									>
										<FaDownload />
										{t('articles.downloadPDF')}
									</button>
								)}
							</div>
						</div>

						{/* Abstract */}
						<div className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>{t('articles.abstract')}</h2>
							<p className='text-gray-700 leading-relaxed text-lg'>
								{getAbstract()}
							</p>
						</div>

						{/* Full Content */}
						<div className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>{t('articles.fullText')}</h2>
							<div
								className='prose prose-lg max-w-none text-gray-700 leading-relaxed'
								dangerouslySetInnerHTML={{ __html: getContent() }}
							/>
						</div>

						{/* Keywords */}
						{getKeywords() && (
							<div className='mb-8'>
								<h3 className='text-xl font-semibold text-gray-900 mb-3'>{t('articles.keywords')}</h3>
								<div className='flex flex-wrap gap-2'>
									{getKeywords().split(',').map((keyword, index) => (
										<span
											key={index}
											className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'
										>
											{keyword.trim()}
										</span>
									))}
								</div>
							</div>
						)}

						{/* DOI */}
						{article.doi && (
							<div className='mb-8'>
								<h3 className='text-xl font-semibold text-gray-900 mb-3'>DOI</h3>
								<p className='text-gray-700 font-mono'>{article.doi}</p>
							</div>
						)}
					</div>
				</motion.article>

				{/* Related Articles CTA */}
				<div className='mt-8 text-center'>
					<Link
						to='/articles'
						className='inline-block bg-[#0078c2] text-white px-8 py-3 rounded-lg hover:bg-[#005a94] transition-colors duration-300 font-semibold'
					>
						{t('articles.viewOthers')}
					</Link>
				</div>
			</div>
		</div>
	)
}

