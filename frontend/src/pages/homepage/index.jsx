import { EnergyCarousel } from '@/components/carousel'
import Hero from '@/components/hero/Hero'
import NewsListMainpage from '@/components/newsListMainpage'

export function HomePage() {
	return (
		<div className='relative'>
			<div className='absolute  w-full h-[90vh] -z-10 overflow-hidden'>
				<img
					src='/youth_background.jpeg'
					className='w-full h-full object-cover '
					alt='Background'
				/>
				<div className='absolute inset-0 bg-slate-700/50 mix-blend-multiply' />
				<div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/0.5 to-background' />
			</div>

			<Hero />
			<div className='container mx-auto px-4 space-y-20 pb-20'>
				<NewsListMainpage />
				<EnergyCarousel />
			</div>
		</div>
	)
}
