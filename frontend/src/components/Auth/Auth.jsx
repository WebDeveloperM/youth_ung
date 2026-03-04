import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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
import { authAPI } from '@/api/auth'
import { getOrganisationsList } from '@/api/organisations'
import './Auth.css'

const Auth = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const [isLogin, setIsLogin] = useState(true)
	const [showSuccess, setShowSuccess] = useState(false)
	const [organisations, setOrganisations] = useState([])
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

	useEffect(() => {
		const loadOrganisations = async () => {
			try {
				const data = await getOrganisationsList()
				setOrganisations(data.results || data)
			} catch {
				// Non-critical — form is still usable without the list
			}
		}
		loadOrganisations()
	}, [])

	const validateField = (name, value) => {
		switch (name) {
			case 'fullName':
				return value.length < 3
					? t('errors.minLength').replace('{{min}}', '3')
					: ''

			case 'phoneNumber':
				return !/^\+?[\d\s\-()]{10,}$/.test(value)
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

	const handleSubmit = async e => {
		e.preventDefault()

		const fieldsToValidate = isLogin ? ['login', 'password'] : Object.keys(formData)
		const newErrors = {}
		const newTouched = {}

		fieldsToValidate.forEach(field => {
			newTouched[field] = true
			const error = validateField(field, formData[field])
			if (error) newErrors[field] = error
		})

		setErrors(newErrors)
		setTouched(newTouched)

		if (Object.keys(newErrors).length > 0) return

		try {
			const result = isLogin
				? await authAPI.signIn({ login: formData.login, password: formData.password })
				: await authAPI.signUp(formData)

			if (result.success) {
				setShowSuccess(true)
				setTimeout(() => navigate('/'), 2000)
			} else {
				const apiErrors = {}
				if (result.error) {
					if (typeof result.error === 'string') {
						apiErrors.form = result.error
					} else if (typeof result.error === 'object') {
						if (result.error.message) apiErrors.form = result.error.message
						Object.keys(result.error).forEach(key => {
							if (key !== 'message') {
								const val = result.error[key]
								apiErrors[key] = Array.isArray(val) ? val[0] : val
							}
						})
					}
				}
				if (Object.keys(apiErrors).length === 0) {
					apiErrors.form = 'Ошибка входа. Проверьте логин и пароль.'
				}
				setErrors(apiErrors)
			}
		} catch {
			setErrors({ form: 'Произошла ошибка. Попробуйте позже.' })
		}
	}

	const switchMode = () => {
		setIsLogin(prev => !prev)
		setErrors({})
		setTouched({})
	}

	const renderInput = (name, _icon, type = 'text') => (
		<div className='form-group'>
			<label htmlFor={name} className='form-label'>
				{t(name === 'login' ? 'loginField' : name)}
			</label>
			<input
				type={type}
				id={name}
				name={name}
				className={`form-control${errors[name] && touched[name] ? ' is-invalid' : ''}${touched[name] && !errors[name] && formData[name] ? ' is-valid' : ''}`}
				value={formData[name]}
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder={t(name === 'login' ? 'loginField' : name)}
				aria-invalid={errors[name] && touched[name] ? 'true' : 'false'}
				aria-describedby={errors[name] ? `${name}-error` : undefined}
				autoComplete={
					type === 'password'
						? name === 'password' && isLogin
							? 'current-password'
							: 'new-password'
						: name === 'login'
						? 'username'
						: 'off'
				}
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

	const renderSelect = (name, _icon, options) => (
		<div className='form-group'>
			<label htmlFor={name} className='form-label'>
				{t(name)}
			</label>
			<select
				id={name}
				name={name}
				className={`form-control${errors[name] && touched[name] ? ' is-invalid' : ''}${touched[name] && !errors[name] && formData[name] ? ' is-valid' : ''}`}
				value={formData[name]}
				onChange={handleChange}
				onBlur={handleBlur}
				aria-invalid={errors[name] && touched[name] ? 'true' : 'false'}
				aria-describedby={errors[name] ? `${name}-error` : undefined}
			>
				<option value=''>{t('selectOrganisation')}</option>
				{options && options.length > 0 ? (
					options.map(option => (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					))
				) : (
					<option disabled>Загрузка организаций...</option>
				)}
			</select>
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
			{/* Animated background shapes */}
			<div className='background-shapes'>
				<motion.div
					className='shape shape-1'
					animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
					transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
				/>
				<motion.div
					className='shape shape-2'
					animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
					transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
				/>
				<motion.div
					className='shape shape-3'
					animate={{ x: [0, 20, 0], rotate: [0, 90, 180] }}
					transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
				/>
			</div>

			{/* Top-right controls */}
			<div className='language-switcher'>
				<motion.button
					className='home-btn'
					onClick={() => navigate('/')}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					aria-label='Bosh sahifaga qaytish'
				>
					<Icon icon='mdi:home' width='32' height='32' />
				</motion.button>
				<LanguageSelector />
			</div>

			{/* Card */}
			<motion.div
				className='auth-card'
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				layout
			>
				{/* Logo */}
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

				{/* Heading */}
				<motion.div
					className='auth-header'
					key={isLogin ? 'login' : 'register'}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<h1>{isLogin ? t('welcomeBack') : t('createAccount')}</h1>
					<p>{isLogin ? t('signInToContinue') : t('welcome')}</p>
				</motion.div>

				{/* Form */}
				<form onSubmit={handleSubmit} noValidate>
					<AnimatePresence mode='wait'>
						{isLogin ? (
							<motion.div
								key='login-form'
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -20 }}
								transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
								layout
							>
								<div className='form-row single'>
									{renderInput('login', null, 'text')}
								</div>
								<div className='form-row single'>
									{renderInput('password', null, 'password')}
								</div>
							</motion.div>
						) : (
							<motion.div
								key='register-form'
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -20 }}
								transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
								layout
							>
								<div className='form-row single'>
									{renderInput('fullName', null, 'text')}
								</div>
								<div className='form-row double'>
									{renderInput('dateOfBirth', null, 'date')}
									{renderInput('phoneNumber', null, 'tel')}
								</div>
								<div className='form-row single'>
									{renderInput('residentialAddress', null, 'text')}
								</div>
								<div className='form-row double'>
									{renderSelect('placeOfWork', null, organisations)}
									{renderInput('position', null, 'text')}
								</div>
								<div className='form-row single'>
									{renderInput('login', null, 'text')}
								</div>
								<div className='form-row double'>
									{renderInput('password', null, 'password')}
									{renderInput('confirmPassword', null, 'password')}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Form-level error */}
					{errors.form && (
						<motion.div
							role='alert'
							className='error-message'
							style={{
								textAlign: 'center',
								marginBottom: '1rem',
								padding: '0.75rem',
								background: 'rgba(239,68,68,0.1)',
								borderRadius: '8px',
								color: '#ef4444',
							}}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
						>
							{errors.form}
						</motion.div>
					)}

					<motion.button
						type='submit'
						className='btn-submit'
						layout
						whileHover={{ scale: 1.02, y: -4 }}
						whileTap={{ scale: 0.98, y: -2 }}
						transition={{ duration: 0.2 }}
					>
						{isLogin ? t('login') : t('register')}
					</motion.button>

					<motion.div className='switch-mode' layout>
						<p>
							{isLogin ? t('switchToRegister') : t('switchToLogin')}{' '}
							<button type='button' onClick={switchMode} className='switch-link'>
								{isLogin ? t('register') : t('login')}
							</button>
						</p>
					</motion.div>
				</form>
			</motion.div>

			{/* Success modal */}
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
							<h2>{t('success')}</h2>
							<p>{t('signInToContinue')}</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Auth
