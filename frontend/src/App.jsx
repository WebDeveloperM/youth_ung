import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { HomePage } from './pages/homepage'
import { LoginPage } from './pages/login'

function AppContent() {
	const location = useLocation()

	const hideHeader = location.pathname === '/login'

	return (
		<>
			{!hideHeader && <Header />}

			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} />
			</Routes>

			{!hideHeader && <Footer />}
		</>
	)
}

const App = () => (
	<BrowserRouter>
		<AppContent />
	</BrowserRouter>
)

export default App
