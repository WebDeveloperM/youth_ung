import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaFileAlt, FaBriefcase } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.20.10.2:8000/api/v1'

export default function ApplicationForm({ contentType, objectId, contentTitle, onClose, onSuccess }) {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		full_name: '',
		email: '',
		phone: '',
		organization: '',
		position: '',
		experience: '',
		motivation: '',
		cv_file: null,
		portfolio_file: null,
	})

	const handleFileChange = (e, fieldName) => {
		const file = e.target.files?.[0]
		if (file) {
			setFormData({ ...formData, [fieldName]: file })
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const submitData = new FormData()
			
			// Добавляем все поля
			submitData.append('full_name', formData.full_name)
			submitData.append('email', formData.email)
			submitData.append('phone', formData.phone)
			submitData.append('organization', formData.organization)
			submitData.append('position', formData.position)
			submitData.append('experience', formData.experience)
			submitData.append('motivation', formData.motivation)
			submitData.append('content_type', contentType)
			submitData.append('object_id', objectId)
			
			// Добавляем файлы если есть
			if (formData.cv_file) {
				submitData.append('cv_file', formData.cv_file)
			}
			if (formData.portfolio_file) {
				submitData.append('portfolio_file', formData.portfolio_file)
			}

			console.log('📤 Отправка заявки:', {
				contentType,
				objectId,
				...formData,
			})

			const response = await axios.post(
				`${API_BASE_URL}/applications/apply/`,
				submitData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)

			console.log('✅ Заявка отправлена:', response.data)
			
			if (onSuccess) {
				onSuccess()
			}
			
			alert('✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.')
			onClose()
		} catch (error) {
			console.error('❌ Ошибка отправки заявки:', error)
			alert(`Ошибка: ${error.response?.data?.message || error.message}`)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto'>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8'
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<div>
						<h3 className='text-2xl font-bold text-gray-900'>
							{t('grants.applyForm.title')}
						</h3>
						<p className='text-sm text-gray-600 mt-1'>{contentTitle}</p>
					</div>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-gray-600 transition-colors'
					>
						<FaTimes size={24} />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className='p-6 space-y-6'>
					{/* Personal Info */}
					<div className='space-y-4'>
						<h4 className='font-semibold text-gray-900'>
							{t('grants.applyForm.personalInfo')}
						</h4>
						
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									{t('grants.applyForm.fullName')} <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									required
									value={formData.full_name}
									onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
									placeholder='Иванов Иван Иванович'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Email <span className='text-red-500'>*</span>
								</label>
								<input
									type='email'
									required
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
									placeholder='example@email.com'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									{t('grants.applyForm.phone')} <span className='text-red-500'>*</span>
								</label>
								<input
									type='tel'
									required
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
									placeholder='+998 90 123 45 67'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									{t('grants.applyForm.organization')}
								</label>
								<input
									type='text'
									value={formData.organization}
									onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
									placeholder='ТАТУ, IT Park, и т.д.'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								{t('grants.applyForm.position')}
							</label>
							<input
								type='text'
								value={formData.position}
								onChange={(e) => setFormData({ ...formData, position: e.target.value })}
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
								placeholder='Студент, Разработчик, и т.д.'
							/>
						</div>
					</div>

					{/* Experience */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							{t('grants.applyForm.experience')}
						</label>
						<textarea
							rows={3}
							value={formData.experience}
							onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
							placeholder='Опишите ваш опыт работы или учебы...'
						/>
					</div>

					{/* Motivation */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							{t('grants.applyForm.motivation')} <span className='text-red-500'>*</span>
						</label>
						<textarea
							rows={5}
							required
							value={formData.motivation}
							onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
							placeholder='Почему вы хотите получить этот грант? Как вы планируете использовать полученные средства?'
						/>
					</div>

					{/* Files */}
					<div className='space-y-4'>
						<h4 className='font-semibold text-gray-900'>
							{t('grants.applyForm.documents')}
						</h4>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								<FaFileAlt className='inline w-4 h-4 mr-1' />
								{t('grants.applyForm.cv')}
							</label>
							<input
								type='file'
								accept='.pdf,.doc,.docx'
								onChange={(e) => handleFileChange(e, 'cv_file')}
								className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100'
							/>
							{formData.cv_file && (
								<p className='text-xs text-green-600 mt-1'>
									✓ {formData.cv_file.name}
								</p>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								<FaBriefcase className='inline w-4 h-4 mr-1' />
								{t('grants.applyForm.portfolio')}
							</label>
							<input
								type='file'
								accept='.pdf,.doc,.docx,.zip'
								onChange={(e) => handleFileChange(e, 'portfolio_file')}
								className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100'
							/>
							{formData.portfolio_file && (
								<p className='text-xs text-green-600 mt-1'>
									✓ {formData.portfolio_file.name}
								</p>
							)}
						</div>
					</div>

					{/* Buttons */}
					<div className='flex space-x-3 pt-6 border-t border-gray-200'>
						<button
							type='submit'
							disabled={loading}
							className='flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{loading ? 'Юборилмоқда...' : t('grants.applyForm.submit')}
						</button>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors'
						>
							{t('grants.applyForm.cancel')}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	)
}

