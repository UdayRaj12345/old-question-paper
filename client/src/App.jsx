
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/UploadPage'
import PaperDetailsPage from './pages/PaperDetailsPage'
import DashboardPage from './pages/DashboardPage'
import ContactPage from './pages/ContactPage'
import HelpPage from './pages/HelpPage'
import GuidelinesPage from './pages/GuidelinesPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DmcaPage from './pages/DmcaPage'
import LeaderboardPage from './pages/LeaderboardPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="paper/:id" element={<PaperDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="guidelines" element={<GuidelinesPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="dmca" element={<DmcaPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
