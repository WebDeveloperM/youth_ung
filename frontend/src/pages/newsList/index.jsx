import { commentsData } from '@/data/commentsData'
import { newsData } from '@/data/newsData'
import { FaComment, FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function NewsList() {
	return (
		<section className='container mx-auto py-10 px-4'>
			<h1 className='text-2xl font-bold mb-6 text-blue-600'>Yangiliklar</h1>

			<div className='grid md:grid-cols-3 gap-6'>
				{newsData.map(news => (
					<div
						key={news.id}
						className='rounded-xl shadow hover:shadow-lg transition p-4'
					>
						<img
							src={news.image}
							alt={news.title}
							className='rounded-lg w-full h-48 object-cover mb-4'
						/>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
							{news.title}
						</h2>
						<div
							className='text-gray-600 text-sm line-clamp-4 prose prose-sm dark:prose-invert'
							dangerouslySetInnerHTML={{
								__html: news.content.substring(0, 200) + '...',
							}}
						/>
						<div className='flex justify-end gap-4 text-sm text-gray-400 mb-3'>
							<span>{news.date}</span>
							<span className='flex items-center gap-0.5'>
								<FaEye size={16} /> {news.views}
							</span>
							<span className='flex items-center gap-0.5'>
								<FaComment size={16} />
								{commentsData.filter(c => c.newsId === news.id).length}
							</span>
						</div>
						<Link
							to={`/news/${news.id}`}
							className='text-blue-500 font-medium hover:underline'
						>
							Batafsil→
						</Link>
					</div>
				))}
			</div>
		</section>
	)
}
