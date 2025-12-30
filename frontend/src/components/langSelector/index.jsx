import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'
import { useTranslation } from 'react-i18next'

const languages = [
	{ code: 'uz', label: "O'zbek", flag: 'https://flagcdn.com/w40/uz.png' },
	{ code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
	{ code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w40/ru.png' },
]

export function LanguageSelector() {
	const { i18n } = useTranslation()

	const handleChange = lang => {
		i18n.changeLanguage(lang)
		localStorage.setItem('lang', lang)
	}

	const currentLang =
		languages.find(l => l.code === i18n.language) || languages[0]

	return (
		<div className='group'>
			<Select value={i18n.language} onValueChange={handleChange}>
				<SelectTrigger className='h-10 w-[110px] border-none bg-slate-100/50 hover:bg-slate-200/70 dark:bg-slate-800/50 dark:hover:bg-slate-700/70 backdrop-blur-md transition-all duration-300 rounded-xl px-3 gap-2 focus:ring-0 focus:ring-offset-0'>
					<div className='flex items-center gap-2'>
						<img
							src={currentLang.flag}
							alt='flag'
							className='w-5 h-4 object-cover rounded-[2px] contrast-[1.1] saturate-[1.2]'
						/>
						<span className='text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300'>
							{currentLang.code}
						</span>
					</div>
				</SelectTrigger>

				<SelectContent
					align='end'
					className='z-[120] min-w-[150px] rounded-2xl p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200'
				>
					<div className='px-2 py-1.5 mb-1'>
						<p className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>
							Select Language
						</p>
					</div>

					{languages.map(lang => (
						<SelectItem
							key={lang.code}
							value={lang.code}
							className='rounded-xl cursor-pointer mb-0.5 last:mb-0 transition-colors focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-900/30 dark:focus:text-indigo-400'
						>
							<div className='flex items-center gap-3 py-0.5'>
								<img
									src={lang.flag}
									className='w-5 h-3.5 object-cover rounded-sm shadow-sm'
									alt={lang.code}
								/>
								<span className='text-sm font-medium'>{lang.label}</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
