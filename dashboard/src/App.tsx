import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { authAPI } from './api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Grants from './pages/Grants';
import Scholarships from './pages/Scholarships';
import Competitions from './pages/Competitions';
import Innovations from './pages/Innovations';
import Internships from './pages/Internships';
import Jobs from './pages/Jobs';
import Team from './pages/Team';
import Comments from './pages/Comments';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Applications from './pages/Applications';
import Administrators from './pages/Administrators';
import Articles from './pages/Articles';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
        duration={4000}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="news" element={<News />} />
          <Route path="grants" element={<Grants />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="innovations" element={<Innovations />} />
          <Route path="internships" element={<Internships />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="team" element={<Team />} />
          <Route path="comments" element={<Comments />} />
          <Route path="applications" element={<Applications />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="administrators" element={<Administrators />} />
          <Route path="articles" element={<Articles />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

