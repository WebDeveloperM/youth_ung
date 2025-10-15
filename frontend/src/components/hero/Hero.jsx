import logo from '@/assets/logo.png'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

const Hero = () => {
	return (
		<section
			className='container mx-auto flex flex-col md:flex-row items-center justify-center px-4 md:px-8 py-12 gap-12 md:gap-24 md:overflow-x-hidden'
			aria-labelledby='hero-title'
		>
			{/* LEFT SIDE TEXT */}
			<div className='flex-1 text-center md:text-left'>
				<h1
					id='hero-title'
					className='text-2xl py-2 md:text-3xl lg:text-4xl font-bold mb-4 text-[#0098C7]'
				>
					O'zbekneftgaz{' '}
					<span className='text-orange-500'>yoshlar platformasida</span>
				</h1>

				<p className='text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed mb-8'>
					kelajagingiz poydevorini yarating, tadbirlarimizga ishtirok etib oʻz
					qobiliyatingizni namoyon eting.
				</p>

				<div className='flex flex-col sm:flex-row justify-center md:justify-start gap-6'>
					{[
						{ end: 1000, suffix: '+', label: "Aktiv a'zolar" },
						{ end: 10, suffix: '+', label: 'Amaliyotda' },
						{ end: 100, suffix: '+', label: "G'oyalar" },
					].map((item, idx) => (
						<motion.div
							key={idx}
							className='text-center'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: idx * 0.2,
								ease: 'easeIn',
							}}
							viewport={{ once: true }}
						>
							<span className='block text-3xl lg:text-4xl font-bold text-[var(--navy-blue)] py-2'>
								<CountUp
									end={item.end}
									duration={2.5}
									suffix={item.suffix}
									enableScrollSpy
									easingFn={(t, b, c, d) =>
										c * (1 - Math.pow(1 - t / d, 3)) + b
									}
								/>
							</span>
							<span className='block text-muted-foreground text-sm mt-1'>
								{item.label}
							</span>
						</motion.div>
					))}
				</div>
			</div>

			{/* RIGHT SIDE IMAGE */}
			<div className='flex-none flex flex-col items-center'>
				<div className='w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] flex items-center justify-center overflow-hidden'>
					<img
						src={logo}
						alt="O'zbekneftgaz Yoshlari logotipi"
						className='w-full h-full object-contain'
					/>
				</div>
			</div>
		</section>
	)
}

export default Hero
