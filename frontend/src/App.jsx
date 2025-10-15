import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
// import { Footer } from './components/footer/Footer'
import BreadcrumbComp from './components/breadCrumb'
import Footer from './components/footer/Footer'
import { Header } from './components/header'
import Navbar from './components/navbar'
import { HomePage } from './pages/homepage'
import { LoginPage } from './pages/login'
import NewsDetail from './pages/NewsDetail'
import NewsList from './pages/NewsList'
function AppContent() {
	const location = useLocation()

	const hideHeader = location.pathname === '/login'
	const hideBreadCrumb = location.pathname === '/'
	return (
		<>
			{!hideHeader && <Header />}
			{!hideHeader && <Navbar />}
			{!hideHeader && !hideBreadCrumb && <BreadcrumbComp />}

			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/news' element={<NewsList />} />
				<Route path='/news/:id' element={<NewsDetail />} />
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
