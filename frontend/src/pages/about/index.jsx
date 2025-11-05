import { aboutData } from '@/datatest/aboutData'
import { motion } from 'framer-motion'
import {
	FaAward,
	FaEnvelope,
	FaHandshake,
	FaLightbulb,
	FaPhone,
	FaRocket,
	FaShieldAlt,
	FaStar,
	FaUsers,
	FaLeaf,
	FaMapMarkerAlt
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function AboutPage() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language

	// Icon mapping for values
	const getValueIcon = iconName => {
		const icons = {
			innovation: <FaLightbulb className='text-4xl' />,
			teamwork: <FaUsers className='text-4xl' />,
			responsibility: <FaShieldAlt className='text-4xl' />,
			development: <FaRocket className='text-4xl' />,
			sustainability: <FaLeaf className='text-4xl' />,
			excellence: <FaStar className='text-4xl' />
		}
		return icons[iconName] || <FaLightbulb className='text-4xl' />
	}

	return (
		<div className='w-full overflow-hidden relative z-0'>
			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className='relative bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900 text-white py-12 md:py-20 px-4 md:px-12'
			>
				<div className='absolute inset-0 bg-[url("/images/ung1.png")] bg-cover bg-center opacity-10 pointer-events-none' />
				<div className='container mx-auto relative'>
					<motion.div
						initial={{ y: 30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className='max-w-4xl mx-auto text-center'
					>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>
							{aboutData.hero[currentLang].title}
						</h1>
						<p className='text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 text-blue-100'>
							{aboutData.hero[currentLang].subtitle}
						</p>
						<p className='text-base sm:text-lg text-blue-200 leading-relaxed px-2'>
							{aboutData.hero[currentLang].description}
						</p>
					</motion.div>
				</div>
			</motion.section>

			{/* Stats Section */}
			<section className='py-10 md:py-16 px-4 md:px-12 bg-white dark:bg-gray-900'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
						{aboutData.stats.map((stat, index) => (
							<motion.div
								key={stat.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className='text-center p-3 md:p-0'
							>
								<div className='text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-2'>
									{stat.value}
								</div>
								<div className='text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400'>
									{stat.label[currentLang]}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Mission & Vision Section */}
			<section className='py-10 md:py-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-800'>
				<div className='container mx-auto max-w-6xl'>
					<div className='grid md:grid-cols-2 gap-6 md:gap-12'>
						{/* Mission */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className='bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-shadow'
						>
							<div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6'>
								<div className='bg-gradient-to-br from-blue-500 to-blue-600 p-3 md:p-4 rounded-xl flex-shrink-0'>
									<FaRocket className='text-2xl md:text-3xl text-white' />
								</div>
								<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200'>
									{aboutData.mission[currentLang].title}
								</h2>
							</div>
							<p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base md:text-lg'>
								{aboutData.mission[currentLang].content}
							</p>
						</motion.div>

						{/* Vision */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className='bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-shadow'
						>
							<div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6'>
								<div className='bg-gradient-to-br from-purple-500 to-purple-600 p-3 md:p-4 rounded-xl flex-shrink-0'>
									<FaLightbulb className='text-2xl md:text-3xl text-white' />
								</div>
								<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200'>
									{aboutData.vision[currentLang].title}
								</h2>
							</div>
							<p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base md:text-lg'>
								{aboutData.vision[currentLang].content}
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='text-center mb-8 md:mb-12'
					>
						<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 px-2'>
							{t('about.valuesTitle')}
						</h2>
						<p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4'>
							{t('about.valuesDescription')}
						</p>
					</motion.div>

					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8'>
						{aboutData.values.map((value, index) => (
							<motion.div
								key={value.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className='bg-white dark:bg-gray-900 rounded-xl p-5 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group'
							>
								<div className='flex flex-col items-center text-center'>
									<div className='bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 md:p-4 rounded-full mb-3 md:mb-4 group-hover:scale-110 transition-transform'>
										<div className='text-3xl md:text-4xl'>
											{getValueIcon(value.icon)}
										</div>
									</div>
									<h3 className='text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 md:mb-3'>
										{value.title[currentLang]}
									</h3>
									<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed'>
										{value.description[currentLang]}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* History Timeline Section */}
			<section className='py-10 md:py-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-800'>
				<div className='container mx-auto max-w-5xl'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='text-center mb-8 md:mb-12'
					>
						<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 px-2'>
							{t('about.historyTitle')}
						</h2>
						<p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg px-4'>
							{t('about.historyDescription')}
						</p>
					</motion.div>

					<div className='relative pl-2 md:pl-0'>
						{/* Timeline line */}
						<div className='absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-300 dark:bg-blue-700' />

						{aboutData.history.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className={`relative mb-8 md:mb-12 ${
									index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2'
								}`}
							>
								{/* Year badge - outside the flex to avoid overlap */}
								<div className='absolute left-2 md:left-1/2 md:-translate-x-1/2 top-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold shadow-lg text-sm md:text-base whitespace-nowrap z-20'>
									{item.year}
								</div>

								{/* Content with proper margin to not overlap badge */}
								<div
									className={`ml-20 md:ml-0 ${
										index % 2 === 0 ? 'md:mr-16' : 'md:ml-16'
									} bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-shadow`}
								>
									<h3 className='text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
										{item.title[currentLang]}
									</h3>
									<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
										{item.description[currentLang]}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Achievements Section */}
			<section className='py-10 md:py-16 px-4 md:px-12'>
				<div className='container mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='text-center mb-8 md:mb-12'
					>
						<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 px-2'>
							{t('about.achievementsTitle')}
						</h2>
						<p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4'>
							{t('about.achievementsDescription')}
						</p>
					</motion.div>

					<div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8'>
						{aboutData.achievements.map((achievement, index) => (
							<motion.div
								key={achievement.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className='bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4 md:p-6 hover:shadow-xl transition-shadow'
							>
								<div className='flex justify-center mb-3 md:mb-4'>
									<FaAward className='text-5xl md:text-6xl text-yellow-500' />
								</div>
								<h3 className='text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 text-center'>
									{achievement.title[currentLang]}
								</h3>
								<p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-2'>
									{achievement.organization[currentLang]}
								</p>
								<p className='text-sm font-semibold text-blue-600 text-center'>
									{achievement.year}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section className='py-10 md:py-16 px-4 md:px-12 bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900 text-white'>
				<div className='container mx-auto max-w-4xl'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='text-center mb-8 md:mb-12'
					>
						<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 px-2'>
							{aboutData.contact[currentLang].title}
						</h2>
						<p className='text-base sm:text-lg md:text-xl text-blue-100 px-4'>
							{aboutData.contact[currentLang].description}
						</p>
					</motion.div>

					<div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className='bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 text-center hover:bg-white/20 transition-colors'
						>
							<FaEnvelope className='text-3xl md:text-4xl mx-auto mb-3 md:mb-4' />
							<h3 className='font-semibold mb-2 text-sm md:text-base'>{t('about.email')}</h3>
							<a
								href={`mailto:${aboutData.contact[currentLang].email}`}
								className='text-blue-200 hover:text-white transition-colors text-xs sm:text-sm break-all'
							>
								{aboutData.contact[currentLang].email}
							</a>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className='bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 text-center hover:bg-white/20 transition-colors'
						>
							<FaPhone className='text-3xl md:text-4xl mx-auto mb-3 md:mb-4' />
							<h3 className='font-semibold mb-2 text-sm md:text-base'>{t('about.phone')}</h3>
							<a
								href={`tel:${aboutData.contact[currentLang].phone}`}
								className='text-blue-200 hover:text-white transition-colors text-xs sm:text-sm'
							>
								{aboutData.contact[currentLang].phone}
							</a>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className='bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 text-center hover:bg-white/20 transition-colors sm:col-span-2 md:col-span-1'
						>
							<FaMapMarkerAlt className='text-3xl md:text-4xl mx-auto mb-3 md:mb-4' />
							<h3 className='font-semibold mb-2 text-sm md:text-base'>{t('about.address')}</h3>
							<p className='text-blue-200 text-xs sm:text-sm leading-relaxed'>
								{aboutData.contact[currentLang].address}
							</p>
						</motion.div>
					</div>
				</div>
			</section>
		</div>
	)
}

