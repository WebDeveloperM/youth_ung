import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
// import { Footer } from './components/footer/Footer'
import BreadcrumbComp from './components/breadCrumb'
import Footer from './components/footer/Footer'
import { Header } from './components/header'
import Navbar from './components/navbar'
import { HomePage } from './pages/homepage'
import { LoginPage } from './pages/login'
import { TestAuthPage } from './pages/testauth'
import NewsDetail from './pages/NewsDetail'
import NewsList from './pages/NewsList'
import InnovationsList from './pages/innovationsList'
import InnovationDetail from './pages/innovationDetail'
import TechnologiesList from './pages/technologiesList'
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
import JobsList from './pages/jobsList'
import JobDetail from './pages/jobDetail'
import ProjectsList from './pages/projectsList'
import ProjectDetail from './pages/projectDetail'
import ResearchList from './pages/researchList'
import ResearchDetail from './pages/researchDetail'
import ResultsList from './pages/resultsList'
import ProfilePage from './pages/profile'
import ArticlesList from './pages/articlesList'
import ArticleDetail from './pages/articleDetail'
import SubmitArticle from './pages/submitArticle'
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
			<Route path='/testauth' element={<TestAuthPage />} />
			<Route path='/profile' element={<ProfilePage />} />
			<Route path='/news' element={<NewsList />} />
			<Route path='/news/:id' element={<NewsDetail />} />
			<Route path='/innovations' element={<InnovationsList />} />
			<Route path='/innovations/:id' element={<InnovationDetail />} />
			<Route path='/technologies' element={<TechnologiesList />} />
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
			<Route path='/jobs' element={<JobsList />} />
			<Route path='/jobs/:id' element={<JobDetail />} />
			<Route path='/projects' element={<ProjectsList />} />
			<Route path='/projects/:id' element={<ProjectDetail />} />
			<Route path='/research' element={<ResearchList />} />
			<Route path='/research/:id' element={<ResearchDetail />} />
			<Route path='/results' element={<ResultsList />} />
			<Route path='/articles' element={<ArticlesList />} />
			<Route path='/articles/:id' element={<ArticleDetail />} />
			<Route path='/submit-article' element={<SubmitArticle />} />
		</Routes>

			{!hideHeader && <Footer />}
		</>
	)
}

const App = () => (
	<BrowserRouter>
		<AppContent />
		<Toaster richColors position="top-right" duration={4000} expand={true} />
	</BrowserRouter>
)

export default App
