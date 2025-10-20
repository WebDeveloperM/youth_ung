import { commentsData as initialComments } from '@/datatest/commentsData'
import { useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa'

const Comments = ({ newsId }) => {
	const [comments, setComments] = useState(
		initialComments
			.filter(c => c.newsId === newsId)
			.sort((a, b) => new Date(b.date) - new Date(a.date))
	)
	const [newComment, setNewComment] = useState('')

	const handleAddComment = () => {
		if (!newComment.trim()) return

		const now = new Date()
		const newEntry = {
			id: Date.now(),
			newsId,
			author: 'Anonim foydalanuvchi',
			content: newComment.trim(),
			likes: 0,
			dislikes: 0,
			date: now.toISOString(),
		}

		setComments(prev =>
			[newEntry, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
		)
		setNewComment('')
	}

	const handleLike = id => {
		setComments(prev =>
			prev.map(c => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
		)
	}

	const handleDislike = id => {
		setComments(prev =>
			prev.map(c => (c.id === id ? { ...c, dislikes: c.dislikes + 1 } : c))
		)
	}
	const formatDate = dateStr => {
		const date = new Date(dateStr.replace(' ', 'T'))
		const day = String(date.getDate()).padStart(2, '0')
		const month = date.toLocaleString('en-US', { month: 'short' })
		const year = date.getFullYear()
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')

		return `${day}-${month}, ${year} ${hours}:${minutes} `
	}

	return (
		<div className='mt-10'>
			<h3 className='text-xl font-semibold mb-4 text-[#0098C7]'>
				Izohlar ({comments.length})
			</h3>

			{/* Add Comment Box */}
			<div className='flex items-start gap-3 mb-6'>
				<textarea
					className='flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0098C7]'
					rows='2'
					placeholder='Fikringizni yozing...'
					value={newComment}
					onChange={e => setNewComment(e.target.value)}
				/>
				<button
					onClick={handleAddComment}
					className='bg-[#0098C7] text-white px-4 py-2 rounded-lg hover:bg-[#0078a1]'
				>
					Yuborish
				</button>
			</div>

			{/* Comments List */}
			{comments.length === 0 ? (
				<p className='text-gray-500 text-sm'>Hozircha izoh yo‘q.</p>
			) : (
				<div className='space-y-4'>
					{comments.map(c => (
						<div
							key={c.id}
							className='border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 shadow-sm'
						>
							<div className='flex justify-between items-center'>
								<h4 className='font-semibold text-sm text-gray-800 dark:text-gray-200'>
									{c.author}
								</h4>
								<p className='text-xs text-gray-400'>{formatDate(c.date)}</p>
							</div>
							<p className='text-sm text-gray-700 dark:text-gray-300 mt-1'>
								{c.content}
							</p>
							<div className='flex gap-4 mt-2 text-xs text-gray-500'>
								<button
									onClick={() => handleLike(c.id)}
									className='hover:text-[#0098C7] flex items-center gap-1 cursor-pointer'
								>
									<FaThumbsUp /> {c.likes}
								</button>
								<button
									onClick={() => handleDislike(c.id)}
									className='hover:text-red-500 flex items-center gap-1 cursor-pointer'
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
