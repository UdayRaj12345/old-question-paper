import { BookOpen } from 'lucide-react'
import { FaGithub, FaTelegram, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                PaperHub
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Access Era University question papers in one place. Search by course, semester, subject, or exam year to find study resources and prepare for your exams.
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/Udayraj75" className="text-gray-400 hover:text-primary transition-colors">
                <FaTelegram className="h-5 w-5" />
              </a>
              <a href="https://github.com/UdayRaj12345" className="text-gray-400 hover:text-primary transition-colors">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/uday-raj-5830372a2/" className="text-gray-400 hover:text-primary transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/search" className="hover:text-primary transition-colors">Browse Papers</Link></li>
              <li><Link to="/upload" className="hover:text-primary transition-colors">Upload a Paper</Link></li>

              <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Top Contributors</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/guidelines" className="hover:text-primary transition-colors">Upload Guidelines</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/dmca" className="hover:text-primary transition-colors">DMCA Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} PaperHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
