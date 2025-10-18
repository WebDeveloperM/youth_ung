import { commentsData } from '@/datatest/commentsData'
import { newsData } from '@/datatest/newsData'
import { motion } from 'framer-motion'
import { FaComment, FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function NewsListMainpage() {
	const latestNews = [...newsData]
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		.slice(0, 3)

	return (
		<section
			className='relative overflow-hidden  py-6 px-4 md:px-12'
			aria-labelledby='news-title'
		>
			<div className='max-w-6xl mx-auto mb-12 text-center'>
				<h2 id='news-title' className='text-3xl md:text-4xl font-extrabold'>
					Последние новости
				</h2>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 container mx-auto py-10 px-4'>
				{latestNews.map((news, index) => {
					const commentCount = commentsData.filter(
						c => c.newsId === news.id
					).length
					return (
						<motion.article
							key={news.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className='group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
						>
							<div className='relative h-48 overflow-hidden'>
								<motion.img
									src={news.image}
									alt={news.title}
									className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
								/>
								<div className='absolute inset-0 group-hover:opacity-40 transition-all duration-500' />
							</div>

							<div className='p-6 flex flex-col text-[#0f172a]'>
								<h3 className='text-lg font-semibold mb-2 group-hover:text-[#0078c2] transition-colors duration-300'>
									{news.title}
								</h3>
								<p
									className='text-gray-600 text-sm mb-4 flex-1 leading-relaxed line-clamp-3'
									dangerouslySetInnerHTML={{
										__html: news.content.substring(0, 150) + '...',
									}}
								/>
								<div className='flex justify-between items-center mt-auto text-sm text-gray-500'>
									<div className='flex items-center gap-3'>
										<span className='flex items-center gap-1'>
											<FaEye className='text-[#0078c2]' /> {news.views}
										</span>
										<span className='flex items-center gap-1'>
											<FaComment className='text-[#0078c2]' /> {commentCount}
										</span>
									</div>
									<span>{news.date}</span>
								</div>
								<Link
									to={`/news/${news.id}`}
									className='mt-4 inline-block text-[#f97316] font-semibold hover:text-[#fb923c] transition-colors duration-300'
								>
									Batafsil →
								</Link>
							</div>
						</motion.article>
					)
				})}
			</div>

			<div className='mt-16 flex justify-center'>
				<Link
					to='/news'
					className='inline-block px-8 py-3 rounded-full bg-[#0078c2] text-white font-semibold shadow-md hover:bg-[#0064a3] transition-all duration-300'
				>
					Barcha yangiliklar →
				</Link>
			</div>
		</section>
	)
}
