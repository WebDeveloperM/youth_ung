import { useTranslation } from 'react-i18next'

export function LanguageSelector() {
	const { i18n } = useTranslation()

	const handleChange = e => {
		const lang = e.target.value
		i18n.changeLanguage(lang)
		localStorage.setItem('lang', lang)
	}

	return (
		<div>
			<select
				className='selectlang p-2'
				name='selectLang'
				value={i18n.language}
				onChange={handleChange}
			>
				<option value='uz'>Uz</option>
				<option value='en'>Eng</option>
				<option value='ru'>Rus</option>
			</select>
		</div>
	)
}
