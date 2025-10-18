import { commentsData } from '@/data/commentsData'
import { newsData } from '@/data/newsData'
import { motion } from 'framer-motion'
import { FaComment, FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function NewsList() {
	const latestNews = [...newsData].sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	)

	return (
		<section
			className='overflow-hidden py-6 px-4 md:px-12'
			aria-labelledby='news-title'
		>
			<div className='mx-auto mb-12 text-center text-[var(--navy-blue)]'>
				<h2 id='news-title' className='text-3xl md:text-4xl font-bold'>
					Последние новости
				</h2>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 container mx-auto py-4 px-4'>
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

							<div className='p-6 flex flex-col justify-between'>
								<div className='flex flex-col gap-3'>
									<h3 className='text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400 group-hover:text-[#0078c2] transition-colors duration-300'>
										{news.title}
									</h3>
									<p
										className='text-muted-foreground text-sm mb-4 flex-1 leading-relaxed line-clamp-3'
										dangerouslySetInnerHTML={{
											__html: news.content.substring(0, 150) + '...',
										}}
									/>
								</div>

								<div className='flex flex-col'>
									<div className='flex justify-between items-center text-sm text-gray-500'>
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
										className='mt-2 inline-block text-[#f97316] font-semibold hover:text-[#fb923c] transition-colors duration-300'
									>
										Batafsil →
									</Link>
								</div>
							</div>
						</motion.article>
					)
				})}
			</div>
		</section>
	)
}
