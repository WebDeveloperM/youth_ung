import { useState, useEffect } from 'react'
import Comments from '@/components/comments'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt, FaShare, FaCog, FaEye, FaHeart } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTechnologyDetail } from '@/api/technologies'

export default function TechnologyDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLang = i18n.language
	const [technology, setTechnology] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadTechnology = async () => {
			try {
				console.log('🔄 Загружаем технологию с ID:', id)
				const data = await getTechnologyDetail(id)
				console.log('✅ Технология загружена:', data)
				console.log('🆔 Technology ID:', data?.id)
				setTechnology(data)
			} catch (error) {
				console.error('❌ Error loading technology:', error)
			} finally {
				setLoading(false)
			}
		}
		loadTechnology()
	}, [id])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
			</div>
		)
	}

	if (!technology) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center gap-4'>
					<FaCog className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>Texnologiya topilmadi</h2>
					<Link to='/technologies' className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors'>
						<FaArrowLeft /> Orqaga
					</Link>
				</motion.div>
			</div>
		)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ 
				title: technology[`title_${currentLang}`] || technology.title_ru, 
				text: 'Texnologiya', 
				url: window.location.href 
			}).catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert('Havola nusxalandi!')
		}
	}

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'>
			<Link to='/technologies' className='inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4 md:mb-6 font-semibold transition-colors group'>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				Orqaga
			</Link>

			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{technology.category}
				</span>
				<button onClick={handleShare} className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
					<FaShare /> Bo'lishish
				</button>
			</motion.div>

			<motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white leading-tight'>
				{technology[`title_${currentLang}`] || technology.title_ru}
			</motion.h1>

			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className='flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-sm md:text-base'>
				<span className='inline-flex items-center gap-2'>
					<FaCalendarAlt className='text-cyan-600 dark:text-cyan-400' /> 
					{new Date(technology.date).toLocaleDateString('ru-RU')}
				</span>
				<span className='inline-flex items-center gap-2'>
					<FaEye className='text-cyan-600 dark:text-cyan-400' /> 
					{technology.views} ko'rishlar
				</span>
				<span className='inline-flex items-center gap-2'>
					<FaHeart className='text-red-500' /> 
					{technology.likes} yoqdi
				</span>
			</motion.div>

			{technology.image && (
				<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className='relative w-full h-72 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-8 md:mb-12 group'>
					<img src={technology.image} alt={technology[`title_${currentLang}`] || technology.title_ru} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' />
					<div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
				</motion.div>
			)}

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className='prose prose-lg max-w-none mb-10 md:mb-16 dark:prose-invert'>
				<p className='text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium'>
					{technology[`short_description_${currentLang}`] || technology.short_description_ru}
				</p>
				<div 
					className='text-gray-700 dark:text-gray-300' 
					dangerouslySetInnerHTML={{ __html: technology[`content_${currentLang}`] || technology.content_ru }} 
				/>
			</motion.div>

			{technology && technology.id ? (
				<>
					{console.log('🎯 Рендерим Comments с ID:', technology.id)}
					<Comments contentType="technology" objectId={technology.id} />
				</>
			) : (
				console.log('⚠️ Technology или ID отсутствует:', { technology, id: technology?.id })
			)}
		</motion.section>
	)
}

