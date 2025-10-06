import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import ColorModeToggle from '../colorModeSelector'
import { LanguageSelector } from '../langSelector'
import { Navbar } from '../navbar'

export function Header() {
	const navigate = useNavigate()

	return (
		<div className='header'>
			<div className='m-3'>LOGO</div>
			<Navbar />

			<div className='flex gap-3 m-3 items-center'>
				<ColorModeToggle />
				<LanguageSelector />
				<Button
					variant='outline'
					size='lg'
					className='text-md font-[500] text-blue-950 dark:text-white'
					onClick={() => navigate('/login')}
				>
					Kirish
				</Button>
			</div>
		</div>
	)
}
