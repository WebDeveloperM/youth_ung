import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

const Footer = () => {
	const { t } = useTranslation()

	const partnerLinks = [
		{ name: 'BNPZ', href: '#' },
		{ name: 'GTL', href: '#' },
		{ name: 'MGNK', href: '#' },
	]

	const projectLinks = [{ name: t('footer.youthPolicy'), href: '#' }]

	const contactLinks = [
		{ name: t('footer.contactEmail'), href: '#' },
		{ name: t('footer.support'), href: '#' },
		{ name: t('footer.legal'), href: '#' },
	]

	return (
		<footer
			className=' text-[var(--muted-foreground)] py-16 border-t border-gray-200'
			role='contentinfo'
		>
			<div className='container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
				{/* Company Info & Socials */}
				<div className='flex flex-col space-y-4 lg:col-span-1'>
					<h3 className='font-bold text-4xl text-[var(--navy-blue)]'>
						{t('footer.company')}
					</h3>
					<p className='text-[var(--muted-foreground)] text-sm max-w-xs'>
						{t('footer.description')}
					</p>
					<div className='flex space-x-5 text-[var(--muted-foreground)] mt-4'>
						<a
							href='#'
							className='hover:text-gray-800 transition-colors'
							aria-label="O'zbekneftgaz Instagram sahifasi"
						>
							<FaInstagram size={22} />
						</a>
						<a
							href='#'
							className='hover:text-gray-800 transition-colors'
							aria-label="O'zbekneftgaz LinkedIn sahifasi"
						>
							<FaLinkedin size={22} />
						</a>
						<a
							href='#'
							className='hover:text-gray-800 transition-colors'
							aria-label="O'zbekneftgaz X Twitter sahifasi"
						>
							<FaXTwitter size={22} />
						</a>
					</div>
				</div>

				{/* Navigation Sections */}
				<div className='grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-1 lg:col-span-3'>
					<nav aria-label={t('footer.partners')}>
						<h4 className='font-semibold text-[var(--muted-foreground)] mb-4'>
							{t('footer.partners')}
						</h4>
						<ul className='space-y-3 text-sm'>
							{/* Ma'lumotlar dinamik ravishda render qilinadi */}
							{partnerLinks.map(link => (
								<li key={link.name}>
									<a
										href={link.href}
										className='hover:text-blue-600 transition-colors'
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-label={t('footer.projects')}>
						<h4 className='font-semibold text-[var(--muted-foreground)] mb-4'>
							{t('footer.projects')}
						</h4>
						<ul className='space-y-3 text-sm'>
							{projectLinks.map(link => (
								<li key={link.name}>
									<a
										href={link.href}
										className='hover:text-blue-600 transition-colors'
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-label={t('footer.contact')}>
						<h4 className='font-semibold text-[var(--muted-foreground)] mb-4'>
							{t('footer.contact')}
						</h4>
						<ul className='space-y-3 text-sm'>
							{contactLinks.map(link => (
								<li key={link.name}>
									<a
										href={link.href}
										className='hover:text-blue-600 transition-colors'
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>

			{/* Copyright Section */}
			<div className='container mx-auto px-6 mt-16 text-center text-[var(--muted-foreground)] text-xs'>
				<p>
					&copy; {new Date().getFullYear()} {t('footer.company')}.{' '}
					{t('footer.rights')}
				</p>
			</div>
		</footer>
	)
}

export default Footer
