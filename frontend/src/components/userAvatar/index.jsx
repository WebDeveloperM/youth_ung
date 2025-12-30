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
import { authAPI } from '@/api/auth'
import { getOrganisationsList } from '@/api/organisations'
import { AnimatePresence, motion } from 'framer-motion'
import {
	CheckCircle,
	Eye,
	EyeOff,
	LogOut,
	MessageSquare,
	Settings,
	User,
	UserCircle2,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

export function Useravatar() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)
	const [isLogin, setIsLogin] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [currentUser, setCurrentUser] = useState(null)
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

	// Загрузка организаций при монтировании
	useEffect(() => {
		const loadOrganisations = async () => {
			try {
				console.log('🔄 [UserAvatar] Загрузка организаций...')
				const data = await getOrganisationsList()
				console.log('📦 [UserAvatar] Получены организации:', data)
				const orgList = data.results || data
				setOrganisations(orgList)
				console.log('✅ [UserAvatar] Организаций загружено:', orgList.length)
			} catch (error) {
				console.error('❌ [UserAvatar] Ошибка загрузки организаций:', error)
			}
		}
		loadOrganisations()
	}, [])

	useEffect(() => {
		const loadUser = async () => {
			const localUser = authAPI.getCurrentUser()
			if (localUser) {
				console.log('📦 Пользователь из localStorage:', localUser)
				setCurrentUser(localUser)
				const profileResult = await authAPI.getProfile()
				if (profileResult.success) {
					console.log('✅ Профиль загружен с сервера:', profileResult.data)
					console.log('🖼️ Avatar URL:', profileResult.data.avatar_url)
					setCurrentUser(profileResult.data)
					localStorage.setItem('user', JSON.stringify(profileResult.data))
				}
			}
		}
		loadUser()
	}, [])

	// Валидация полей
	const validateField = (name, value) => {
		switch (name) {
			case 'fullName':
				return value.length < 3 ? t('errors.minLength', { min: 3 }) : ''

			case 'phoneNumber':
				return !/^\+?[\d\s-()]{10,}$/.test(value)
					? t('errors.invalidPhone')
					: ''

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

	// Обработка изменения значения поля
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))

		if (touched[name]) {
			const error = validateField(name, value)
			setErrors(prev => ({ ...prev, [name]: error }))
		}
	}

	// Обработка потери фокуса
	const handleBlur = e => {
		const { name, value } = e.target
		setTouched(prev => ({ ...prev, [name]: true }))
		const error = validateField(name, value)
		setErrors(prev => ({ ...prev, [name]: error }))
	}

	const validateForm = () => {
		const fieldsToValidate = isLogin
			? ['email', 'password']
			: Object.keys(formData)

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

		if (!validateForm()) {
			return
		}

		console.log('✅ Форма валидна, отправляем на API...')
		console.log('📦 Данные формы:', formData)
		console.log('🔍 Режим:', isLogin ? 'Вход' : 'Регистрация')

		try {
			let result

			if (isLogin) {
				// ВХОД
				console.log('🔑 Отправляем запрос на вход...')
				result = await authAPI.signIn({
					login: formData.email,
					password: formData.password,
				})
			} else {
				// РЕГИСТРАЦИЯ
				console.log('🚀 Отправляем запрос на регистрацию...')
				result = await authAPI.signUp({
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
			}

			console.log('📥 Результат:', result)

			if (result.success) {
				console.log('✅ УСПЕХ!', result.data)

				// Загружаем актуальные данные профиля с сервера
				const profileResult = await authAPI.getProfile()
				if (profileResult.success) {
					console.log('✅ Профиль обновлен:', profileResult.data)
					console.log(
						'🖼️ Avatar URL после входа:',
						profileResult.data.avatar_url
					)
					setCurrentUser(profileResult.data)
					// Обновляем localStorage актуальными данными
					localStorage.setItem('user', JSON.stringify(profileResult.data))
				} else {
					// Если не удалось загрузить профиль, используем данные из результата входа
					setCurrentUser(result.data)
				}

				// Показываем сообщение об успехе
				const message =
					result.data.message ||
					(isLogin ? 'Вход выполнен успешно!' : 'Регистрация прошла успешно!')
				setSuccessMessage(message)
				setShowSuccess(true)

				// Закрываем модальное окно
				setIsOpen(false)

				// Очищаем форму
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

				// Скрываем уведомление через 5 секунд
				setTimeout(() => {
					setShowSuccess(false)
				}, 5000)
			} else {
				console.error('❌ Ошибка:', result.error)

				// Показываем ошибку
				if (typeof result.error === 'string') {
					alert('Ошибка: ' + result.error)
				} else if (result.error && typeof result.error === 'object') {
					// Если ошибка - объект с полями
					const errorMessages = Object.entries(result.error)
						.map(([field, messages]) => {
							if (Array.isArray(messages)) {
								return `${field}: ${messages.join(', ')}`
							}
							return `${field}: ${messages}`
						})
						.join('\n')
					alert('Ошибки:\n' + errorMessages)
				} else {
					alert('Произошла ошибка. Попробуйте еще раз.')
				}
			}
		} catch (error) {
			console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error)
			alert('Произошла критическая ошибка: ' + error.message)
		}
	}

	// Переключение между режимами вход/регистрация
	const switchMode = () => {
		setIsLogin(!isLogin)
		setErrors({})
		setTouched({})
	}

	// Выход из системы
	const handleLogout = () => {
		authAPI.signOut()
		setCurrentUser(null)
		console.log('🚪 Пользователь вышел из системы')
	}

	return (
		<>
			{/* УВЕДОМЛЕНИЕ ОБ УСПЕХЕ */}
			{showSuccess &&
				createPortal(
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className='fixed top-4 right-4 z-[10000] bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md'
					>
						<CheckCircle size={24} className='flex-shrink-0' />
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
					</motion.div>,
					document.body
				)}

			{/* Если НЕ авторизован - показываем кнопку "Войти" */}
			{!currentUser && (
				<Button
					variant='outline'
					size='lg'
					className='m-2 text-md font-[500] text-blue-950 dark:text-white'
					onClick={() => setIsOpen(true)}
				>
					{t('login')}
				</Button>
			)}

			{isOpen &&
				createPortal(
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] overflow-y-auto'
							onClick={() => setIsOpen(false)}
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
										onClick={() => setIsOpen(false)}
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

									<form onSubmit={handleSubmit} className='space-y-4'>
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
															htmlFor='email'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('userMenu.email')}
														</Label>
														<Input
															id='email'
															name='email'
															type='email'
															placeholder={t('userMenu.email')}
															value={formData.email}
															onChange={handleChange}
															onBlur={handleBlur}
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.email && touched.email
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2`}
														/>
														{errors.email && touched.email && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.email}
															</p>
														)}
													</div>

													<div className='relative'>
														<Label
															htmlFor='password'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('password')}
														</Label>
														<Input
															id='password'
															name='password'
															type={showPassword ? 'text' : 'password'}
															placeholder={t('password')}
															value={formData.password}
															onChange={handleChange}
															onBlur={handleBlur}
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
															{showPassword ? (
																<EyeOff size={18} />
															) : (
																<Eye size={18} />
															)}
														</button>
														{errors.password && touched.password && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.password}
															</p>
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
															htmlFor='fullName'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('fullName')}
														</Label>
														<Input
															id='fullName'
															name='fullName'
															type='text'
															placeholder={t('fullName')}
															value={formData.fullName}
															onChange={handleChange}
															onBlur={handleBlur}
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.fullName && touched.fullName
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2`}
														/>
														{errors.fullName && touched.fullName && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.fullName}
															</p>
														)}
													</div>

													{/* Date of Birth & Phone Number */}
													<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
														<div>
															<Label
																htmlFor='dateOfBirth'
																className='text-sm font-medium text-gray-700 dark:text-gray-300'
															>
																{t('dateOfBirth')}
															</Label>
															<Input
																id='dateOfBirth'
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
																htmlFor='phoneNumber'
																className='text-sm font-medium text-gray-700 dark:text-gray-300'
															>
																{t('phoneNumber')}
															</Label>
															<Input
																id='phoneNumber'
																name='phoneNumber'
																type='tel'
																placeholder='+998 XX XXX XX XX'
																value={formData.phoneNumber}
																onChange={handleChange}
																onBlur={handleBlur}
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
															htmlFor='residentialAddress'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('residentialAddress')}
														</Label>
														<Input
															id='residentialAddress'
															name='residentialAddress'
															type='text'
															placeholder={t('residentialAddress')}
															value={formData.residentialAddress}
															onChange={handleChange}
															onBlur={handleBlur}
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.residentialAddress &&
																touched.residentialAddress
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2`}
														/>
														{errors.residentialAddress &&
															touched.residentialAddress && (
																<p className='text-red-500 text-sm mt-1'>
																	{errors.residentialAddress}
																</p>
															)}
													</div>

													{/* Place of Work & Position */}
													<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
														<div>
															<Label
																htmlFor='placeOfWork'
																className='text-sm font-medium text-gray-700 dark:text-gray-300'
															>
																{t('placeOfWork')}
															</Label>
															<select
																id='placeOfWork'
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
																<option value=''>
																	{t('selectOrganisation')}
																</option>
																{organisations && organisations.length > 0 ? (
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
																htmlFor='position'
																className='text-sm font-medium text-gray-700 dark:text-gray-300'
															>
																{t('position')}
															</Label>
															<Input
																id='position'
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
																<p className='text-red-500 text-sm mt-1'>
																	{errors.position}
																</p>
															)}
														</div>
													</div>

													{/* Email */}
													<div>
														<Label
															htmlFor='email'
															className='text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															{t('userMenu.email')}
														</Label>
														<Input
															id='email'
															name='email'
															type='email'
															placeholder={t('userMenu.email')}
															value={formData.email}
															onChange={handleChange}
															onBlur={handleBlur}
															className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																errors.email && touched.email
																	? 'border-red-500 focus:ring-red-500'
																	: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
															} focus:ring-2`}
														/>
														{errors.email && touched.email && (
															<p className='text-red-500 text-sm mt-1'>
																{errors.email}
															</p>
														)}
													</div>

													{/* Password & Confirm Password */}
													<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
														<div className='relative'>
															<Label
																htmlFor='password'
																className='text-sm font-medium text-gray-700 dark:text-gray-300'
															>
																{t('password')}
															</Label>
															<Input
																id='password'
																name='password'
																type={showPassword ? 'text' : 'password'}
																placeholder={t('password')}
																value={formData.password}
																onChange={handleChange}
																onBlur={handleBlur}
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
																{showPassword ? (
																	<EyeOff size={18} />
																) : (
																	<Eye size={18} />
																)}
															</button>
															{errors.password && touched.password && (
																<p className='text-red-500 text-sm mt-1'>
																	{errors.password}
																</p>
															)}
														</div>

														<div className='relative'>
															<Label
																htmlFor='confirmPassword'
																className='text-sm font-medium text-gray-700 dark:text-gray-300'
															>
																{t('confirmPassword')}
															</Label>
															<Input
																id='confirmPassword'
																name='confirmPassword'
																type={showConfirmPassword ? 'text' : 'password'}
																placeholder={t('confirmPassword')}
																value={formData.confirmPassword}
																onChange={handleChange}
																onBlur={handleBlur}
																className={`mt-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
																	errors.confirmPassword &&
																	touched.confirmPassword
																		? 'border-red-500 focus:ring-red-500'
																		: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
																} pr-10 focus:ring-2`}
															/>
															<button
																type='button'
																onClick={() =>
																	setShowConfirmPassword(!showConfirmPassword)
																}
																className='absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
															>
																{showConfirmPassword ? (
																	<EyeOff size={18} />
																) : (
																	<Eye size={18} />
																)}
															</button>
															{errors.confirmPassword &&
																touched.confirmPassword && (
																	<p className='text-red-500 text-sm mt-1'>
																		{errors.confirmPassword}
																	</p>
																)}
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>

										<Button
											type='submit'
											className='w-full text-md text-white font-semibold hover:scale-[1.02] transition-transform'
										>
											{isLogin ? t('login') : t('register')}
										</Button>

										{/* Switch Mode Button */}
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
					</AnimatePresence>,
					document.body
				)}

			{/* Если авторизован - показываем аватар и меню */}
			{currentUser && (
				<DropdownMenu>
					<DropdownMenuTrigger className='flex items-center gap-2 m-2'>
						<Avatar className='w-9 h-9 cursor-pointer overflow-hidden'>
							{(() => {
								// Получаем URL аватара
								const avatarUrl = currentUser.avatar_url || currentUser.avatar
								console.log('🖼️ Отображение аватара:', avatarUrl)

								return avatarUrl ? (
									<img
										src={avatarUrl}
										alt={`${currentUser.first_name || ''} ${
											currentUser.last_name || ''
										}`}
										className='w-full h-full object-cover'
										onError={e => {
											console.error('❌ Ошибка загрузки аватара:', avatarUrl)
											e.target.style.display = 'none'
											e.target.parentElement.innerHTML = `
												<div class="w-full h-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
													<svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<circle cx="12" cy="12" r="10" stroke-width="2"/>
														<path d="M12 8v4m0 4h.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
													</svg>
												</div>
											`
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
								<p className='text-xs text-gray-500 font-normal'>
									{currentUser.email}
								</p>
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
