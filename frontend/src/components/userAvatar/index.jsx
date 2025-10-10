import { Avatar } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, User, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
export function Useravatar() {
	const navigate = useNavigate()
	return (
		<div className='flex items-center gap-1 justify-center'>
			{' '}
			<Button
				variant='outline'
				size='lg'
				className='m-2 text-md font-[500] text-blue-950 dark:text-white'
				onClick={() => navigate('/login')}
			>
				Log In
			</Button>
			<Button
				variant='default'
				size='lg'
				className='m-2 text-md font-[500] text-white dark:text-white'
				onClick={() => navigate('/login')}
			>
				Sign In
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar className='w-9 h-9 m-2 cursor-pointer'>
						{/* <AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>
							CN
						</AvatarFallback> */}
						<UserCircle className='w-9 h-9' />
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>My account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='cursor-pointer'>
						<User className='w-[1.2rem] h-[1.2rem] mr-2' />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem className='cursor-pointer'>
						<Settings className='w-[1.2rem] h-[1.2rem] mr-2' />
						Settings
					</DropdownMenuItem>
					<DropdownMenuItem variant='destructive' className='cursor-pointer'>
						<LogOut className='w-[1.2rem] h-[1.2rem] mr-2' />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
