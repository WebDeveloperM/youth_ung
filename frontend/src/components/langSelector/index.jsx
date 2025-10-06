import { Icon } from '@iconify/react'

export function LanguageSelector() {
	return (
		<div>
			<select className='selectlang' name='selectLang' defaultValue='uz'>
				<option value='uz'>
					<Icon icon='twemoji-flag-uzbekistan' width={32} height={32} />
					Uz
				</option>
				<option value='en'>Eng</option>
				<option value='ru'>Rus</option>
			</select>
		</div>
	)
}
