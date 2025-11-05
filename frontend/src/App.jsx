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
import InnovationsList from './pages/innovationsList'
import InnovationDetail from './pages/innovationDetail'
import AboutPage from './pages/about'
import CompetitionsList from './pages/competitionsList'
import CompetitionDetail from './pages/competitionDetail'
import TeamPage from './pages/team'
import GrantsList from './pages/grantsList'
import GrantDetail from './pages/grantDetail'
import ScholarshipsList from './pages/scholarshipsList'
import ScholarshipDetail from './pages/scholarshipDetail'
import InternshipsList from './pages/internshipsList'
import InternshipDetail from './pages/internshipDetail'
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
			<Route path='/innovations' element={<InnovationsList />} />
			<Route path='/innovations/:id' element={<InnovationDetail />} />
			<Route path='/about' element={<AboutPage />} />
			<Route path='/competitions' element={<CompetitionsList />} />
			<Route path='/competitions/:id' element={<CompetitionDetail />} />
			<Route path='/team' element={<TeamPage />} />
			<Route path='/grants' element={<GrantsList />} />
			<Route path='/grants/:id' element={<GrantDetail />} />
			<Route path='/scholarships' element={<ScholarshipsList />} />
			<Route path='/scholarships/:id' element={<ScholarshipDetail />} />
			<Route path='/internships' element={<InternshipsList />} />
			<Route path='/internships/:id' element={<InternshipDetail />} />
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
