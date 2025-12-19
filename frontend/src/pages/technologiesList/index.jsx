import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEye, FaHeart, FaCog } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTechnologiesList } from '@/api/technologies'

export default function TechnologiesList() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language
	const [technologies, setTechnologies] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadTechnologies = async () => {
			try {
				console.log('🔄 Загружаем технологии...')
				const data = await getTechnologiesList({ is_published: true })
				console.log('✅ Данные получены:', data)
				console.log('📊 Количество:', data?.length || 0)
				setTechnologies(data || [])
			} catch (error) {
				console.error('❌ Error loading technologies:', error)
			} finally {
				setLoading(false)
			}
		}
		loadTechnologies()
	}, [])

	// Сортировка по дате (новые сначала)
	const sortedTechnologies = [...technologies].sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	)
	
	console.log('🔢 Technologies:', technologies)
	console.log('📋 Sorted:', sortedTechnologies)

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
			</div>
		)
	}

	return (
		<section
			className='overflow-hidden py-6 px-4 md:px-12'
			aria-labelledby='technologies-title'
		>
			{/* Hero Section */}
			<div className='mx-auto mb-12 text-center'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='flex flex-col items-center gap-4'
				>
					<div className='bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full'>
						<FaCog className='text-white text-4xl' />
					</div>
					<h1
						id='technologies-title'
						className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'
					>
						{t('technologies.title')}
					</h1>
					<p className='text-muted-foreground text-lg max-w-2xl'>
						{t('technologies.description')}
					</p>
				</motion.div>
			</div>

			{/* Technologies Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 container mx-auto py-4 px-4'>
				{sortedTechnologies.map((technology, index) => {
					return (
						<motion.article
							key={technology.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className='group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50 dark:from-gray-900 dark:to-cyan-950'
						>
							{/* Image */}
							<div className='relative h-56 overflow-hidden'>
								<motion.img
									src={technology.image || '/images/default.jpg'}
									alt={technology[`title_${currentLang}`] || technology.title_ru}
									className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-cyan-600/40 transition-all duration-500' />
								
								{/* Category Badge */}
								<div className='absolute top-4 left-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase'>
									{t(`technologies.categories.${technology.category}`) || technology.category}
								</div>
							</div>

							{/* Content */}
							<div className='p-6 flex flex-col justify-between'>
								<div className='flex flex-col gap-3'>
									<h3 className='text-xl font-bold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2'>
										{technology[`title_${currentLang}`] || technology.title_ru}
									</h3>
									<p className='text-muted-foreground text-sm mb-4 flex-1 leading-relaxed line-clamp-3'>
										{technology[`short_description_${currentLang}`] || technology.short_description_ru}
									</p>
								</div>

								{/* Stats and Date */}
								<div className='flex flex-col gap-3'>
									<div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400'>
										<div className='flex items-center gap-3'>
											<span className='flex items-center gap-1 hover:text-cyan-600 transition-colors'>
												<FaEye className='text-cyan-600' /> {technology.views}
											</span>
											<span className='flex items-center gap-1 hover:text-red-500 transition-colors'>
												<FaHeart className='text-red-500' /> {technology.likes}
											</span>
										</div>
										<span className='text-xs'>{technology.date}</span>
									</div>

									{/* Read More Button */}
									<Link
										to={`/technologies/${technology.id}`}
										className='mt-2 w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md'
									>
										{t('technologies.readMore')} →
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
				<div className='bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 max-w-4xl mx-auto text-white'>
					<h3 className='text-2xl md:text-3xl font-bold mb-4'>
						{t('technologies.cta.title')}
					</h3>
					<p className='text-lg mb-6 opacity-90'>
						{t('technologies.cta.description')}
					</p>
					<Link
						to='/about'
						className='inline-block px-8 py-3 bg-white text-cyan-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg'
					>
						{t('technologies.cta.button')} →
					</Link>
				</div>
			</motion.div>
		</section>
	)
}

