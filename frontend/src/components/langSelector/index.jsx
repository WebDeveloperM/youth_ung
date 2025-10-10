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
				className='selectlang border rounded p-2'
				name='selectLang'
				defaultValue={localStorage.getItem('lang') || 'uz'}
				onChange={handleChange}
			>
				<option value='uz'>Uz</option>
				<option value='en'>Eng</option>
				<option value='ru'>Rus</option>
			</select>
		</div>
	)
}
