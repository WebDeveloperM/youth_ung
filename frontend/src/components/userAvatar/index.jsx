import { Avatar } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authAPI } from '@/api/auth'
import { LogOut, MessageSquare, Settings, User, UserCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const BACKEND_ORIGIN = (
	import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
).replace(/\/api\/v1\/?$/, '')

const toAbsoluteUrl = url => {
	if (!url) return null
	if (url.startsWith('http://') || url.startsWith('https://')) return url
	return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`
}

export function Useravatar() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [currentUser, setCurrentUser] = useState(null)

	// Load user on mount
	useEffect(() => {
		const localUser = authAPI.getCurrentUser()
		if (localUser) {
			setCurrentUser(localUser)
			authAPI.getProfile().then(result => {
				if (result.success) {
					setCurrentUser(result.data)
					localStorage.setItem('user', JSON.stringify(result.data))
				}
			})
		}
	}, [])

	// Sync user state when auth changes (login / logout from any component)
	useEffect(() => {
		const handleAuthChange = () => {
			const user = authAPI.getCurrentUser()
			setCurrentUser(user)
			if (user) {
				authAPI.getProfile().then(result => {
					if (result.success) {
						setCurrentUser(result.data)
						localStorage.setItem('user', JSON.stringify(result.data))
					}
				})
			}
		}
		window.addEventListener('auth-changed', handleAuthChange)
		return () => window.removeEventListener('auth-changed', handleAuthChange)
	}, [])

	const handleLogout = () => {
		authAPI.signOut()
		setCurrentUser(null)
		window.dispatchEvent(new Event('auth-changed'))
	}

	return (
		<>
			{/* Login button — shown when not authenticated */}
			{!currentUser && (
				<Button
					variant='outline'
					size='lg'
					className='m-2 text-md font-medium text-blue-950 dark:text-white'
					onClick={() => window.dispatchEvent(new Event('open-auth-modal'))}
				>
					{t('login')}
				</Button>
			)}

			{/* Dropdown — shown when authenticated */}
			{currentUser && (
				<DropdownMenu>
					<DropdownMenuTrigger className='flex items-center gap-2 m-2'>
						<Avatar className='w-9 h-9 cursor-pointer overflow-hidden'>
							{(() => {
								const avatarUrl = toAbsoluteUrl(
									currentUser.avatar_url ?? currentUser.avatar ?? null
								)
								return avatarUrl ? (
									<img
										src={avatarUrl}
										alt={`${currentUser.first_name || ''} ${currentUser.last_name || ''}`}
										className='w-full h-full object-cover'
										onError={e => {
											e.target.style.display = 'none'
										}}
									/>
								) : (
									<div className='w-full h-full font-extralight bg-transparent flex items-center justify-center'>
										<UserCircle2 className='w-9 h-9 font-extralight text-muted-foreground' />
									</div>
								)
							})()}
						</Avatar>
						<div className='block text-left'>
							<p className='text-sm font-semibold'>
								{currentUser.first_name} {currentUser.last_name}
							</p>
							<p className='text-xs'>{currentUser.email}</p>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>
							<div>
								<p className='font-semibold'>
									{currentUser.first_name} {currentUser.last_name}
								</p>
								<p className='text-xs text-gray-500 font-normal'>{currentUser.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className='cursor-pointer'
							onClick={() => navigate('/profile')}
						>
							<User className='w-[1.2rem] h-[1.2rem] mr-2' />
							{t('userMenu.profile')}
						</DropdownMenuItem>
						<DropdownMenuItem className='cursor-pointer'>
							<Settings className='w-[1.2rem] h-[1.2rem] mr-2' />
							{t('userMenu.settings')}
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer'
							onClick={() => navigate('/appeals')}
						>
							<MessageSquare className='w-[1.2rem] h-[1.2rem] mr-2' />
							{t('userMenu.appeals')}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant='destructive'
							className='cursor-pointer text-red-600'
							onClick={handleLogout}
						>
							<LogOut className='w-[1.2rem] h-[1.2rem] mr-2' />
							{t('userMenu.logout')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	)
}
