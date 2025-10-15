import { Avatar } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import {
	Eye,
	EyeOff,
	LogOut,
	Settings,
	User,
	UserCircle,
	X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

export function Useravatar() {
	const [isOpen, setIsOpen] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({ email: '', password: '' })

	// 🔹 Real-time validation on input change
	const handleEmailChange = e => {
		const value = e.target.value
		setEmail(value)
		setErrors(prev => ({
			...prev,
			email: !value
				? 'Email is required'
				: !/\S+@\S+\.\S+/.test(value)
				? 'Enter a valid email'
				: '',
		}))
	}

	const handlePasswordChange = e => {
		const value = e.target.value
		setPassword(value)
		setErrors(prev => ({
			...prev,
			password: !value
				? 'Password is required'
				: value.length < 6
				? 'Minimum 6 characters'
				: '',
		}))
	}

	const validateForm = () => {
		let valid = true
		const newErrors = { email: '', password: '' }

		if (!email) {
			newErrors.email = 'Email is required'
			valid = false
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Enter a valid email'
			valid = false
		}

		if (!password) {
			newErrors.password = 'Password is required'
			valid = false
		} else if (password.length < 6) {
			newErrors.password = 'Minimum 6 characters'
			valid = false
		}

		setErrors(newErrors)
		return valid
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (validateForm()) {
			console.log('Form submitted:', { email, password })
			setIsOpen(false)
			setEmail('')
			setPassword('')
			setErrors({ email: '', password: '' })
		}
	}

	return (
		<div className='flex items-center gap-1 justify-center'>
			<Button
				variant='outline'
				size='lg'
				className='m-2 text-md font-[500] text-blue-950 dark:text-white'
				onClick={() => setIsOpen(true)}
			>
				Log In
			</Button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
						onClick={() => setIsOpen(false)}
					>
						<motion.div
							initial={{ y: -30, opacity: 0, scale: 0.95 }}
							animate={{ y: 0, opacity: 1, scale: 1 }}
							exit={{ y: -20, opacity: 0, scale: 0.9 }}
							transition={{ type: 'spring', stiffness: 140, damping: 14 }}
							onClick={e => e.stopPropagation()}
							className='absolute top-[50%] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-fit md:w-[380px] border border-gray-200 dark:border-gray-700 '
						>
							<Button
								variant='ghost'
								onClick={() => setIsOpen(false)}
								className='absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition'
							>
								<X size={28} />
							</Button>

							<h2 className='text-2xl font-semibold text-center mb-2 text-gray-900 dark:text-white'>
								Log In
							</h2>
							<p className='text-center text-gray-500 dark:text-gray-400 mb-6'>
								Welcome back
							</p>

							<form onSubmit={handleSubmit} className='space-y-5'>
								<div>
									<Label
										htmlFor='email'
										className='text-sm font-medium text-gray-700 dark:text-gray-300'
									>
										Email
									</Label>
									<Input
										id='email'
										type='email'
										placeholder='you@example.com'
										value={email}
										onChange={handleEmailChange}
										className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
											errors.email
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										} focus:ring-2 focus:border-blue-500`}
									/>
									{errors.email && (
										<p className='text-red-500 text-sm mt-1'>{errors.email}</p>
									)}
								</div>

								<div className='relative'>
									<Label
										htmlFor='password'
										className='text-sm font-medium text-gray-700 dark:text-gray-300'
									>
										Password
									</Label>
									<Input
										id='password'
										type={showPassword ? 'text' : 'password'}
										placeholder='password'
										value={password}
										onChange={handlePasswordChange}
										className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
											errors.password
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										} pr-10 focus:ring-2 focus:border-blue-500`}
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
									{errors.password && (
										<p className='text-red-500 text-sm mt-1'>
											{errors.password}
										</p>
									)}
								</div>

								<Button
									type='submit'
									className='w-full text-md text-white font-semibold mt-3 hover:scale-[1.02] transition-transform'
								>
									Sign In
								</Button>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar className='w-9 h-9 m-2 cursor-pointer'>
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
					<DropdownMenuSeparator />
					<DropdownMenuItem variant='destructive' className='cursor-pointer'>
						<LogOut className='w-[1.2rem] h-[1.2rem] mr-2' />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
