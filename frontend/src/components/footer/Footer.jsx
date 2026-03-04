import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Footer = () => {
	const { t } = useTranslation()

	const platformLinks = [
		{ label: t('menu.about'), to: '/about' },
		{ label: t('menu.sub.latestNews'), to: '/news' },
		{ label: t('menu.sub.innovations'), to: '/innovations' },
		{ label: t('menu.sub.technologies'), to: '/technologies' },
		{ label: t('menu.sub.research'), to: '/research' },
	]

	const careerLinks = [
		{ label: t('menu.sub.jobs'), to: '/jobs' },
		{ label: t('menu.sub.internship'), to: '/internships' },
		{ label: t('menu.sub.scholarships'), to: '/scholarships' },
		{ label: t('menu.sub.grants'), to: '/grants' },
		{ label: t('menu.sub.competitions'), to: '/competitions' },
	]

	return (
		<footer
			className='text-muted-foreground py-16 border-t border-gray-200 dark:border-gray-800'
			role='contentinfo'
		>
			<div className='container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12'>
				{/* Company Info & Socials */}
				<div className='flex flex-col space-y-4'>
					<h3 className='font-bold text-3xl text-(--navy-blue)'>
						{t('footer.company')}
					</h3>
					<p className='text-sm max-w-xs leading-relaxed'>
						{t('footer.description')}
					</p>
					<div className='flex space-x-4 mt-2'>
						<a
							href='https://instagram.com'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-pink-500 transition-colors'
							aria-label="O'zbekneftgaz Instagram sahifasi"
						>
							<FaInstagram size={22} />
						</a>
						<a
							href='https://linkedin.com'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-blue-600 transition-colors'
							aria-label="O'zbekneftgaz LinkedIn sahifasi"
						>
							<FaLinkedin size={22} />
						</a>
						<a
							href='https://x.com'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-gray-800 dark:hover:text-gray-300 transition-colors'
							aria-label="O'zbekneftgaz X Twitter sahifasi"
						>
							<FaXTwitter size={22} />
						</a>
					</div>
				</div>

				{/* Platform links */}
				<nav aria-label={t('menu.projects')}>
					<h4 className='font-semibold text-(--navy-blue) dark:text-white mb-5 text-sm uppercase tracking-wider'>
						{t('menu.projects')}
					</h4>
					<ul className='space-y-3 text-sm'>
						{platformLinks.map(link => (
							<li key={link.to}>
								<Link
									to={link.to}
									className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* Career & Opportunities */}
				<nav aria-label={t('menu.opportunities')}>
					<h4 className='font-semibold text-(--navy-blue) dark:text-white mb-5 text-sm uppercase tracking-wider'>
						{t('menu.opportunities')}
					</h4>
					<ul className='space-y-3 text-sm'>
						{careerLinks.map(link => (
							<li key={link.to}>
								<Link
									to={link.to}
									className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			{/* Copyright */}
			<div className='container mx-auto px-6 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-xs'>
				<p>
					&copy; {new Date().getFullYear()} {t('footer.company')}.{' '}
					{t('footer.rights')}
				</p>
			</div>
		</footer>
	)
}

export default Footer
