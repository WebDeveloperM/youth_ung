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
//Menu data
import {
	BarChart,
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

	const menuItems = [
		{
			title: t('menu.about'),
			subMenu: [
				{
					title: t('menu.sub.latestNews'),
					url: '/login',
					icon: <Newspaper size={24} />,
				},
				{
					title: t('menu.sub.innovations'),
					url: '/',
					icon: <Lightbulb size={24} />,
				},
				{ title: t('menu.sub.team'), url: '/', icon: <Users size={24} /> },
			],
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
					url: '/',
					icon: <Settings size={24} />,
				},
				{
					title: t('menu.sub.innovations'),
					url: '/',
					icon: <Lightbulb size={24} />,
				},
			],
		},
		{
			title: t('menu.projects'),
			subMenu: [
				{
					title: t('menu.sub.newProjects'),
					url: '/',
					icon: <Rocket size={24} />,
				},
				{
					title: t('menu.sub.research'),
					url: '/',
					icon: <Microscope size={24} />,
				},
				{
					title: t('menu.sub.results'),
					url: '/',
					icon: <BarChart size={24} />,
				},
			],
		},
		{
			title: t('menu.career'),
			subMenu: [
				{ title: t('menu.sub.jobs'), url: '/', icon: <FileText size={24} /> },
				{
					title: t('menu.sub.internship'),
					url: '/',
					icon: <GraduationCap size={24} />,
				},
				{ title: t('menu.sub.team'), url: '/', icon: <Users size={24} /> },
			],
		},
		{
			title: t('menu.opportunities'),
			subMenu: [
				{
					title: t('menu.sub.scholarships'),
					url: '/',
					icon: <Coins size={24} />,
				},
				{
					title: t('menu.sub.grants'),
					url: '/',
					icon: <Crosshair size={24} />,
				},
				{
					title: t('menu.sub.competitions'),
					url: '/',
					icon: <Trophy size={24} />,
				},
			],
		},
	]

	return (
		<nav className='m-3 md:m-5 rounded-xl bg-[var(--navy-blue)] text-xl font-bold text-white top-0 left-0 backdrop-blur-md border-b z-50 px-6 md:px-16 py-4 flex justify-between items-center'>
			{/* LOGO */}
			<Link to='/' className='flex items-center gap-2'>
				<MdElectricBolt className='text-primary' size={24} />
				<span className='font-bold text-2xl'>UNG Yoshlari</span>
			</Link>

			{/* DESKTOP MENU */}
			<div className='hidden md:flex items-center gap-6 py-1'>
				<NavigationMenu viewport={false}>
					<NavigationMenuList className='flex gap-4'>
						{menuItems.map(item => (
							<NavigationMenuItem key={item.title}>
								{item.subMenu ? (
									<>
										<NavigationMenuTrigger className='bg-transparent gap-1 pr-2'>
											{item.title}
										</NavigationMenuTrigger>
										<NavigationMenuContent>
											<ul className='p-4 space-y-2'>
												{item.subMenu.map(sub => (
													<li key={sub.title}>
														<Link
															to={sub.url}
															className='flex items-center gap-4 p-2 rounded-md hover:bg-accent font-medium'
														>
															{sub.icon && (
																<span className='text-muted-foreground'>
																	{sub.icon}
																</span>
															)}
															{sub.title}
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
											className='px-3 py-2 hover:text-primary'
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
