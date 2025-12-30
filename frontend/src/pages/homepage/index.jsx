// TO'G'RI: Nomli eksportni jingalak qavs bilan import qilish
import { EnergyCarousel } from '@/components/carousel'
import Hero from '@/components/hero/Hero'
import NewsListMainpage from '@/components/newsListMainpage'

export function HomePage() {
	return (
		<>
			<Hero />
			<NewsListMainpage />
			<EnergyCarousel />
		</>
	)
}
