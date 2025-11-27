import Comments from '@/components/comments'
import { projectsData } from '@/datatest/projectsData'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt, FaDollarSign, FaMapMarkerAlt, FaShare, FaUsers, FaChartLine, FaRocket } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ProjectDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLang = i18n.language
	const project = projectsData.find(item => item.id === Number(id))

	if (!project) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center gap-4'>
					<FaRocket className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>{t('projects.notFound')}</h2>
					<Link to='/projects' className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'>
						<FaArrowLeft /> {t('projects.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ title: project.title[currentLang], text: t('projects.shareText'), url: window.location.href }).catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert(t('projects.linkCopied'))
		}
	}

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'>
			<Link to='/projects' className='inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 mb-4 md:mb-6 font-semibold transition-colors group'>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('projects.back')}
			</Link>

			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'>
				<span className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
					{t(`projects.status.${project.status}`)}
				</span>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{t(`projects.category.${project.category}`)}
				</span>
			</motion.div>

			<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight'>
				{project.title[currentLang]}
			</motion.h1>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8 pb-6 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-green-50 dark:bg-green-950/30 rounded-xl'>
					<FaDollarSign size={24} className='text-green-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('projects.budget')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{project.budget}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl'>
					<FaCalendarAlt size={24} className='text-blue-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('projects.duration')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{project.duration}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl'>
					<FaUsers size={24} className='text-purple-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('projects.team')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{project.team} {t('projects.people')}</span>
					</div>
				</div>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-red-50 dark:bg-red-950/30 rounded-xl'>
					<FaMapMarkerAlt size={24} className='text-red-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>{t('projects.location')}</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{project.location}</span>
					</div>
				</div>
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='flex justify-between items-center mb-4 md:mb-6'>
				<div className='flex-1'>
					<div className='flex justify-between items-center mb-2'>
						<span className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
							<FaChartLine className='text-orange-500' />
							{t('projects.progress')}
						</span>
						<span className='text-sm font-bold text-purple-600 dark:text-purple-400'>{project.progress}%</span>
					</div>
					<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
						<div className='bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500' style={{ width: `${project.progress}%` }}></div>
					</div>
				</div>
				<button onClick={handleShare} className='ml-4 flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm' aria-label={t('projects.share')}>
					<FaShare size={14} />
					{t('projects.share')}
				</button>
			</motion.div>

			<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className='relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl'>
				<img src={project.image} alt={project.title[currentLang]} className='w-full max-h-[400px] md:max-h-[600px] object-cover' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50 dark:prose-blockquote:bg-purple-950/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-a:text-purple-600 hover:prose-a:text-purple-700 mb-8 md:mb-12' dangerouslySetInnerHTML={{ __html: project.content[currentLang] }} />

			{project.status === 'active' && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className='bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white mb-8 md:mb-12'>
					<h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4'>{t('projects.joinProject')}</h3>
					<p className='text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90'>{t('projects.joinDescription')}</p>
					<Link to='/jobs' className='inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'>
						{t('projects.viewVacancies')} →
					</Link>
				</motion.div>
			)}

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className='mt-8 md:mt-12'>
				<Comments contentType="project" objectId={project.id} />
			</motion.div>
		</motion.section>
	)
}

