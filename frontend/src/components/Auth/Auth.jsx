import { Icon } from '@iconify/react'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
	FaBriefcase,
	FaBuilding,
	FaCalendar,
	FaCheckCircle,
	FaLock,
	FaMapMarkerAlt,
	FaPhone,
	FaUser,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from '@/components/langSelector'
import './Auth.css'

const Auth = () => {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()

	const [isLogin, setIsLogin] = useState(true)
	const [showSuccess, setShowSuccess] = useState(false)
	const [formData, setFormData] = useState({
		fullName: '',
		dateOfBirth: '',
		phoneNumber: '',
		residentialAddress: '',
		placeOfWork: '',
		position: '',
		login: '',
		password: '',
		confirmPassword: '',
	})
	const [errors, setErrors] = useState({})
	const [touched, setTouched] = useState({})

	// Валидация полей
	const validateField = (name, value) => {
		switch (name) {
			case 'fullName':
				return value.length < 3
					? t('errors.minLength').replace('{{min}}', '3')
					: ''

			case 'phoneNumber':
				return !/^\+?[\d\s-()]{10,}$/.test(value)
					? t('errors.invalidPhone')
					: ''

			case 'login':
				return value.length < 4
					? t('errors.minLength').replace('{{min}}', '4')
					: ''

			case 'password':
				return value.length < 6
					? t('errors.minLength').replace('{{min}}', '6')
					: ''

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

	// Отправка формы
	const handleSubmit = e => {
		e.preventDefault()

		const fieldsToValidate = isLogin
			? ['login', 'password']
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

		if (Object.keys(newErrors).length === 0) {
			console.log('Form submitted:', formData)
			setShowSuccess(true)

			setTimeout(() => {
				setShowSuccess(false)
				setFormData({
					fullName: '',
					dateOfBirth: '',
					phoneNumber: '',
					residentialAddress: '',
					placeOfWork: '',
					position: '',
					login: '',
					password: '',
					confirmPassword: '',
				})
				setTouched({})
				setErrors({})
			}, 3000)
		}
	}

	// Переключение между режимами вход/регистрация
	const switchMode = () => {
		setIsLogin(!isLogin)
		setErrors({})
		setTouched({})
	}

	// Рендер input поля
	const renderInput = (name, icon, type = 'text') => (
		<div className='form-group'>
			<label htmlFor={name} className='form-label'>
				{t(name === 'login' ? 'loginField' : name)}
			</label>
			<input
				type={type}
				id={name}
				name={name}
				className={`form-control ${
					errors[name] && touched[name] ? 'is-invalid' : ''
				} ${
					touched[name] && !errors[name] && formData[name] ? 'is-valid' : ''
				}`}
				value={formData[name]}
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder={t(name === 'login' ? 'loginField' : name)}
				aria-invalid={errors[name] && touched[name] ? 'true' : 'false'}
				aria-describedby={errors[name] ? `${name}-error` : undefined}
			/>
			<AnimatePresence>
				{errors[name] && touched[name] && (
					<motion.div
						id={`${name}-error`}
						role='alert'
						className='error-message'
						initial={{ opacity: 0, height: 0, y: -10 }}
						animate={{ opacity: 1, height: 'auto', y: 0 }}
						exit={{ opacity: 0, height: 0, y: -10 }}
						transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
					>
						{errors[name]}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)

	return (
		<div className='auth-container'>
			{/* Фоновые фигуры */}
			<div className='background-shapes'>
				<motion.div
					className='shape shape-1'
					animate={{
						y: [0, -20, 0],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: 'linear',
					}}
				/>
				<motion.div
					className='shape shape-2'
					animate={{
						y: [0, 20, 0],
						rotate: [0, -180, -360],
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: 'linear',
					}}
				/>
				<motion.div
					className='shape shape-3'
					animate={{
						x: [0, 20, 0],
						rotate: [0, 90, 180],
					}}
					transition={{
						duration: 18,
						repeat: Infinity,
						ease: 'linear',
					}}
				/>
			</div>

			{/* Переключатель языка */}
			<div className='language-switcher'>
				<motion.button
					className='home-btn'
					onClick={() => navigate('/')}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Icon icon='mdi:home' width='32' height='32' />
				</motion.button>
				<LanguageSelector />
			</div>

			{/* Карточка аутентификации */}
			<motion.div
				className='auth-card'
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				layout
			>
				{/* Логотип компании */}
				<motion.div
					className='company-logo'
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div className='logo-placeholder'>
						<div className='logo-text'>YOUTH</div>
						<div className='logo-subtext'>Platform</div>
					</div>
				</motion.div>

				{/* Заголовок */}
				<motion.div
					className='auth-header'
					key={isLogin ? 'login' : 'register'}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<h1>{isLogin ? t('welcomeBack') : t('welcome')}</h1>
					<p>{isLogin ? t('signInToContinue') : t('createAccount')}</p>
				</motion.div>

				{/* Форма */}
				<form onSubmit={handleSubmit}>
					<AnimatePresence mode='wait'>
						{isLogin ? (
							<motion.div
								key='login-form'
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -20 }}
								transition={{
									duration: 0.5,
									ease: [0.4, 0, 0.2, 1],
								}}
								layout
							>
								<div className='form-row single'>
									{renderInput('login', <FaUser />, 'text')}
								</div>
								<div className='form-row single'>
									{renderInput('password', <FaLock />, 'password')}
								</div>
							</motion.div>
						) : (
							<motion.div
								key='register-form'
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -20 }}
								transition={{
									duration: 0.5,
									ease: [0.4, 0, 0.2, 1],
								}}
								layout
							>
								<div className='form-row single'>
									{renderInput('fullName', <FaUser />, 'text')}
								</div>
								<div className='form-row double'>
									{renderInput('dateOfBirth', <FaCalendar />, 'date')}
									{renderInput('phoneNumber', <FaPhone />, 'tel')}
								</div>
								<div className='form-row single'>
									{renderInput(
										'residentialAddress',
										<FaMapMarkerAlt />,
										'text'
									)}
								</div>
								<div className='form-row double'>
									{renderInput('placeOfWork', <FaBuilding />, 'text')}
									{renderInput('position', <FaBriefcase />, 'text')}
								</div>
								<div className='form-row single'>
									{renderInput('login', <FaUser />, 'text')}
								</div>
								<div className='form-row double'>
									{renderInput('password', <FaLock />, 'password')}
									{renderInput('confirmPassword', <FaLock />, 'password')}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Кнопка отправки */}
					<motion.button
						type='submit'
						className='btn-submit'
						layout
						whileHover={{
							scale: 1.02,
							y: -4,
						}}
						whileTap={{ scale: 0.98, y: -2 }}
						transition={{ duration: 0.2 }}
					>
						{isLogin ? t('login') : t('register')}
					</motion.button>

					{/* Переключение режима */}
					<motion.div className='switch-mode' layout>
						<p>
							{isLogin ? t('switchToRegister') : t('switchToLogin')}{' '}
							<button
								type='button'
								onClick={switchMode}
								className='switch-link'
							>
								{isLogin ? t('register') : t('login')}
							</button>
						</p>
					</motion.div>
				</form>

				{/* Секция партнёров */}
				<motion.div
					className='partners-section'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					layout
				>
					<p className='partners-title'>
						{t('footer.partners')}
					</p>
					<div className='partners-logos'>
						{[1, 2, 3, 4].map(num => (
							<motion.div
								key={num}
								className='partner-logo'
								whileHover={{ scale: 1.1, y: -5 }}
								transition={{ duration: 0.3 }}
							>
								<div className='partner-placeholder'>
									<span>Partner {num}</span>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</motion.div>

			{/* Модальное окно успеха */}
			<AnimatePresence>
				{showSuccess && (
					<motion.div
						className='success-overlay'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className='success-modal'
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.5, opacity: 0 }}
							transition={{ type: 'spring', duration: 0.5 }}
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: 'spring' }}
							>
								<FaCheckCircle className='success-icon' />
							</motion.div>
							<h2>{isLogin ? t('welcome') : t('createAccount')}</h2>
							<p>{isLogin ? t('signInToContinue') : t('welcomeBack')}</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Auth
