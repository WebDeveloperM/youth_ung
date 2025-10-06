import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const menuItems = [
	{
		title: 'Biz haqimizda',
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: 'Yangiliklar',
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: 'Loyiha va Innovatsiyalar',
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: 'Jamoa',
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: "O'qish, malaka oshirish va rivojlanish",
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: 'Karyera',
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: 'Amaliyot',
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: "G'oyalar",
		links: [
			{ label: 'Yangiliklar', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
	{
		title: 'Imkoniyatlar',
		links: [
			{ label: '1', href: '/' },
			{ label: 'Loyiha va Innovatsiyalar', href: '/' },
			{ label: 'Jamoa', href: '/' },
		],
	},
]

export function Navbar() {
	return (
		<div className='navbar'>
			<NavigationMenu viewport={false}>
				<NavigationMenuList>
					{menuItems.map(({ title, links }) => (
						<NavigationMenuItem key={title}>
							<NavigationMenuTrigger>{title}</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className='grid w-[300px] gap-4'>
									{links.map(({ label, href }) => (
										<li key={label}>
											<NavigationMenuLink asChild>
												<a href={href}>{label}</a>
											</NavigationMenuLink>
										</li>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}
