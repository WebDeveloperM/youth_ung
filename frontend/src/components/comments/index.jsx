import { useState, useEffect } from 'react'
import { FaThumbsDown, FaThumbsUp, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { commentsAPI } from '@/api/comments'
import { authAPI } from '@/api/auth'

const Comments = ({ contentType, objectId }) => {
	const { t } = useTranslation()
	const [comments, setComments] = useState([])
	const [newComment, setNewComment] = useState('')
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [currentUser, setCurrentUser] = useState(null)

	// Загрузка комментариев при монтировании
	useEffect(() => {
		loadComments()
		setCurrentUser(authAPI.getCurrentUser())
	}, [contentType, objectId])

	const loadComments = async () => {
		setLoading(true)
		const result = await commentsAPI.getComments(contentType, objectId)
		if (result.success) {
			setComments(result.data)
		} else {
			console.error('Ошибка загрузки комментариев:', result.error)
		}
		setLoading(false)
	}

	const handleAddComment = async () => {
		if (!newComment.trim()) {
			alert(t('comments.emptyComment') || 'Комментарий не может быть пустым')
			return
		}

		if (!authAPI.isAuthenticated()) {
			alert(t('comments.loginRequired') || 'Войдите чтобы оставить комментарий')
			return
		}

		setSubmitting(true)
		const result = await commentsAPI.createComment(contentType, objectId, newComment.trim())
		
		if (result.success) {
			// Добавляем новый комментарий в список
			setComments(prev => [result.data.comment, ...prev])
			setNewComment('')
		} else {
			const errorMessage = result.error?.content?.[0] || result.error?.message || 'Ошибка при добавлении комментария'
			alert(errorMessage)
		}
		setSubmitting(false)
	}

	const handleLike = async (commentId, isLikedByMe) => {
		if (!authAPI.isAuthenticated()) {
			alert(t('comments.loginRequired') || 'Войдите чтобы поставить лайк')
			return
		}

		const result = isLikedByMe 
			? await commentsAPI.unlikeComment(commentId)
			: await commentsAPI.likeComment(commentId)
		
		if (result.success) {
			// Обновляем комментарий в списке
			setComments(prev => prev.map(c => 
				c.id === commentId 
					? { 
						...c, 
						likes: result.data.likes,
						dislikes: result.data.dislikes,
						is_liked_by_me: !isLikedByMe,
						is_disliked_by_me: false
					}
					: c
			))
		}
	}

	const handleDislike = async (commentId, isDislikedByMe) => {
		if (!authAPI.isAuthenticated()) {
			alert(t('comments.loginRequired') || 'Войдите чтобы поставить дизлайк')
			return
		}

		const result = isDislikedByMe 
			? await commentsAPI.undislikeComment(commentId)
			: await commentsAPI.dislikeComment(commentId)
		
		if (result.success) {
			// Обновляем комментарий в списке
			setComments(prev => prev.map(c => 
				c.id === commentId 
					? { 
						...c, 
						likes: result.data.likes,
						dislikes: result.data.dislikes,
						is_liked_by_me: false,
						is_disliked_by_me: !isDislikedByMe
					}
					: c
			))
		}
	}

	const handleDelete = async (commentId) => {
		if (!confirm(t('comments.confirmDelete') || 'Вы уверены что хотите удалить комментарий?')) {
			return
		}

		const result = await commentsAPI.deleteComment(commentId)
		if (result.success) {
			// Удаляем комментарий из списка
			setComments(prev => prev.filter(c => c.id !== commentId))
		} else {
			alert(result.error?.message || 'Ошибка при удалении комментария')
		}
	}

	const formatDate = dateStr => {
		const date = new Date(dateStr)
		const day = String(date.getDate()).padStart(2, '0')
		const month = date.toLocaleString('en-US', { month: 'short' })
		const year = date.getFullYear()
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')

		return `${day}-${month}, ${year} ${hours}:${minutes}`
	}

	if (loading) {
		return (
			<div className='mt-10'>
				<h3 className='text-xl font-semibold mb-4 text-[#0098C7]'>
					{t('comments.title')}
				</h3>
				<p className='text-gray-500 text-sm'>{t('comments.loading') || 'Загрузка комментариев...'}</p>
			</div>
		)
	}

	return (
		<div className='mt-10'>
			<h3 className='text-xl font-semibold mb-4 text-[#0098C7]'>
				{t('comments.title')} ({comments.length})
			</h3>

			{/* Add Comment Box */}
			<div className='flex items-start gap-3 mb-6'>
				<textarea
					className='flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0098C7] dark:bg-gray-800 dark:border-gray-600 dark:text-white'
					rows='2'
					placeholder={t('comments.placeholder')}
					value={newComment}
					onChange={e => setNewComment(e.target.value)}
					disabled={submitting || !authAPI.isAuthenticated()}
				/>
				<button
					onClick={handleAddComment}
					disabled={submitting || !authAPI.isAuthenticated()}
					className='bg-[#0098C7] text-white px-4 py-2 rounded-lg hover:bg-[#0078a1] disabled:bg-gray-400 disabled:cursor-not-allowed'
				>
					{submitting ? t('comments.submitting') || 'Отправка...' : t('comments.submit')}
				</button>
			</div>

			{!authAPI.isAuthenticated() && (
				<p className='text-sm text-gray-500 mb-4'>
					{t('comments.loginToComment') || 'Войдите, чтобы оставить комментарий'}
				</p>
			)}

			{/* Comments List */}
			{comments.length === 0 ? (
				<p className='text-gray-500 text-sm'>{t('comments.noComments')}</p>
			) : (
				<div className='space-y-4'>
					{comments.map(c => (
						<div
							key={c.id}
							className='border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 shadow-sm'
						>
							<div className='flex justify-between items-start'>
								<div className='flex items-center gap-2'>
									{c.author_avatar && (
										<img 
											src={c.author_avatar} 
											alt={c.author_full_name}
											className='w-8 h-8 rounded-full object-cover'
										/>
									)}
									<div>
										<h4 className='font-semibold text-sm text-gray-800 dark:text-gray-200'>
											{c.author_full_name || c.author_name}
										</h4>
										<p className='text-xs text-gray-400'>{formatDate(c.created_at)}</p>
									</div>
								</div>
								{c.can_delete && (
									<button
										onClick={() => handleDelete(c.id)}
										className='text-red-500 hover:text-red-700 transition'
										title={t('comments.delete') || 'Удалить'}
									>
										<FaTrash size={14} />
									</button>
								)}
							</div>
							<p className='text-sm text-gray-700 dark:text-gray-300 mt-2'>
								{c.content}
							</p>
							<div className='flex gap-4 mt-2 text-xs text-gray-500'>
								<button
									onClick={() => handleLike(c.id, c.is_liked_by_me)}
									disabled={!authAPI.isAuthenticated()}
									className={`flex items-center gap-1 cursor-pointer transition ${
										c.is_liked_by_me 
											? 'text-[#0098C7] font-bold' 
											: 'hover:text-[#0098C7]'
									} disabled:cursor-not-allowed disabled:opacity-50`}
								>
									<FaThumbsUp /> {c.likes}
								</button>
								<button
									onClick={() => handleDislike(c.id, c.is_disliked_by_me)}
									disabled={!authAPI.isAuthenticated()}
									className={`flex items-center gap-1 cursor-pointer transition ${
										c.is_disliked_by_me 
											? 'text-red-500 font-bold' 
											: 'hover:text-red-500'
									} disabled:cursor-not-allowed disabled:opacity-50`}
								>
									<FaThumbsDown /> {c.dislikes}
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Comments
