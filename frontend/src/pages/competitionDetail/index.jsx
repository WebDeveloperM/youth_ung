import Comments from '@/components/Comments'
import { competitionsData } from '@/datatest/competitionsData'
import { motion } from 'framer-motion'
import {
	FaArrowLeft,
	FaCalendarAlt,
	FaClock,
	FaTrophy,
	FaUsers,
	FaShare,
	FaCheckCircle,
	FaHourglassHalf,
	FaTimesCircle
} from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CompetitionDetail() {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLang = i18n.language

	const competition = competitionsData.find(item => item.id === Number(id))

	if (!competition) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='flex flex-col items-center gap-4'
				>
					<FaTrophy className='text-gray-400 text-6xl' />
					<h2 className='text-2xl font-bold text-gray-600'>
						{t('competitions.notFound')}
					</h2>
					<Link
						to='/competitions'
						className='mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
					>
						<FaArrowLeft /> {t('competitions.backToList')}
					</Link>
				</motion.div>
			</div>
		)
	}

	const getStatusIcon = status => {
		switch (status) {
			case 'active':
				return <FaCheckCircle className='text-green-500' />
			case 'upcoming':
				return <FaHourglassHalf className='text-yellow-500' />
			case 'closed':
				return <FaTimesCircle className='text-red-500' />
			default:
				return null
		}
	}

	const getStatusBadge = status => {
		const badges = {
			active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			upcoming:
				'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			closed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
		}
		return badges[status] || ''
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: competition.title[currentLang],
					text: t('competitions.shareText'),
					url: window.location.href
				})
				.catch(err => console.log('Error sharing:', err))
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert(t('competitions.linkCopied'))
		}
	}

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='container mx-auto py-6 md:py-10 px-4 max-w-5xl'
		>
			{/* Back Button */}
			<Link
				to='/competitions'
				className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 md:mb-6 font-semibold transition-colors group'
			>
				<FaArrowLeft className='group-hover:-translate-x-1 transition-transform' />
				{t('competitions.back')}
			</Link>

			{/* Status and Category Badges */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2 }}
				className='flex flex-wrap items-center gap-3 mb-4 md:mb-6'
			>
				<span
					className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getStatusBadge(
						competition.status
					)}`}
				>
					{getStatusIcon(competition.status)}
					{t(`competitions.status.${competition.status}`)}
				</span>
				<span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md'>
					{t(`competitions.category.${competition.category}`)}
				</span>
			</motion.div>

			{/* Title */}
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight'
			>
				{competition.title[currentLang]}
			</motion.h1>

			{/* Meta Information */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8 pb-6 border-b border-gray-200 dark:border-gray-700'
			>
				<div className='flex items-center gap-3 p-3 md:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl'>
					<FaCalendarAlt size={24} className='text-blue-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>
							{t('competitions.startDate')}
						</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
							{competition.startDate}
						</span>
					</div>
				</div>

				<div className='flex items-center gap-3 p-3 md:p-4 bg-red-50 dark:bg-red-950/30 rounded-xl'>
					<FaClock size={24} className='text-red-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>
							{t('competitions.deadline')}
						</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
							{competition.registrationDeadline}
						</span>
					</div>
				</div>

				<div className='flex items-center gap-3 p-3 md:p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl'>
					<FaUsers size={24} className='text-purple-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>
							{t('competitions.participants')}
						</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
							{competition.participants} {t('competitions.people')}
						</span>
					</div>
				</div>

				<div className='flex items-center gap-3 p-3 md:p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl'>
					<FaTrophy size={24} className='text-yellow-600 flex-shrink-0' />
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400 block'>
							{t('competitions.prize')}
						</span>
						<span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
							{competition.prize}
						</span>
					</div>
				</div>
			</motion.div>

			{/* Share Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className='flex justify-end mb-4 md:mb-6'
			>
				<button
					onClick={handleShare}
					className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm sm:text-base'
					aria-label={t('competitions.share')}
				>
					<FaShare size={14} />
					{t('competitions.share')}
				</button>
			</motion.div>

			{/* Main Image */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.6 }}
				className='relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl'
			>
				<img
					src={competition.image}
					alt={competition.title[currentLang]}
					className='w-full max-h-[400px] md:max-h-[600px] object-cover'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
			</motion.div>

			{/* Content */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7 }}
				className='prose prose-sm sm:prose-base md:prose-lg max-w-none 
					prose-headings:text-gray-800 dark:prose-headings:text-gray-200
					prose-p:text-gray-700 dark:prose-p:text-gray-300
					prose-strong:text-gray-900 dark:prose-strong:text-gray-100
					prose-li:text-gray-700 dark:prose-li:text-gray-300
					prose-img:rounded-xl prose-img:shadow-lg
					prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30
					prose-blockquote:rounded-r-lg prose-blockquote:py-2
					prose-a:text-blue-600 hover:prose-a:text-blue-700
					mb-8 md:mb-12'
				dangerouslySetInnerHTML={{ __html: competition.content[currentLang] }}
			/>

			{/* Registration CTA */}
			{competition.status !== 'closed' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-8 md:mb-12'
				>
					<h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4'>
						{t('competitions.registerNow')}
					</h3>
					<p className='text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90'>
						{t('competitions.registerDescription')}
					</p>
					<button className='px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base'>
						{t('competitions.registerButton')} →
					</button>
				</motion.div>
			)}

			{/* Related Competitions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.9 }}
				className='mt-12 md:mt-16 pt-8 border-t border-gray-200 dark:border-gray-700'
			>
				<h3 className='text-xl sm:text-2xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-200'>
					{t('competitions.relatedCompetitions')}
				</h3>
				<div className='grid sm:grid-cols-2 gap-4 md:gap-6'>
					{competitionsData
						.filter(
							item =>
								item.id !== competition.id &&
								item.category === competition.category
						)
						.slice(0, 2)
						.map(relatedCompetition => (
							<Link
								key={relatedCompetition.id}
								to={`/competitions/${relatedCompetition.id}`}
								className='group p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg bg-white dark:bg-gray-900'
							>
								<div className='flex gap-4'>
									<img
										src={relatedCompetition.image}
										alt={relatedCompetition.title[currentLang]}
										className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0'
									/>
									<div className='flex-1 min-w-0'>
										<h4 className='font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2'>
											{relatedCompetition.title[currentLang]}
										</h4>
										<div className='flex items-center gap-3 text-xs sm:text-sm text-gray-500'>
											<span className='flex items-center gap-1'>
												<FaUsers className='text-purple-600' />{' '}
												{relatedCompetition.participants}
											</span>
											<span className='flex items-center gap-1'>
												<FaTrophy className='text-yellow-600' />
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
				</div>
			</motion.div>

			{/* Comments Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1 }}
				className='mt-8 md:mt-12'
			>
				<Comments contentType="competition" objectId={competition.id} />
			</motion.div>
		</motion.section>
	)
}

