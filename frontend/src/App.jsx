import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'

// Components
import BreadcrumbComp from './components/breadCrumb'
import Footer from './components/footer/Footer'
import { Header } from './components/header'
import Navbar from './components/navbar'

// Pages
import AboutPage from './pages/about'
import AppealsPage from './pages/appeals'
import { HomePage } from './pages/homepage'
import ProfilePage from './pages/profile'
import SubmitArticle from './pages/submitArticle'
import TeamPage from './pages/team'
import { TestAuthPage } from './pages/testauth'

// List Pages
import ArticlesList from './pages/articlesList'
import CompetitionsList from './pages/competitionsList'
import GrantsList from './pages/grantsList'
import InnovationsList from './pages/innovationsList'
import InternshipsList from './pages/internshipsList'
import JobsList from './pages/jobsList'
import NewsList from './pages/newsList'
import ProjectsList from './pages/projectsList'
import ResearchList from './pages/researchList'
import ResultsList from './pages/resultsList'
import ScholarshipsList from './pages/scholarshipsList'
import TechnologiesList from './pages/technologiesList'

// Detail Pages
import ScrollToTop from './components/configs/ScrollToTop'
import ArticleDetail from './pages/articleDetail'
import CompetitionDetail from './pages/competitionDetail'
import GrantDetail from './pages/grantDetail'
import InnovationDetail from './pages/innovationDetail'
import InternshipDetail from './pages/internshipDetail'
import JobDetail from './pages/jobDetail'
import NewsDetail from './pages/newsDetail'
import ProjectDetail from './pages/projectDetail'
import ResearchDetail from './pages/researchDetail'
import ResultDetail from './pages/resultDetail'
import ScholarshipDetail from './pages/scholarshipDetail'
import TechnologyDetail from './pages/technologyDetail'

function AppContent() {
	const location = useLocation()

	// Sahifa holatlarini aniqlash
	const isLoginPage = location.pathname === '/login'
	const isHomePage = location.pathname === '/'

	return (
		<>
			{/* Login sahifasida Header va Navbarni ko'rsatmaslik */}
			{!isLoginPage && (
				<>
					<Header />
					<Navbar />
				</>
			)}

			{/* Asosiy sahifada va Login sahifasida Breadcrumb ko'rsatmaslik */}
			{!isHomePage && !isLoginPage && <BreadcrumbComp />}

			<main className='min-h-screen'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/testauth' element={<TestAuthPage />} />
					<Route path='/profile' element={<ProfilePage />} />
					<Route path='/appeals' element={<AppealsPage />} />
					<Route path='/about' element={<AboutPage />} />
					<Route path='/team' element={<TeamPage />} />
					<Route path='/submit-article' element={<SubmitArticle />} />

					{/* Dinamik yo'nalishlar (Dynamic Routes) */}
					<Route path='/news' element={<NewsList />} />
					<Route path='/news/:id' element={<NewsDetail />} />

					<Route path='/innovations' element={<InnovationsList />} />
					<Route path='/innovations/:id' element={<InnovationDetail />} />

					<Route path='/technologies' element={<TechnologiesList />} />
					<Route path='/technologies/:id' element={<TechnologyDetail />} />

					<Route path='/competitions' element={<CompetitionsList />} />
					<Route path='/competitions/:id' element={<CompetitionDetail />} />

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
					<Route path='/results/:id' element={<ResultDetail />} />

					<Route path='/articles' element={<ArticlesList />} />
					<Route path='/articles/:id' element={<ArticleDetail />} />
				</Routes>
			</main>

			{<Footer />}
		</>
	)
}

const App = () => (
	<BrowserRouter>
		<ScrollToTop />
		<AppContent />
		<Toaster richColors position='top-right' duration={4000} expand={true} />
	</BrowserRouter>
)

export default App
