import Comments from '@/components/Comments'
import { newsData } from '@/datatest/newsData'
import { FaEye, FaHeart } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
export default function NewsDetail() {
	const { id } = useParams()
	const news = newsData.find(item => item.id === Number(id))

	if (!news)
		return (
			<div className='text-center mt-20 text-gray-500'>Yangilik topilmadi</div>
		)

	return (
		<section className='container mx-auto py-10 px-4'>
			<Link to='/news' className='text-blue-500 hover:underline mb-4 block'>
				← Orqaga
			</Link>
			<img
				src={news.image}
				alt={news.title}
				className='rounded-xl w-full max-h-[480px] object-cover mb-6'
			/>
			<h1 className='text-3xl font-bold text-blue-700 mb-4'>{news.title}</h1>
			<div className='flex gap-3 items-center text-gray-400 text-sm mb-4'>
				<div className='flex gap-0.5 items-center'>{news.date}</div>
				<div className='flex gap-0.5 items-center'>
					<FaHeart size={16} />
					{news.likes}
				</div>
				<div className='flex gap-0.5 items-center'>
					<FaEye size={16} />
					{news.views}
				</div>
			</div>
			<div
				className='prose max-w-none prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-blue-500 prose-blockquote:italic'
				dangerouslySetInnerHTML={{ __html: news.content }}
			/>
			<Comments newsId={news.id} />
		</section>
	)
}
