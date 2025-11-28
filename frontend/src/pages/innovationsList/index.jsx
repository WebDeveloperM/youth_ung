import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEye, FaHeart, FaLightbulb } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getInnovationsList } from '@/api/innovations'

export default function InnovationsList() {
	const { t, i18n } = useTranslation()
	const [innovations, setInnovations] = useState([])
	const [loading, setLoading] = useState(true)

	// Нормализуем язык (uz-UZ -> uz)
	const currentLang = i18n.language.split('-')[0]

	// Загружаем инновации с API
	useEffect(() => {
		const loadInnovations = async () => {
			try {
				setLoading(true)
				const data = await getInnovationsList()
				setInnovations(Array.isArray(data) ? data : [])
			} catch (error) {
				console.error('Ошибка загрузки инноваций:', error)
				setInnovations([])
			} finally {
				setLoading(false)
			}
		}

		loadInnovations()
	}, [])

	// Функция для получения заголовка на текущем языке
	const getTitle = (innovation) => {
		return innovation[`title_${currentLang}`] || innovation.title_ru || innovation.title_uz || innovation.title_en || ''
	}

	// Функция для получения контента на текущем языке
	const getContent = (innovation) => {
		return innovation[`content_${currentLang}`] || innovation.content_ru || innovation.content_uz || innovation.content_en || ''
	}

	// Сортировка по дате (новые сначала)
	const sortedInnovations = [...innovations].sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	)

	if (loading) {
		return (
			<div className='w-full min-h-screen flex items-center justify-center'>
				<div className='text-xl'>Загрузка...</div>
			</div>
		)
	}

	return (
		<section
			className='overflow-hidden py-6 px-4 md:px-12'
			aria-labelledby='innovations-title'
		>
			{/* Hero Section */}
			<div className='mx-auto mb-12 text-center'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='flex flex-col items-center gap-4'
				>
					<div className='bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full'>
						<FaLightbulb className='text-white text-4xl' />
					</div>
					<h1
						id='innovations-title'
						className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
					>
						{t('innovations.title')}
					</h1>
					<p className='text-muted-foreground text-lg max-w-2xl'>
						{t('innovations.description')}
					</p>
				</motion.div>
			</div>

			{/* Innovations Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 container mx-auto py-4 px-4'>
				{sortedInnovations.map((innovation, index) => {
					return (
						<motion.article
							key={innovation.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className='group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950'
						>
							{/* Image */}
							<div className='relative h-56 overflow-hidden'>
								<motion.img
									src={innovation.image || '/images/placeholder.jpg'}
									alt={getTitle(innovation)}
									className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-blue-600/40 transition-all duration-500' />
								
								{/* Category Badge */}
								<div className='absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase'>
									{t(`innovations.categories.${innovation.category}`)}
								</div>
							</div>

							{/* Content */}
							<div className='p-6 flex flex-col justify-between'>
								<div className='flex flex-col gap-3'>
									<h3 className='text-xl font-bold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2'>
										{getTitle(innovation)}
									</h3>
									<p
										className='text-muted-foreground text-sm mb-4 flex-1 leading-relaxed line-clamp-3'
										dangerouslySetInnerHTML={{
											__html: getContent(innovation).substring(0, 150) + '...',
										}}
									/>
								</div>

								{/* Stats and Date */}
								<div className='flex flex-col gap-3'>
									<div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400'>
										<div className='flex items-center gap-3'>
											<span className='flex items-center gap-1 hover:text-blue-600 transition-colors'>
												<FaEye className='text-blue-600' /> {innovation.views}
											</span>
											<span className='flex items-center gap-1 hover:text-red-500 transition-colors'>
												<FaHeart className='text-red-500' /> {innovation.likes}
											</span>
										</div>
										<span className='text-xs'>{innovation.date}</span>
									</div>

									{/* Read More Button */}
									<Link
										to={`/innovations/${innovation.id}`}
										className='mt-2 w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md'
									>
										{t('innovations.readMore')} →
									</Link>
								</div>
							</div>
						</motion.article>
					)
				})}
			</div>

			{/* Call to Action */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className='mt-16 text-center'
			>
				<div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-4xl mx-auto text-white'>
					<h3 className='text-2xl md:text-3xl font-bold mb-4'>
						{t('innovations.cta.title')}
					</h3>
					<p className='text-lg mb-6 opacity-90'>
						{t('innovations.cta.description')}
					</p>
					<Link
						to='/login'
						className='inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg'
					>
						{t('innovations.cta.button')} →
					</Link>
				</div>
			</motion.div>
		</section>
	)
}

