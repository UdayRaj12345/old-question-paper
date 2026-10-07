import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/UploadPage'
import PaperDetailsPage from './pages/PaperDetailsPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        {/* Placeholder routes for later */}
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="paper/:id" element={<PaperDetailsPage />} />
      </Route>
    </Routes>
  )
}

export default App
