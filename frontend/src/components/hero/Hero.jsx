import logo from '@/assets/logo.png'

const Hero = () => {
	return (
		<section
			className='p-6 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12 lg:space-x-24 container mx-auto'
			aria-labelledby='hero-title'
		>
			<div className='flex-1 text-center md:text-left'>
				<h1
					id='hero-title'
					className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#0098C7]'
				>
					O'zbekneftgaz{' '}
					<span className='text-orange-500'>yoshlar platformasida</span>
				</h1>

				<p className='text-[var(--muted-foreground)] text-base md:text-lg lg:text-xl leading-relaxed mb-8'>
					kelajagingiz poydevorini yarating, tadbirlarimizga ishtirok etib oʻz
					qobiliyatingizni namoyon eting.
				</p>

				<div className='flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-12'>
					<div className='text-center' role='contentinfo'>
						<span className='block text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--navy-blue)]'>
							1000+
						</span>
						<span className='block text-[var(--muted-foreground)] text-sm mt-1'>
							Aktiv a'zolar
						</span>
					</div>
					<div className='text-center' role='contentinfo'>
						<span className='block text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--navy-blue)]'>
							10+
						</span>
						<span className='block text-[var(--muted-foreground)] text-sm mt-1'>
							Amaliyotda
						</span>
					</div>
					<div className='text-center' role='contentinfo'>
						<span className='block text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--navy-blue)]'>
							100+
						</span>
						<span className='block text-[var(--muted-foreground)] text-sm mt-1'>
							G'oyalar
						</span>
					</div>
				</div>
			</div>

			<div className='flex-none flex flex-col items-center'>
				<div className='w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[543px] lg:h-[543px] flex items-center justify-center p-4'>
					<img
						src={logo}
						alt="O'zbekneftgaz Yoshlari tashkiloti logotipi"
						className='w-full h-full object-contain'
					/>
				</div>
			</div>
		</section>
	)
}

export default Hero
