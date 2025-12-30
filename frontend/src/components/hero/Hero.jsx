import logo from '/white.png'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useTranslation } from 'react-i18next'

const Hero = () => {
	const { t } = useTranslation()

	return (
		<section
			className='container mx-auto py-32 md:py-48 flex flex-col md:flex-row items-center justify-center px-6 md:px-8 gap-12 md:gap-24 md:overflow-x-hidden '
			aria-labelledby='hero-title'
		>
			<div className='flex flex-col lg:flex-row items-stretch gap-6 w-full mx-auto'>
				{/* LEFT SIDE: TEXT & COUNTERS */}
				<div className='flex-1 flex flex-col gap-6'>
					{/* TITLE & DESCRIPTION (3/4 qism) */}
					<div className='flex-[3] font-[montserrat] flex flex-col justify-center text-center md:text-left bg-background/80 px-8 md:px-16 py-10 rounded-2xl'>
						<h1
							id='hero-title'
							className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#0098C7]'
						>
							{t('hero.title')}{' '}
							<span className='text-orange-500'>
								{t('hero.titleHighlight')}
							</span>
						</h1>
						<p className='text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed'>
							{t('hero.description')}
						</p>
					</div>

					{/* COUNTERS (1/4 qism) */}
					<div className='flex-[1] flex items-center justify-center md:justify-start bg-background/80 px-8 md:px-16 py-6 rounded-2xl'>
						<div className='flex flex-row flex-wrap justify-center md:justify-start gap-8 lg:gap-12 w-full'>
							{[
								{ end: 1000, suffix: '+', label: t('hero.activeMembers') },
								{ end: 10, suffix: '+', label: t('hero.inPractice') },
								{ end: 100, suffix: '+', label: t('hero.ideas') },
							].map((item, idx) => (
								<motion.div key={idx} className='text-center md:text-left'>
									<span className='block text-2xl lg:text-3xl font-bold'>
										<CountUp
											end={item.end}
											duration={2.5}
											suffix={item.suffix}
											enableScrollSpy
										/>
									</span>
									<span className='block text-muted-foreground text-[10px] lg:text-xs uppercase tracking-widest mt-1'>
										{item.label}
									</span>
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* RIGHT SIDE: IMAGE (Logo) */}
				<div className='flex-none lg:w-1/3 xl:w-2/5 flex items-center justify-center bg-background/80 p-8 rounded-2xl'>
					<div className='relative w-full aspect-square flex items-center justify-center overflow-hidden'>
						<img
							src={logo}
							alt="O'zbekneftgaz Yoshlari logotipi"
							className='w-full h-full object-contain'
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hero
