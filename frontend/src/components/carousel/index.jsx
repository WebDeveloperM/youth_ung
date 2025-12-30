import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

const organizations = [
	{
		link: 'https://minenergy.uz',
		logo: '/logo/carousel/minenergy.png',
		translations: {
			uz: {
				name: 'Energetika vazirligi',
				desc: 'O‘zbekiston Respublikasi Energetika vazirligi',
			},
			ru: {
				name: 'Министерство энергетики',
				desc: 'Министерство энергетики Республики Узбекистан',
			},
			en: {
				name: 'Ministry of Energy',
				desc: 'Ministry of Energy of the Republic of Uzbekistan',
			},
		},
	},
	{
		link: 'https://ung.uz',
		logo: '/logo/carousel/ung.uz.png',
		translations: {
			uz: {
				name: 'O‘zbekneftgaz',
				desc: 'Milliy neft-gaz aksiyadorlik kompaniyasi',
			},
			ru: { name: 'Узбекнефтегаз', desc: 'Национальная нефтегазовая компания' },
			en: {
				name: 'Uzbekneftegaz',
				desc: 'National Oil and Gas Joint Stock Company',
			},
		},
	},
	{
		link: 'http://lex.uz',
		logo: '/logo/carousel/lex.uz.png',
		translations: {
			uz: {
				name: 'Lex.uz',
				desc: "O'zbekiston Respublikasi qonunchilik ma'lumotlari milliy bazasi",
			},
			ru: {
				name: 'Lex.uz',
				desc: 'Национальная база данных законодательства Республики Узбекистан',
			},
			en: {
				name: 'Lex.uz',
				desc: 'National Database of Legislation of the Republic of Uzbekistan',
			},
		},
	},
	{
		link: 'http://utg.uz',
		logo: '/logo/carousel/utg.uz.png',
		translations: {
			uz: { name: 'O‘ztransgaz', desc: 'Gaz transport tizimi operatori' },
			ru: { name: 'Узтрансгаз', desc: 'Оператор газотранспортной системы' },
			en: { name: 'Uztransgaz', desc: 'Gas transmission system operator' },
		},
	},
	{
		link: 'https://sgcc.uz',
		logo: '/logo/carousel/sgcc.uz.png',
		translations: {
			uz: {
				name: 'Shurtan gaz kimyo majmuasi',
				desc: "Mas'uliyati cheklangan jamiyati",
			},
			ru: {
				name: 'Шуртанский ГХК',
				desc: 'Общество с ограниченной ответственностью',
			},
			en: { name: 'Shurtan GCC', desc: 'Limited Liability Company' },
		},
	},
	{
		link: 'https://uzgtl.com',
		logo: '/logo/carousel/uzgtl.com.png',
		translations: {
			uz: { name: 'Uzbekistan GTL', desc: "Mas'uliyati cheklangan jamiyati" },
			ru: {
				name: 'Uzbekistan GTL',
				desc: 'Общество с ограниченной ответственностью',
			},
			en: { name: 'Uzbekistan GTL', desc: 'Limited Liability Company' },
		},
	},
	{
		link: 'https://bnpz.uz',
		logo: '/logo/carousel/bnpz.uz.png',
		translations: {
			uz: {
				name: 'Buxoro neftni qayta ishlash zavodi',
				desc: "Mas'uliyati cheklangan jamiyati",
			},
			ru: {
				name: 'Бухарский НПЗ',
				desc: 'Общество с ограниченной ответственностью',
			},
			en: { name: 'Bukhara Refinery', desc: 'Limited Liability Company' },
		},
	},
]

export function EnergyCarousel() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language || 'uz'

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			align: 'start',
			dragFree: true,
		},
		[
			Autoplay({
				delay: 3000,
				stopOnInteraction: false,
				stopOnMouseEnter: true,
			}),
		]
	)

	const scrollPrev = useCallback(
		() => emblaApi && emblaApi.scrollPrev(),
		[emblaApi]
	)
	const scrollNext = useCallback(
		() => emblaApi && emblaApi.scrollNext(),
		[emblaApi]
	)

	return (
		<div className='container mx-auto py-12 relative px-8 md:px-12 group'>
			<div className='flex items-center justify-between mb-8 max-w-[1400px] mx-auto'>
				<h2 className='text-2xl font-bold text-muted-foreground italic'>
					{t('useful_resources')}
				</h2>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='icon'
						onClick={scrollPrev}
						className='rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm'
					>
						<ChevronLeft className='h-5 w-5' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						onClick={scrollNext}
						className='rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm'
					>
						<ChevronRight className='h-5 w-5' />
					</Button>
				</div>
			</div>

			<div className='relative'>
				<div className='overflow-hidden' ref={emblaRef}>
					<div className='flex gap-6 px-12'>
						{[...organizations, ...organizations].map((org, index) => {
							const content =
								org.translations[currentLang] || org.translations['uz']

							return (
								<div key={index} className='flex m-1.5'>
									<a href={org.link} target='_blank' rel='noopener noreferrer'>
										<Card className='h-full w-64 transition-transform duration-300 shadow-sm hover:shadow-xl group/card cursor-grab active:cursor-grabbing bg-card '>
											<CardContent className='flex flex-col items-center justify-center px-6 py-4'>
												<div className='h-24 bg-card flex items-center justify-center mb-6 overflow-hidden p-3 group-hover/card:scale-105 transition-transform duration-500'>
													<img
														src={org.logo}
														alt={content.name}
														className='w-full h-full object-contain pointer-events-none'
														onError={e => {
															e.target.onerror = null
															e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
																content.name
															)}&background=f0f7ff&color=2563eb&size=128&bold=true`
														}}
													/>
												</div>
												<h3 className='font-bold text-muted-foreground text-center text-lg mb-2 group-hover/card:text-accent-foreground transition-colors'>
													{content.name}
												</h3>
												<p className='text-xs text-center text-slate-500 line-clamp-2 italic leading-relaxed'>
													{content.desc}
												</p>
											</CardContent>
										</Card>
									</a>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
