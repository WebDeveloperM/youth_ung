import { Button } from '@/components/ui/button'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
} from '@/components/ui/sheet'
import {
	BarChart,
	Briefcase,
	Coins,
	Crosshair,
	FileText,
	Globe,
	GraduationCap,
	Info,
	Lightbulb,
	MenuIcon,
	Microscope,
	Rocket,
	Settings,
	Trophy,
	Users,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ColorModeToggle from '../colorModeSelector'
import { LanguageSelector } from '../langSelector'
import { Useravatar } from '../userAvatar'

export default function Navbar() {
	const { t } = useTranslation()
	const [isScrolled, setIsScrolled] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const navHeight = 64

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const menuItems = [
		{ title: t('menu.about'), url: '/about', icon: <Info size={18} /> },
		{
			title: t('menu.news'),
			subMenu: [
				{
					title: t('menu.sub.latestNews'),
					url: '/news',
					icon: <Globe size={18} />,
				},
				{
					title: t('menu.sub.technologies'),
					url: '/technologies',
					icon: <Settings size={18} />,
				},
				{
					title: t('menu.sub.innovations'),
					url: '/innovations',
					icon: <Lightbulb size={18} />,
				},
			],
		},
		{
			title: t('menu.projects'),
			subMenu: [
				{
					title: t('menu.sub.newProjects'),
					url: '/projects',
					icon: <Rocket size={18} />,
				},
				{
					title: t('menu.sub.research'),
					url: '/research',
					icon: <Microscope size={18} />,
				},
				{
					title: t('menu.sub.results'),
					url: '/results',
					icon: <BarChart size={18} />,
				},
			],
		},
		{
			title: t('menu.career'),
			subMenu: [
				{
					title: t('menu.sub.jobs'),
					url: '/jobs',
					icon: <Briefcase size={18} />,
				},
				{
					title: t('menu.sub.internship'),
					url: '/internships',
					icon: <GraduationCap size={18} />,
				},
				{ title: t('menu.sub.team'), url: '/team', icon: <Users size={18} /> },
			],
		},
		{
			title: t('menu.opportunities'),
			subMenu: [
				{
					title: t('menu.sub.scholarships'),
					url: '/scholarships',
					icon: <Coins size={18} />,
				},
				{
					title: t('menu.sub.grants'),
					url: '/grants',
					icon: <Crosshair size={18} />,
				},
				{
					title: t('menu.sub.competitions'),
					url: '/competitions',
					icon: <Trophy size={18} />,
				},
			],
		},
		{
			title: t('articles.title'),
			url: '/articles',
			icon: <FileText size={18} />,
		},
	]

	return (
		<nav
			className={`top-0 left-0 right-0 border-b z-[100] px-6 md:px-16 py-3 flex justify-between items-center transition-all duration-300 backdrop-blur-md ${
				isScrolled || isOpen
					? 'fixed bg-background/80 shadow-md border-b animate-in fade-in slide-in-from-top-2'
					: 'absolute bg-background/80 border-transparent'
			}`}
		>
			{/* LOGO */}
			<Link
				to='/'
				className='flex items-center gap-2 shrink-0 relative z-[110]'
			>
				<img
					src='/Logo1.png'
					alt='logo'
					className='h-10 md:h-12 w-auto object-contain'
				/>
				<div className='flex flex-col leading-none'>
					<span className='font-bold font-[montserrat] text-lg md:text-xl'>
						<span className='text-primary'>{t('brand.part1')}</span>
						<span className='text-foreground ml-1 font-medium'>
							{t('brand.part2')}
						</span>
					</span>
					<span className='text-[10px] uppercase text-muted-foreground font-semibold tracking-[0.2em]'>
						{t('brand.subtitle', 'Portal')}
					</span>
				</div>
			</Link>
			{/* DESKTOP MENU */}
			<div className='hidden xl:flex items-center gap-2'>
				<NavigationMenu viewport={false}>
					<NavigationMenuList>
						{menuItems.map(item => (
							<NavigationMenuItem key={item.title}>
								{item.subMenu ? (
									<>
										<NavigationMenuTrigger className='bg-transparent text-sm font-medium hover:text-primary transition-colors'>
											{item.title}
										</NavigationMenuTrigger>
										<NavigationMenuContent>
											<ul className='p-3 w-[240px] grid gap-1'>
												{item.subMenu.map(sub => (
													<li key={sub.title}>
														<Link
															to={sub.url}
															className='flex items-center gap-3 p-2 rounded-md hover:bg-accent text-sm font-medium transition-colors'
														>
															<span className='text-muted-foreground'>
																{sub.icon}
															</span>
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
											className='px-4 py-2 text-sm font-medium hover:text-primary transition-colors'
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
			{/* RIGHT SIDE (Desktop) */}
			<div className='hidden xl:flex items-center gap-3'>
				<ColorModeToggle />
				<LanguageSelector />
				<div className='h-6 w-px bg-border mx-1' />
				<Useravatar />
			</div>
			{/* MOBILE MENU SECTION */}
			<div className='xl:hidden flex items-center gap-2 relative z-[110] '>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='text-foreground focus-visible:ring-0 '
						>
							{isOpen ? <X size={24} /> : <MenuIcon size={24} />}
						</Button>
					</SheetTrigger>

					<SheetContent
						side='right'
						style={{
							top: `${navHeight}px`,
							height: `calc(100vh - ${navHeight}px)`,
						}}
						className={`
              [&>button]:hidden p-0 border-t bg-card shadow-2xl flex flex-col bg-background/80
            `}
					>
						<SheetHeader>
							{/* Mobile Nav Header */}
							<div className='px-6 py-4 border-b flex items-center justify-center bg-muted/20'>
								<ColorModeToggle />
								<LanguageSelector />
							</div>
						</SheetHeader>

						{/* Scrollable Links */}
						<div className='flex-1 overflow-y-auto px-6 py-8'>
							<div className='flex flex-col gap-8'>
								{menuItems.map(item =>
									item.subMenu ? (
										<div key={item.title} className='space-y-4'>
											<h4 className='text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1'>
												{item.title}
											</h4>
											<div className='grid gap-3 ml-1 border-l-2 border-primary/10 pl-5'>
												{item.subMenu.map(sub => (
													<Link
														key={sub.title}
														to={sub.url}
														onClick={() => setIsOpen(false)}
														className='flex items-center gap-4 text-sm font-medium py-1 hover:text-primary transition-colors text-foreground'
													>
														<span className='text-primary/60'>{sub.icon}</span>
														{sub.title}
													</Link>
												))}
											</div>
										</div>
									) : (
										<Link
											key={item.title}
											to={item.url}
											onClick={() => setIsOpen(false)}
											className='flex gap-4 text-sm font-semibold px-1 hover:text-primary transition-colors text-foreground'
										>
											<span className='text-primary/60'>{item.icon}</span>
											{item.title}
										</Link>
									)
								)}
							</div>
						</div>
						<SheetFooter>
							{/* User Section at the bottom */}
							<div className='flex justify-center p-4 border-t bg-muted/20 shrink-0'>
								<Useravatar />
							</div>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}
