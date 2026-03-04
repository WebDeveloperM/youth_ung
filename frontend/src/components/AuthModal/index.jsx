import { authAPI } from '@/api/auth'
import { getOrganisationsList } from '@/api/organisations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Eye, EyeOff, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

export function AuthModal() {
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	const [isLogin, setIsLogin] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [organisations, setOrganisations] = useState([])
	const [formData, setFormData] = useState({
		fullName: '',
		dateOfBirth: '',
		phoneNumber: '',
		residentialAddress: '',
		placeOfWork: '',
		position: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [errors, setErrors] = useState({})
	const [touched, setTouched] = useState({})

	useEffect(() => {
		getOrganisationsList()
			.then(data => setOrganisations(data.results || data))
			.catch(err => console.error('[AuthModal] Failed to load organisations:', err))
	}, [])

	useEffect(() => {
		const handleOpen = () => setIsOpen(true)
		window.addEventListener('open-auth-modal', handleOpen)
		return () => window.removeEventListener('open-auth-modal', handleOpen)
	}, [])

	const validateField = (name, value) => {
		switch (name) {
			case 'fullName':
				return value.length < 3 ? t('errors.minLength', { min: 3 }) : ''
			case 'phoneNumber':
				return !/^\+?[\d\s-()]{10,}$/.test(value) ? t('errors.invalidPhone') : ''
			case 'email':
				return !value
					? t('errors.required')
					: !/\S+@\S+\.\S+/.test(value)
					? t('errors.invalidEmail')
					: ''
			case 'password':
				return value.length < 6 ? t('errors.minLength', { min: 6 }) : ''
			case 'confirmPassword':
				return value !== formData.password ? t('errors.passwordMismatch') : ''
			default:
				return value.trim() === '' ? t('errors.required') : ''
		}
	}

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		if (touched[name]) {
			setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
		}
	}

	const handleBlur = e => {
		const { name, value } = e.target
		setTouched(prev => ({ ...prev, [name]: true }))
		setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
	}

	const validateForm = () => {
		const fieldsToValidate = isLogin ? ['email', 'password'] : Object.keys(formData)
		const newErrors = {}
		const newTouched = {}
		fieldsToValidate.forEach(field => {
			newTouched[field] = true
			const error = validateField(field, formData[field])
			if (error) newErrors[field] = error
		})
		setErrors(newErrors)
		setTouched(newTouched)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (!validateForm()) return

		try {
			const result = isLogin
				? await authAPI.signIn({ login: formData.email, password: formData.password })
				: await authAPI.signUp({
						fullName: formData.fullName,
						dateOfBirth: formData.dateOfBirth,
						phoneNumber: formData.phoneNumber,
						residentialAddress: formData.residentialAddress,
						placeOfWork: formData.placeOfWork,
						position: formData.position,
						login: formData.email,
						password: formData.password,
						confirmPassword: formData.confirmPassword,
				  })

			if (result.success) {
				const profileResult = await authAPI.getProfile()
				if (profileResult.success) {
					localStorage.setItem('user', JSON.stringify(profileResult.data))
				}
				setSuccessMessage(result.data?.message || t('success'))
				setShowSuccess(true)
				setIsOpen(false)
				setFormData({
					fullName: '',
					dateOfBirth: '',
					phoneNumber: '',
					residentialAddress: '',
					placeOfWork: '',
					position: '',
					email: '',
					password: '',
					confirmPassword: '',
				})
				setErrors({})
				setTouched({})
				window.dispatchEvent(new Event('auth-changed'))
				setTimeout(() => setShowSuccess(false), 5000)
			} else {
				if (typeof result.error === 'string') {
					setErrors(prev => ({ ...prev, form: result.error }))
				} else if (result.error && typeof result.error === 'object') {
					const apiErrors = {}
					if (result.error.message) apiErrors.form = result.error.message
					Object.keys(result.error).forEach(key => {
						if (key !== 'message') {
							const val = result.error[key]
							apiErrors[key] = Array.isArray(val) ? val[0] : val
						}
					})
					if (Object.keys(apiErrors).length === 0) apiErrors.form = t('errors.required')
					setErrors(prev => ({ ...prev, ...apiErrors }))
				} else {
					setErrors(prev => ({ ...prev, form: t('errors.required') }))
				}
			}
		} catch (error) {
			console.error('[AuthModal] Auth error:', error)
			setErrors(prev => ({ ...prev, form: error.message || t('errors.required') }))
		}
	}

	const switchMode = () => {
		setIsLogin(!isLogin)
		setErrors({})
		setTouched({})
	}

	const close = () => setIsOpen(false)

	return createPortal(
		<>
			{/* SUCCESS TOAST */}
			<AnimatePresence>
				{showSuccess && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className='fixed top-4 right-4 z-[10001] bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md'
					>
						<CheckCircle size={24} className='shrink-0' />
						<div className='flex-1'>
							<p className='font-semibold text-lg'>{t('success')}</p>
							<p className='text-sm'>{successMessage}</p>
						</div>
						<button
							onClick={() => setShowSuccess(false)}
							className='text-white hover:text-gray-200 transition'
						>
							<X size={20} />
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* MODAL BACKDROP */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] overflow-y-auto'
						onClick={close}
					>
						<div className='flex min-h-screen items-center justify-center p-4'>
							<motion.div
								initial={{ y: -30, opacity: 0, scale: 0.95 }}
								animate={{ y: 0, opacity: 1, scale: 1 }}
								exit={{ y: -20, opacity: 0, scale: 0.9 }}
								transition={{ type: 'spring', stiffness: 140, damping: 14 }}
								onClick={e => e.stopPropagation()}
								className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto ${
									isLogin ? 'w-full md:w-[420px]' : 'w-full md:w-[680px]'
								}`}
							>
								<Button
									variant='ghost'
									onClick={close}
									className='absolute top-4 right-4 z-10 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition'
								>
									<X size={28} />
								</Button>

								<h2 className='text-2xl font-semibold text-center mb-2 text-gray-900 dark:text-white'>
									{isLogin ? t('login') : t('register')}
								</h2>
								<p className='text-center text-gray-500 dark:text-gray-400 mb-6'>
									{isLogin ? t('signInToContinue') : t('createAccount')}
								</p>

								<form onSubmit={handleSubmit} className='space-y-4' noValidate>
									<AnimatePresence mode='wait'>
										{isLogin ? (
											<motion.div
												key='login-form'
												initial={{ opacity: 0, scale: 0.95 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.95 }}
												transition={{ duration: 0.3 }}
												className='space-y-4'
											>
												<div>
													<Label
														htmlFor='auth-email'
														className='text-sm font-medium text-gray-700 dark:text-gray-300'
													>
														{t('userMenu.email')}
													</Label>
													<Input
														id='auth-email'
														name='email'
														type='email'
														placeholder={t('userMenu.email')}
														value={formData.email}
														onChange={handleChange}
														onBlur={handleBlur}
														autoComplete='username'
														className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
															errors.email && touched.email
																? 'border-red-500 focus:ring-red-500'
																: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
														} focus:ring-2`}
													/>
													{errors.email && touched.email && (
														<p className='text-red-500 text-sm mt-1'>{errors.email}</p>
													)}
												</div>

												<div className='relative'>
													<Label
														htmlFor='auth-password'
														className='text-sm font-medium text-gray-700 dark:text-gray-300'
													>
														{t('password')}
													</Label>
													<Input
														id='auth-password'
														name='password'
														type={showPassword ? 'text' : 'password'}
														placeholder={t('password')}
														value={formData.password}
														onChange={handleChange}
														onBlur={handleBlur}
														autoComplete='current-password'
														className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
															errors.password && touched.password
																? 'border-red-500 focus:ring-red-500'
																: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
														} pr-10 focus:ring-2`}
													/>
													<button
														type='button'
														onClick={() => setShowPassword(!showPassword)}
														className='absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
													>
														{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
													</button>
													{errors.password && touched.password && (
														<p className='text-red-500 text-sm mt-1'>{errors.password}</p>
													)}
												</div>
											</motion.div>
										) : (
											<motion.div
												key='register-form'
												initial={{ opacity: 0, scale: 0.95 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.95 }}
												transition={{ duration: 0.3 }}
												className='space-y-4'
											>
												{/* Full Name */}
												<div>
													<Label
														htmlFor='reg-fullName'
														className='text-sm font-medium text-gray-700 dark:text-gray-300'
													>
														{t('fullName')}
													</Label>
													<Input
														id='reg-fullName'
														name='fullName'
														type='text'
														placeholder={t('fullName')}
														value={formData.fullName}
														onChange={handleChange}
														onBlur={handleBlur}
														autoComplete='name'
														className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
															errors.fullName && touched.fullName
																? 'border-red-500 focus:ring-red-500'
																: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
														} focus:ring-2`}
													/>
													{errors.fullName && touched.fullName && (
														<p className='text-red-500 text-sm mt-1'>{errors.fullName}</p>
													)}
												</div>

												{/* Date of Birth & Phone */}
												<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
													<div>
														<Label
															htmlFor='reg-dateOfBirth'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('dateOfBirth')}
														</Label>
														<Input
															id='reg-dateOfBirth'
															name='dateOfBirth'
															type='date'
															value={formData.dateOfBirth}
															onChange={handleChange}
															onBlur={handleBlur}
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.dateOfBirth && touched.dateOfBirth
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2`}
														/>
														{errors.dateOfBirth && touched.dateOfBirth && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.dateOfBirth}
															</p>
														)}
													</div>

													<div>
														<Label
															htmlFor='reg-phoneNumber'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('phoneNumber')}
														</Label>
														<Input
															id='reg-phoneNumber'
															name='phoneNumber'
															type='tel'
															placeholder='+998 XX XXX XX XX'
															value={formData.phoneNumber}
															onChange={handleChange}
															onBlur={handleBlur}
															autoComplete='tel'
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.phoneNumber && touched.phoneNumber
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2`}
														/>
														{errors.phoneNumber && touched.phoneNumber && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.phoneNumber}
															</p>
														)}
													</div>
												</div>

												{/* Residential Address */}
												<div>
													<Label
														htmlFor='reg-residentialAddress'
														className='text-sm font-medium text-gray-700 dark:text-gray-300'
													>
														{t('residentialAddress')}
													</Label>
													<Input
														id='reg-residentialAddress'
														name='residentialAddress'
														type='text'
														placeholder={t('residentialAddress')}
														value={formData.residentialAddress}
														onChange={handleChange}
														onBlur={handleBlur}
														autoComplete='street-address'
														className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
															errors.residentialAddress && touched.residentialAddress
																? 'border-red-500 focus:ring-red-500'
																: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
														} focus:ring-2`}
													/>
													{errors.residentialAddress && touched.residentialAddress && (
														<p className='text-red-500 text-sm mt-1'>
															{errors.residentialAddress}
														</p>
													)}
												</div>

												{/* Place of Work & Position */}
												<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
													<div>
														<Label
															htmlFor='reg-placeOfWork'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('placeOfWork')}
														</Label>
														<select
															id='reg-placeOfWork'
															name='placeOfWork'
															value={formData.placeOfWork}
															onChange={handleChange}
															onBlur={handleBlur}
															className={`mt-2 w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-md ${
																errors.placeOfWork && touched.placeOfWork
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2 focus:outline-none`}
														>
															<option value=''>{t('selectOrganisation')}</option>
															{organisations.length > 0 ? (
																organisations.map(option => (
																	<option key={option.id} value={option.id}>
																		{option.name}
																	</option>
																))
															) : (
																<option disabled>Загрузка...</option>
															)}
														</select>
														{errors.placeOfWork && touched.placeOfWork && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.placeOfWork}
															</p>
														)}
													</div>

													<div>
														<Label
															htmlFor='reg-position'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('position')}
														</Label>
														<Input
															id='reg-position'
															name='position'
															type='text'
															placeholder={t('position')}
															value={formData.position}
															onChange={handleChange}
															onBlur={handleBlur}
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.position && touched.position
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2`}
														/>
														{errors.position && touched.position && (
															<p className='text-red-500 text-sm mt-1'>{errors.position}</p>
														)}
													</div>
												</div>

												{/* Email */}
												<div>
													<Label
														htmlFor='reg-email'
														className='text-sm font-medium text-gray-700 dark:text-gray-300'
													>
														{t('userMenu.email')}
													</Label>
													<Input
														id='reg-email'
														name='email'
														type='email'
														placeholder={t('userMenu.email')}
														value={formData.email}
														onChange={handleChange}
														onBlur={handleBlur}
														autoComplete='email'
														className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
															errors.email && touched.email
																? 'border-red-500 focus:ring-red-500'
																: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
														} focus:ring-2`}
													/>
													{errors.email && touched.email && (
														<p className='text-red-500 text-sm mt-1'>{errors.email}</p>
													)}
												</div>

												{/* Password & Confirm Password */}
												<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
													<div className='relative'>
														<Label
															htmlFor='reg-password'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('password')}
														</Label>
														<Input
															id='reg-password'
															name='password'
															type={showPassword ? 'text' : 'password'}
															placeholder={t('password')}
															value={formData.password}
															onChange={handleChange}
															onBlur={handleBlur}
															autoComplete='new-password'
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.password && touched.password
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} pr-10 focus:ring-2`}
														/>
														<button
															type='button'
															onClick={() => setShowPassword(!showPassword)}
															className='absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
														>
															{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
														</button>
														{errors.password && touched.password && (
															<p className='text-red-500 text-sm mt-1'>{errors.password}</p>
														)}
													</div>

													<div className='relative'>
														<Label
															htmlFor='reg-confirmPassword'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('confirmPassword')}
														</Label>
														<Input
															id='reg-confirmPassword'
															name='confirmPassword'
															type={showConfirmPassword ? 'text' : 'password'}
															placeholder={t('confirmPassword')}
															value={formData.confirmPassword}
															onChange={handleChange}
															onBlur={handleBlur}
															autoComplete='new-password'
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.confirmPassword && touched.confirmPassword
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} pr-10 focus:ring-2`}
														/>
														<button
															type='button'
															onClick={() => setShowConfirmPassword(!showConfirmPassword)}
															className='absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
														>
															{showConfirmPassword ? (
																<EyeOff size={18} />
															) : (
																<Eye size={18} />
															)}
														</button>
														{errors.confirmPassword && touched.confirmPassword && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.confirmPassword}
															</p>
														)}
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Form-level error */}
									{errors.form && (
										<motion.p
											role='alert'
											initial={{ opacity: 0, y: -8 }}
											animate={{ opacity: 1, y: 0 }}
											className='text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3'
										>
											{errors.form}
										</motion.p>
									)}

									<Button
										type='submit'
										className='w-full text-md text-white font-semibold hover:scale-[1.02] transition-transform'
									>
										{isLogin ? t('login') : t('register')}
									</Button>

									<div className='text-center text-sm text-gray-600 dark:text-gray-400'>
										{isLogin ? t('switchToRegister') : t('switchToLogin')}{' '}
										<button
											type='button'
											onClick={switchMode}
											className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold'
										>
											{isLogin ? t('register') : t('login')}
										</button>
									</div>
								</form>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>,
		document.body
	)
}
