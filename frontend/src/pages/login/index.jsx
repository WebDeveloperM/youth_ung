import Auth from '@/components/Auth/Auth'
import { LanguageProvider } from '@/contexts/LanguageContext'
export function LoginPage() {
	return (
		<LanguageProvider>
			<Auth />
		</LanguageProvider>
	)
}
