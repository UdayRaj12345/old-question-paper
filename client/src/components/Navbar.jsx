import { Link } from 'react-router-dom'
import { BookOpen, Search, LogIn, Menu, X, UserCircle, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                QuestionHub
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1 font-medium">
              <Search className="h-4 w-4" />
              Browse Papers
            </Link>
            <Link to="/upload" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">
              Upload
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1 font-medium">
                  <UserCircle className="h-4 w-4" />
                  {user.name}
                </Link>
                <button 
                  onClick={logout}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-full font-medium transition-all"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1 font-medium">
                  <LogIn className="h-4 w-4" />
                  Log in
                </Link>
                <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/search" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Browse Papers</Link>
            <Link to="/upload" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Upload</Link>
            <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Dashboard</Link>
            <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Log in</Link>
            <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary hover:bg-primary/5 rounded-md">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
