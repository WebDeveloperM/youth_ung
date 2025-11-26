import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
	User,
	Mail,
	Phone,
	MapPin,
	Briefcase,
	Building,
	Calendar,
	Lock,
	Camera,
	Save,
	X,
	CheckCircle,
	AlertCircle,
} from 'lucide-react'
import { authAPI } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ProfilePage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [profile, setProfile] = useState(null)
	const [avatarPreview, setAvatarPreview] = useState(null)
	const [avatarFile, setAvatarFile] = useState(null)
	const [showPasswordForm, setShowPasswordForm] = useState(false)
	const [notification, setNotification] = useState(null)
	
	const [formData, setFormData] = useState({
		username: '',
		first_name: '',
		last_name: '',
		phone: '',
		address: '',
		position: '',
		date_of_birth: '',
		gender: '',
	})
	
	const [passwordData, setPasswordData] = useState({
		current_password: '',
		new_password: '',
		confirm_password: '',
	})
	
	const [errors, setErrors] = useState({})
	
	// Загрузка профиля при монтировании
	useEffect(() => {
		loadProfile()
	}, [])
	
	// Проверка авторизации
	useEffect(() => {
		if (!authAPI.isAuthenticated()) {
			navigate('/')
		}
	}, [navigate])
	
	const loadProfile = async () => {
		setLoading(true)
		const result = await authAPI.getProfile()
		
		if (result.success) {
			setProfile(result.data)
			setFormData({
				username: result.data.username || '',
				first_name: result.data.first_name || '',
				last_name: result.data.last_name || '',
				phone: result.data.phone || '',
				address: result.data.address || '',
				position: result.data.position || '',
				date_of_birth: result.data.date_of_birth || '',
				gender: result.data.gender || '',
			})
			setAvatarPreview(result.data.avatar_url)
		} else {
			showNotification('error', 'Ошибка при загрузке профиля')
			if (result.error?.detail === 'Invalid token.' || result.error?.detail === 'Authentication credentials were not provided.') {
				authAPI.signOut()
				navigate('/')
			}
		}
		setLoading(false)
	}
	
	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		// Убираем ошибку при изменении поля
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}
	
	const handlePasswordChange = (e) => {
		const { name, value } = e.target
		setPasswordData(prev => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}
	
	const handleAvatarChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			// Проверка размера (макс 5MB)
			if (file.size > 5 * 1024 * 1024) {
				showNotification('error', 'Размер файла не должен превышать 5MB')
				return
			}
			
			// Проверка типа
			if (!file.type.startsWith('image/')) {
				showNotification('error', 'Разрешены только изображения')
				return
			}
			
			setAvatarFile(file)
			
			// Предпросмотр
			const reader = new FileReader()
			reader.onloadend = () => {
				setAvatarPreview(reader.result)
			}
			reader.readAsDataURL(file)
		}
	}
	
	const handleSubmit = async (e) => {
		e.preventDefault()
		setSaving(true)
		setErrors({})
		
		try {
			// 1. Загружаем аватар если изменен
			if (avatarFile) {
				const avatarResult = await authAPI.uploadAvatar(avatarFile)
				if (!avatarResult.success) {
					showNotification('error', 'Ошибка при загрузке фото')
					setSaving(false)
					return
				}
			}
			
			// 2. Обновляем данные профиля
			const updateData = { ...formData }
			
			// Добавляем пароль если меняем
			if (showPasswordForm && passwordData.current_password) {
				updateData.current_password = passwordData.current_password
				updateData.new_password = passwordData.new_password
				updateData.confirm_password = passwordData.confirm_password
			}
			
			const result = await authAPI.updateProfile(updateData)
			
			if (result.success) {
				showNotification('success', result.data.message || 'Профиль успешно обновлен!')
				
				// Перезагружаем профиль
				await loadProfile()
				
				// Сбрасываем форму пароля
				setPasswordData({
					current_password: '',
					new_password: '',
					confirm_password: '',
				})
				setShowPasswordForm(false)
				setAvatarFile(null)
			} else {
				// Обрабатываем ошибки
				if (result.error && typeof result.error === 'object') {
					setErrors(result.error)
					
					// Показываем первую ошибку
					const firstError = Object.values(result.error)[0]
					const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
					showNotification('error', errorMessage)
				} else {
					showNotification('error', 'Ошибка при обновлении профиля')
				}
			}
		} catch (error) {
			console.error('Profile update error:', error)
			showNotification('error', 'Произошла критическая ошибка')
		}
		
		setSaving(false)
	}
	
	const showNotification = (type, message) => {
		setNotification({ type, message })
		setTimeout(() => setNotification(null), 5000)
	}
	
	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
					<p className='mt-4 text-gray-600 dark:text-gray-400'>Загрузка профиля...</p>
				</div>
			</div>
		)
	}
	
	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			{/* Уведомления */}
			{notification && (
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -50 }}
					className={`fixed top-4 right-4 z-[10000] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md ${
						notification.type === 'success' 
							? 'bg-green-500 text-white' 
							: 'bg-red-500 text-white'
					}`}
				>
					{notification.type === 'success' ? (
						<CheckCircle size={24} className='flex-shrink-0' />
					) : (
						<AlertCircle size={24} className='flex-shrink-0' />
					)}
					<div className='flex-1'>
						<p className='font-semibold text-lg'>
							{notification.type === 'success' ? 'Успешно!' : 'Ошибка!'}
						</p>
						<p className='text-sm'>{notification.message}</p>
					</div>
					<button 
						onClick={() => setNotification(null)}
						className='text-white hover:text-gray-200 transition'
					>
						<X size={20} />
					</button>
				</motion.div>
			)}
			
			{/* Заголовок */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='mb-8'
			>
				<h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
					Настройки профиля
				</h1>
				<p className='text-gray-600 dark:text-gray-400'>
					Управляйте своими личными данными и настройками
				</p>
			</motion.div>
			
			<div className='grid md:grid-cols-3 gap-8'>
				{/* Левая колонка: Аватар */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
					className='md:col-span-1'
				>
					<div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24'>
						<div className='text-center'>
							<div className='relative inline-block mb-4'>
								<div className='w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20'>
									{avatarPreview ? (
										<img 
											src={avatarPreview} 
											alt='Avatar' 
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center'>
											<User size={48} className='text-primary' />
										</div>
									)}
								</div>
								<label 
									htmlFor='avatar-upload'
									className='absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-lg'
								>
									<Camera size={20} />
								</label>
								<input
									id='avatar-upload'
									type='file'
									accept='image/*'
									onChange={handleAvatarChange}
									className='hidden'
								/>
							</div>
							
							<h2 className='text-xl font-bold text-gray-900 dark:text-white'>
								{profile?.first_name} {profile?.last_name}
							</h2>
							<p className='text-gray-600 dark:text-gray-400 text-sm'>
								{profile?.email}
							</p>
							<p className='text-gray-500 dark:text-gray-500 text-xs mt-1'>
								{profile?.role === 'User' ? 'Пользователь' : profile?.role}
							</p>
							
							{avatarFile && (
								<p className='text-xs text-primary mt-2'>
									✨ Новое фото выбрано
								</p>
							)}
						</div>
					</div>
				</motion.div>
				
				{/* Правая колонка: Форма */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className='md:col-span-2'
				>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Основная информация */}
						<div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
								<User size={20} className='text-primary' />
								Основная информация
							</h3>
							
							<div className='grid md:grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='first_name' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<User size={16} />
										Имя
									</Label>
									<Input
										id='first_name'
										name='first_name'
										value={formData.first_name}
										onChange={handleChange}
										className='mt-2'
									/>
									{errors.first_name && (
										<p className='text-red-500 text-sm mt-1'>{errors.first_name}</p>
									)}
								</div>
								
								<div>
									<Label htmlFor='last_name' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<User size={16} />
										Фамилия
									</Label>
									<Input
										id='last_name'
										name='last_name'
										value={formData.last_name}
										onChange={handleChange}
										className='mt-2'
									/>
									{errors.last_name && (
										<p className='text-red-500 text-sm mt-1'>{errors.last_name}</p>
									)}
								</div>
								
								<div>
									<Label htmlFor='username' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<User size={16} />
										Имя пользователя
									</Label>
									<Input
										id='username'
										name='username'
										value={formData.username}
										onChange={handleChange}
										className='mt-2'
									/>
									{errors.username && (
										<p className='text-red-500 text-sm mt-1'>{errors.username}</p>
									)}
								</div>
								
								<div>
									<Label htmlFor='date_of_birth' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<Calendar size={16} />
										Дата рождения
									</Label>
									<Input
										id='date_of_birth'
										name='date_of_birth'
										type='date'
										value={formData.date_of_birth}
										onChange={handleChange}
										className='mt-2'
									/>
								</div>
								
								<div>
									<Label htmlFor='gender' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<User size={16} />
										Пол
									</Label>
									<select
										id='gender'
										name='gender'
										value={formData.gender}
										onChange={handleChange}
										className='mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
									>
										<option value=''>Выберите пол</option>
										<option value='male'>Мужской</option>
										<option value='female'>Женский</option>
									</select>
								</div>
								
								<div>
									<Label htmlFor='email' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<Mail size={16} />
										Email (не редактируется)
									</Label>
									<Input
										id='email'
										name='email'
										type='email'
										value={profile?.email || ''}
										disabled
										className='mt-2 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
									/>
								</div>
							</div>
						</div>
						
						{/* Контактная информация */}
						<div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
								<Phone size={20} className='text-primary' />
								Контактная информация
							</h3>
							
							<div className='grid md:grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='phone' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<Phone size={16} />
										Телефон
									</Label>
									<Input
										id='phone'
										name='phone'
										type='tel'
										value={formData.phone}
										onChange={handleChange}
										placeholder='+998 XX XXX XX XX'
										className='mt-2'
									/>
									{errors.phone && (
										<p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
									)}
								</div>
								
								<div>
									<Label htmlFor='address' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<MapPin size={16} />
										Адрес
									</Label>
									<Input
										id='address'
										name='address'
										value={formData.address}
										onChange={handleChange}
										className='mt-2'
									/>
								</div>
							</div>
						</div>
						
						{/* Работа */}
						<div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
								<Briefcase size={20} className='text-primary' />
								Место работы
							</h3>
							
							<div className='grid md:grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='position' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<Briefcase size={16} />
										Должность
									</Label>
									<Input
										id='position'
										name='position'
										value={formData.position}
										onChange={handleChange}
										className='mt-2'
									/>
								</div>
								
								<div>
									<Label htmlFor='organization' className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
										<Building size={16} />
										Организация (не редактируется)
									</Label>
									<Input
										id='organization'
										value={profile?.organization_name || ''}
										disabled
										className='mt-2 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
									/>
								</div>
							</div>
						</div>
						
						{/* Смена пароля */}
						<div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
									<Lock size={20} className='text-primary' />
									Смена пароля
								</h3>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									onClick={() => setShowPasswordForm(!showPasswordForm)}
								>
									{showPasswordForm ? 'Отменить' : 'Изменить пароль'}
								</Button>
							</div>
							
							{showPasswordForm && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className='space-y-4'
								>
									<div>
										<Label htmlFor='current_password' className='text-gray-700 dark:text-gray-300'>
											Текущий пароль
										</Label>
										<Input
											id='current_password'
											name='current_password'
											type='password'
											value={passwordData.current_password}
											onChange={handlePasswordChange}
											className='mt-2'
										/>
										{errors.current_password && (
											<p className='text-red-500 text-sm mt-1'>{errors.current_password}</p>
										)}
									</div>
									
									<div className='grid md:grid-cols-2 gap-4'>
										<div>
											<Label htmlFor='new_password' className='text-gray-700 dark:text-gray-300'>
												Новый пароль
											</Label>
											<Input
												id='new_password'
												name='new_password'
												type='password'
												value={passwordData.new_password}
												onChange={handlePasswordChange}
												className='mt-2'
											/>
											{errors.new_password && (
												<p className='text-red-500 text-sm mt-1'>{errors.new_password}</p>
											)}
										</div>
										
										<div>
											<Label htmlFor='confirm_password' className='text-gray-700 dark:text-gray-300'>
												Подтвердите пароль
											</Label>
											<Input
												id='confirm_password'
												name='confirm_password'
												type='password'
												value={passwordData.confirm_password}
												onChange={handlePasswordChange}
												className='mt-2'
											/>
											{errors.confirm_password && (
												<p className='text-red-500 text-sm mt-1'>{errors.confirm_password}</p>
											)}
										</div>
									</div>
								</motion.div>
							)}
						</div>
						
						{/* Кнопки действий */}
						<div className='flex justify-end gap-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() => navigate(-1)}
								disabled={saving}
							>
								Отмена
							</Button>
							<Button
								type='submit'
								disabled={saving}
								className='flex items-center gap-2'
							>
								{saving ? (
									<>
										<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
										Сохранение...
									</>
								) : (
									<>
										<Save size={18} />
										Сохранить изменения
									</>
								)}
							</Button>
						</div>
					</form>
				</motion.div>
			</div>
		</div>
	)
}

export default ProfilePage



