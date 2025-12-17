import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'

import { Link } from 'react-router-dom'

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { MdElectricBolt } from 'react-icons/md'
import ColorModeToggle from '../colorModeSelector'
import { LanguageSelector } from '../langSelector'
import { Useravatar } from '../userAvatar'
import { useState, useEffect } from 'react'
//Menu data
import {
	BarChart,
	Briefcase,
	Coins,
	Crosshair,
	FileText,
	Globe,
	GraduationCap,
	Lightbulb,
	MenuIcon,
	Microscope,
	Newspaper,
	Rocket,
	Settings,
	Trophy,
	Users,
} from 'lucide-react'

export default function Navbar() {
	const { t } = useTranslation()
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const menuItems = [
		{
			title: t('menu.about'),
			url: '/about'
		},
		{
			title: t('menu.news'),
			subMenu: [
				{
					title: t('menu.sub.latestNews'),
					url: '/news',
					icon: <Globe size={24} />,
				},
				{
					title: t('menu.sub.technologies'),
					url: '/technologies',
					icon: <Settings size={24} />,
				},
				{
					title: t('menu.sub.innovations'),
					url: '/innovations',
					icon: <Lightbulb size={24} />,
				},
			],
		},
		{
			title: t('menu.projects'),
			subMenu: [
				{
					title: t('menu.sub.newProjects'),
					url: '/projects',
					icon: <Rocket size={24} />,
				},
				{
					title: t('menu.sub.research'),
					url: '/research',
					icon: <Microscope size={24} />,
				},
				{
					title: t('menu.sub.results'),
					url: '/results',
					icon: <BarChart size={24} />,
				},
			],
		},
		{
			title: t('menu.career'),
			subMenu: [
				{ title: t('menu.sub.jobs'), url: '/jobs', icon: <Briefcase size={24} /> },
				{
					title: t('menu.sub.internship'),
					url: '/internships',
					icon: <GraduationCap size={24} />,
				},
				{ title: t('menu.sub.team'), url: '/team', icon: <Users size={24} /> },
			],
		},
		{
			title: t('menu.opportunities'),
			subMenu: [
				{
					title: t('menu.sub.scholarships'),
					url: '/scholarships',
					icon: <Coins size={24} />,
				},
				{
					title: t('menu.sub.grants'),
					url: '/grants',
					icon: <Crosshair size={24} />,
				},
				{
					title: t('menu.sub.competitions'),
					url: '/competitions',
					icon: <Trophy size={24} />,
				},
			],
		},
		{
			title: 'Xalqaro va mahalliy maqolalar',
			url: '/articles',
			icon: <FileText size={24} />
		},
	]

	return (
		<nav 
			className={`sticky top-0 left-0 right-0 bg-[var(--navy-blue)] text-white backdrop-blur-md z-[100] px-6 md:px-16 py-4 flex justify-between items-center transition-all duration-300 ${
				isScrolled 
					? 'shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b border-gray-700/50' 
					: 'shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
			}`}
		>
			{/* LOGO */}
			<Link to='/' className='flex items-center gap-2'>
				<MdElectricBolt className='text-primary' size={28} />
				<span className='font-bold text-xl'>UNG Yoshlari</span>
			</Link>

			{/* DESKTOP MENU */}
			<div className='hidden md:flex items-center gap-6 py-1'>
				<NavigationMenu viewport={false}>
					<NavigationMenuList className='flex gap-4'>
						{menuItems.map(item => (
							<NavigationMenuItem key={item.title}>
								{item.subMenu ? (
									<>
										<NavigationMenuTrigger className='bg-transparent gap-1 pr-2 text-base font-medium hover:text-primary transition-colors'>
											{item.title}
										</NavigationMenuTrigger>
										<NavigationMenuContent>
											<ul className='p-4 space-y-2 min-w-[220px]'>
												{item.subMenu.map(sub => (
													<li key={sub.title}>
														<Link
															to={sub.url}
															className='flex items-center gap-3 p-3 rounded-md hover:bg-accent font-medium text-sm transition-colors'
														>
															{sub.icon && (
																<span className='text-muted-foreground shrink-0'>
																	{sub.icon}
																</span>
															)}
															<span className='whitespace-nowrap'>{sub.title}</span>
														</Link>
													</li>
												))}
											</ul>
										</NavigationMenuContent>
									</>
								) : (
									<NavigationMenuLink asChild>
										<Link
											to={item.url}
											className='px-3 py-2 text-base font-medium hover:text-primary transition-colors'
										>
											{item.title}
										</Link>
									</NavigationMenuLink>
								)}
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			{/* RIGHT SIDE BUTTONS */}
			<div className='gap-2 hidden md:flex items-center'>
				<ColorModeToggle />
				<LanguageSelector />
				<Useravatar />
			</div>
			{/* MOBILE MENU */}
			<div className='md:hidden '>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='ghost' size='icon'>
							<MenuIcon />
						</Button>
					</SheetTrigger>

					<SheetContent
						side='right'
						aria-describedby={undefined}
						className='p-0 flex flex-col h-full overflow-hidden transform transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full'
					>
						<AnimatePresence mode='wait'>
							<motion.div
								key='mobileMenu'
								initial={{ opacity: 0, x: 100 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 100 }}
								transition={{ duration: 0.3, ease: 'easeInOut' }}
								className='flex flex-col h-full'
							>
								{/* HEADER (fixed top) */}
								<div className='flex bg-[var(--navy-blue)] text-white justify-start flex-col px-6 py-4 border-b'>
									<div className='flex items-center gap-2'>
										<MdElectricBolt className='text-primary' size={22} />
										<SheetTitle className='text-lg text-white font-semibold'>
											UNG Yoshlari
										</SheetTitle>
									</div>
									<div className='flex justify-end items-center'>
										<ColorModeToggle />
										<LanguageSelector />
									</div>
								</div>

								{/* SCROLLABLE MENU */}
								<div className='flex-1 overflow-y-auto px-6 py-6 space-y-4'>
									{menuItems.map(item =>
										item.subMenu ? (
											<div key={item.title}>
												<p className='font-semibold mb-2'>{item.title}</p>
												<ul className='ml-4 space-y-2'>
													{item.subMenu.map(sub => (
														<li key={sub.title}>
															<Link
																to={sub.url}
																className='flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors'
															>
																{sub.icon}
																{sub.title}
															</Link>
														</li>
													))}
												</ul>
											</div>
										) : (
											<Link
												key={item.title}
												to={item.url}
												className='block text-base hover:text-primary transition-colors'
											>
												{item.title}
											</Link>
										)
									)}
								</div>

								{/* FOOTER (fixed bottom) */}
								<div className='px-6 py-4 border-t flex flex-col gap-3 relative overflow-visible'>
									<Useravatar />
								</div>
							</motion.div>
						</AnimatePresence>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}
