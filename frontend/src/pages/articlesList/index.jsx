import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEye, FaDownload, FaHeart, FaFileAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getArticlesList } from '@/api/articles'

export default function ArticlesList() {
	const { t, i18n } = useTranslation()
	const [articles, setArticles] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedCategory, setSelectedCategory] = useState('all')

	useEffect(() => {
		loadArticles()
	}, [selectedCategory])

	const loadArticles = async () => {
		try {
			setLoading(true)
			const params = selectedCategory !== 'all' ? { category: selectedCategory } : {}
			const data = await getArticlesList(params)
			setArticles(data)
		} catch (error) {
			console.error('Maqolalarni yuklashda xatolik:', error)
		} finally {
			setLoading(false)
		}
	}

	const getTitle = (article) => {
		const lang = i18n.language.split('-')[0].toLowerCase()
		return article[`title_${lang}`] || article.title_ru || article.title_en || ''
	}

	const getAbstract = (article) => {
		const lang = i18n.language.split('-')[0].toLowerCase()
		return article[`abstract_${lang}`] || article.abstract_ru || article.abstract_en || ''
	}

	const categories = [
		{ value: 'all', label: 'Barchasi' },
		{ value: 'international', label: 'Xalqaro' },
		{ value: 'local', label: 'Mahalliy' },
		{ value: 'scientific', label: 'Ilmiy' },
		{ value: 'analytical', label: 'Tahliliy' },
		{ value: 'practical', label: 'Amaliy' },
	]

	if (loading) {
		return (
			<section className='overflow-hidden py-6 px-4 md:px-12'>
				<div className='mx-auto mb-12 text-center text-[var(--navy-blue)]'>
					<h2 className='text-3xl md:text-4xl font-bold'>
						Xalqaro va mahalliy maqolalar
					</h2>
				</div>
				<div className='text-center py-10'>
					<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0078c2]'></div>
				</div>
			</section>
		)
	}

	return (
		<section className='overflow-hidden py-6 px-4 md:px-12' aria-labelledby='articles-title'>
			{/* Header */}
			<div className='mx-auto mb-12 text-center text-[var(--navy-blue)]'>
				<h2 id='articles-title' className='text-3xl md:text-4xl font-bold'>
					Xalqaro va mahalliy maqolalar
				</h2>
				<p className='mt-4 text-gray-600'>
					Ilmiy va amaliy maqolalar bilan tanishing
				</p>
			</div>

			{/* Category Filter */}
			<div className='container mx-auto mb-8'>
				<div className='flex flex-wrap gap-3 justify-center'>
					{categories.map((cat) => (
						<button
							key={cat.value}
							onClick={() => setSelectedCategory(cat.value)}
							className={`px-6 py-2 rounded-full transition-all duration-300 ${
								selectedCategory === cat.value
									? 'bg-[#0078c2] text-white shadow-lg'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							{cat.label}
						</button>
					))}
				</div>
			</div>

			{/* Articles Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto py-4 px-4'>
				{articles.length === 0 ? (
					<div className='col-span-full text-center py-12'>
						<p className='text-gray-500 text-lg'>Hozircha maqolalar mavjud emas</p>
					</div>
				) : (
					articles.map((article, index) => {
						const title = getTitle(article)
						const abstract = getAbstract(article)
						
						return (
							<motion.article
								key={article.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className='group rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white'
							>
								{/* Cover Image */}
								<div className='relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100'>
									{article.cover_image ? (
										<motion.img
											src={article.cover_image}
											alt={title}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center'>
											<FaFileAlt className='text-6xl text-blue-300' />
										</div>
									)}
									{article.is_featured && (
										<div className='absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
											⭐ Tanlangan
										</div>
									)}
								</div>

								{/* Content */}
								<div className='p-6'>
									{/* Category Badge */}
									<div className='mb-3'>
										<span className='inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full'>
											{categories.find(c => c.value === article.category)?.label || article.category}
										</span>
									</div>

									{/* Title */}
									<h3 className='text-xl font-semibold mb-2 text-gray-800 group-hover:text-[#0078c2] transition-colors duration-300 line-clamp-2'>
										{title}
									</h3>

									{/* Abstract */}
									<p className='text-gray-600 text-sm mb-4 line-clamp-3'>
										{abstract}
									</p>

									{/* Author */}
									{article.author && (
										<div className='mb-4 text-sm text-gray-500'>
											<span className='font-semibold'>Muallif:</span>{' '}
											{article.author.first_name && article.author.last_name
												? `${article.author.first_name} ${article.author.last_name}`
												: article.author.username}
										</div>
									)}

									{/* Stats */}
									<div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
										<div className='flex items-center gap-4'>
											<span className='flex items-center gap-1'>
												<FaEye className='text-blue-500' />
												{article.views}
											</span>
											<span className='flex items-center gap-1'>
												<FaDownload className='text-green-500' />
												{article.downloads}
											</span>
											<span className='flex items-center gap-1'>
												<FaHeart className='text-red-500' />
												{article.likes}
											</span>
										</div>
									</div>

									{/* Read More Button */}
									<Link
										to={`/articles/${article.id}`}
										className='block w-full text-center bg-[#0078c2] text-white py-2 px-4 rounded-lg hover:bg-[#005a94] transition-colors duration-300'
									>
										Batafsil o'qish
									</Link>
								</div>
							</motion.article>
						)
					})
				)}
			</div>

			{/* Submit Article CTA */}
			<div className='container mx-auto mt-12 text-center'>
				<div className='bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl'>
					<h3 className='text-2xl font-bold text-gray-800 mb-4'>
						O'z maqolangizni joylashtiring!
					</h3>
					<p className='text-gray-600 mb-6'>
						Ilmiy yoki amaliy maqolangizni platformaga yuklang va boshqalar bilan baham ko'ring
					</p>
					<Link
						to='/submit-article'
						className='inline-block bg-[#0078c2] text-white px-8 py-3 rounded-lg hover:bg-[#005a94] transition-colors duration-300 font-semibold'
					>
						Maqola yuborish
					</Link>
				</div>
			</div>
		</section>
	)
}

