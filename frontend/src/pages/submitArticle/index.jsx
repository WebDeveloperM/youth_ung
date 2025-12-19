import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaUpload, FaImage, FaFilePdf } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { submitArticle, getMyArticles, deleteArticle } from '@/api/articles'

export default function SubmitArticle() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [myArticles, setMyArticles] = useState([])
	const [showForm, setShowForm] = useState(false)
	
	const [formData, setFormData] = useState({
		title_uz: '',
		title_ru: '',
		title_en: '',
		abstract_uz: '',
		abstract_ru: '',
		abstract_en: '',
		content_uz: '',
		content_ru: '',
		content_en: '',
		category: 'local',
		keywords_uz: '',
		keywords_ru: '',
		keywords_en: '',
		doi: '',
		publication_date: '',
		cover_image: null,
		pdf_file: null,
	})

	const [previews, setPreviews] = useState({
		cover_image: null,
		pdf_file: null,
	})

	useEffect(() => {
		loadMyArticles()
	}, [])

	const loadMyArticles = async () => {
		try {
			const data = await getMyArticles()
			setMyArticles(data)
		} catch (error) {
			console.error('Maqolalarni yuklashda xatolik:', error)
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleFileChange = (e) => {
		const { name, files } = e.target
		if (files && files[0]) {
			setFormData(prev => ({ ...prev, [name]: files[0] }))
			
			// Create preview for images
			if (name === 'cover_image') {
				const reader = new FileReader()
				reader.onloadend = () => {
					setPreviews(prev => ({ ...prev, cover_image: reader.result }))
				}
				reader.readAsDataURL(files[0])
			} else if (name === 'pdf_file') {
				setPreviews(prev => ({ ...prev, pdf_file: files[0].name }))
			}
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		
		// Validate required fields
		if (!formData.title_uz || !formData.abstract_uz || !formData.content_uz) {
			toast.error(t('submitArticle.requiredFields'))
			return
		}

		try {
			setLoading(true)
			await submitArticle(formData)
			toast.success(t('submitArticle.submitSuccess'))
			
			// Reset form
			setFormData({
				title_uz: '',
				title_ru: '',
				title_en: '',
				abstract_uz: '',
				abstract_ru: '',
				abstract_en: '',
				content_uz: '',
				content_ru: '',
				content_en: '',
				category: 'local',
				keywords_uz: '',
				keywords_ru: '',
				keywords_en: '',
				doi: '',
				publication_date: '',
				cover_image: null,
				pdf_file: null,
			})
			setPreviews({ cover_image: null, pdf_file: null })
			setShowForm(false)
			loadMyArticles()
		} catch (error) {
			console.error('Maqola yuborishda xatolik:', error)
			toast.error(t('submitArticle.submitError'))
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id) => {
		if (!confirm(t('submitArticle.deleteConfirm'))) return
		
		try {
			await deleteArticle(id)
			toast.success(t('submitArticle.deleteSuccess'))
			loadMyArticles()
		} catch (error) {
			console.error('Maqolani o\'chirishda xatolik:', error)
			toast.error(t('submitArticle.deleteError'))
		}
	}

	const getStatusBadge = (status) => {
		const statusConfig = {
			pending: { label: t('submitArticle.status.pending'), color: 'bg-yellow-100 text-yellow-800' },
			approved: { label: t('submitArticle.status.approved'), color: 'bg-green-100 text-green-800' },
			rejected: { label: t('submitArticle.status.rejected'), color: 'bg-red-100 text-red-800' },
			revision: { label: t('submitArticle.status.revision'), color: 'bg-blue-100 text-blue-800' },
		}
		const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
		return (
			<span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
				{config.label}
			</span>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='container mx-auto max-w-6xl'>
				{/* Header */}
				<div className='mb-8'>
					<button
						onClick={() => navigate('/articles')}
						className='flex items-center gap-2 text-[#0078c2] hover:text-[#005a94] mb-4 transition-colors'
					>
						<FaArrowLeft />
						<span>{t('submitArticle.backToList')}</span>
					</button>
					<h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
						{t('submitArticle.title')}
					</h1>
					<p className='text-gray-600 mt-2'>
						{t('submitArticle.description')}
					</p>
				</div>

				{/* My Articles Section */}
				{myArticles.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='bg-white rounded-2xl shadow-lg p-6 mb-8'
					>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>{t('submitArticle.myArticles')}</h2>
						<div className='space-y-4'>
							{myArticles.map((article) => (
								<div
									key={article.id}
									className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
								>
									<div className='flex justify-between items-start gap-4'>
										<div className='flex-1'>
											<h3 className='text-lg font-semibold text-gray-800 mb-2'>
												{article.title_uz || article.title_ru || article.title_en}
											</h3>
											<div className='flex flex-wrap gap-3 text-sm text-gray-600'>
												<span>📅 {new Date(article.created_at).toLocaleDateString('uz-UZ')}</span>
												<span>👁 {article.views} {t('submitArticle.views')}</span>
												<span>📥 {article.downloads} {t('submitArticle.downloads')}</span>
											</div>
											{article.admin_comment && (
												<div className='mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm'>
													<strong>{t('submitArticle.adminComment')}:</strong> {article.admin_comment}
												</div>
											)}
										</div>
										<div className='flex flex-col gap-2'>
											{getStatusBadge(article.status)}
											{(article.status === 'pending' || article.status === 'rejected') && (
												<button
													onClick={() => handleDelete(article.id)}
													className='px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors'
												>
													{t('submitArticle.deleteButton')}
												</button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{/* Toggle Form Button */}
				{!showForm && (
					<div className='text-center mb-8'>
						<button
							onClick={() => setShowForm(true)}
							className='bg-[#0078c2] text-white px-8 py-3 rounded-lg hover:bg-[#005a94] transition-colors font-semibold'
						>
							{t('submitArticle.addNewArticle')}
						</button>
					</div>
				)}

				{/* Submit Form */}
				{showForm && (
					<motion.form
						onSubmit={handleSubmit}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='bg-white rounded-2xl shadow-lg p-6 md:p-10'
					>
						<h2 className='text-2xl font-bold text-gray-900 mb-6'>{t('submitArticle.formTitle')}</h2>

						{/* Category Selection */}
						<div className='mb-6'>
							<label className='block text-gray-700 font-semibold mb-2'>
								{t('submitArticle.category')} <span className='text-red-500'>*</span>
							</label>
							<select
								name='category'
								value={formData.category}
								onChange={handleInputChange}
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2] focus:border-transparent'
								required
							>
								<option value='local'>{t('articles.local')}</option>
								<option value='international'>{t('articles.international')}</option>
								<option value='scientific'>{t('articles.scientific')}</option>
								<option value='analytical'>{t('articles.analytical')}</option>
								<option value='practical'>{t('articles.practical')}</option>
							</select>
						</div>

						{/* Uzbek Fields */}
						<div className='mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50'>
							<h3 className='text-lg font-bold text-blue-900 mb-4'>🇺🇿 {t('submitArticle.uzbekLanguage')}</h3>
							
							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>
									{t('submitArticle.titleUz')} <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									name='title_uz'
									value={formData.title_uz}
									onChange={handleInputChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
									required
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>
									{t('submitArticle.abstractUz')} <span className='text-red-500'>*</span>
								</label>
								<textarea
									name='abstract_uz'
									value={formData.abstract_uz}
									onChange={handleInputChange}
									rows={4}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
									required
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>
									{t('submitArticle.contentUz')} <span className='text-red-500'>*</span>
								</label>
								<textarea
									name='content_uz'
									value={formData.content_uz}
									onChange={handleInputChange}
									rows={8}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
									required
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>
									{t('submitArticle.keywordsUz')}
								</label>
								<input
									type='text'
									name='keywords_uz'
									value={formData.keywords_uz}
									onChange={handleInputChange}
									placeholder={t('submitArticle.keywordsPlaceholder')}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>
						</div>

						{/* Russian Fields */}
						<div className='mb-6 p-4 border-2 border-gray-200 rounded-lg'>
							<h3 className='text-lg font-bold text-gray-900 mb-4'>🇷🇺 {t('submitArticle.russianLanguage')}</h3>
							
							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.titleRu')}</label>
								<input
									type='text'
									name='title_ru'
									value={formData.title_ru}
									onChange={handleInputChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.abstractRu')}</label>
								<textarea
									name='abstract_ru'
									value={formData.abstract_ru}
									onChange={handleInputChange}
									rows={4}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.contentRu')}</label>
								<textarea
									name='content_ru'
									value={formData.content_ru}
									onChange={handleInputChange}
									rows={8}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.keywordsRu')}</label>
								<input
									type='text'
									name='keywords_ru'
									value={formData.keywords_ru}
									onChange={handleInputChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>
						</div>

						{/* English Fields */}
						<div className='mb-6 p-4 border-2 border-gray-200 rounded-lg'>
							<h3 className='text-lg font-bold text-gray-900 mb-4'>🇬🇧 {t('submitArticle.englishLanguage')}</h3>
							
							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.titleEn')}</label>
								<input
									type='text'
									name='title_en'
									value={formData.title_en}
									onChange={handleInputChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.abstractEn')}</label>
								<textarea
									name='abstract_en'
									value={formData.abstract_en}
									onChange={handleInputChange}
									rows={4}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.contentEn')}</label>
								<textarea
									name='content_en'
									value={formData.content_en}
									onChange={handleInputChange}
									rows={8}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>

							<div className='mb-4'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.keywordsEn')}</label>
								<input
									type='text'
									name='keywords_en'
									value={formData.keywords_en}
									onChange={handleInputChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>
						</div>

						{/* Additional Fields */}
						<div className='grid md:grid-cols-2 gap-6 mb-6'>
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.doi')}</label>
								<input
									type='text'
									name='doi'
									value={formData.doi}
									onChange={handleInputChange}
									placeholder='10.1234/example'
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>

							<div>
								<label className='block text-gray-700 font-semibold mb-2'>{t('submitArticle.publicationDate')}</label>
								<input
									type='date'
									name='publication_date'
									value={formData.publication_date}
									onChange={handleInputChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078c2]'
								/>
							</div>
						</div>

						{/* File Uploads */}
						<div className='grid md:grid-cols-2 gap-6 mb-8'>
							{/* Cover Image */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									<FaImage className='inline mr-2' />
									{t('submitArticle.coverImage')}
								</label>
								<div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0078c2] transition-colors cursor-pointer'>
									<input
										type='file'
										name='cover_image'
										accept='image/*'
										onChange={handleFileChange}
										className='hidden'
										id='cover-upload'
									/>
									<label htmlFor='cover-upload' className='cursor-pointer'>
										{previews.cover_image ? (
											<img src={previews.cover_image} alt='Preview' className='max-h-40 mx-auto rounded' />
										) : (
											<>
												<FaUpload className='text-4xl text-gray-400 mx-auto mb-2' />
												<p className='text-gray-600'>{t('submitArticle.uploadImage')}</p>
											</>
										)}
									</label>
								</div>
							</div>

							{/* PDF File */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									<FaFilePdf className='inline mr-2' />
									{t('submitArticle.pdfFile')}
								</label>
								<div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0078c2] transition-colors cursor-pointer'>
									<input
										type='file'
										name='pdf_file'
										accept='.pdf'
										onChange={handleFileChange}
										className='hidden'
										id='pdf-upload'
									/>
									<label htmlFor='pdf-upload' className='cursor-pointer'>
										{previews.pdf_file ? (
											<>
												<FaFilePdf className='text-5xl text-red-500 mx-auto mb-2' />
												<p className='text-gray-600 text-sm'>{previews.pdf_file}</p>
											</>
										) : (
											<>
												<FaUpload className='text-4xl text-gray-400 mx-auto mb-2' />
												<p className='text-gray-600'>{t('submitArticle.uploadPDF')}</p>
											</>
										)}
									</label>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className='flex gap-4 justify-end'>
							<button
								type='button'
								onClick={() => setShowForm(false)}
								className='px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
							>
								{t('submitArticle.cancelButton')}
							</button>
							<button
								type='submit'
								disabled={loading}
								className='px-8 py-3 bg-[#0078c2] text-white rounded-lg hover:bg-[#005a94] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{loading ? t('submitArticle.submitting') : t('submitArticle.submitButton')}
							</button>
						</div>
					</motion.form>
				)}
			</div>
		</div>
	)
}

