import { useState, useEffect } from 'react'
import { User, Mail, Moon, Sun, BookOpen, Download, Settings, Save, LogOut, GraduationCap, Calendar, GitBranch } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

const DashboardPage = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, loading, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [userPapers, setUserPapers] = useState([])
  const [loadingPapers, setLoadingPapers] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    collegeName: '',
    courseName: '',
    branch: '',
    semester: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (user) {
      setFormData({
        name: user.name || '',
        collegeName: user.college?.name || '',
        courseName: user.course?.name || '',
        branch: user.branch || '',
        semester: user.semester || ''
      })
      
      const fetchPapers = async () => {
        setLoadingPapers(true)
        try {
          const res = await api.get(`/papers?uploadedBy=${user._id}&sort=-createdAt`)
          if (res.data && res.data.success) {
            setUserPapers(res.data.data)
          }
        } catch (err) {
          console.error("Failed to load papers", err)
        } finally {
          setLoadingPapers(false)
        }
      }
      fetchPapers()
    }
  }, [user, loading, navigate])

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-72 shrink-0">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sticky top-24">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user.college?.name || user.role}</p>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Settings className="h-5 w-5" /> Profile Settings
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'stats' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <BookOpen className="h-5 w-5" /> My Uploads
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button 
                onClick={async () => {
                  await logout()
                  navigate('/login')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium mt-4"
              >    
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Theme Settings Card */}
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Theme Preference</h4>
                    <p className="text-sm text-gray-500">Toggle between light and dark mode</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {theme === 'dark' ? <><Sun className="h-4 w-4 text-yellow-500" /> Light Mode</> : <><Moon className="h-4 w-4 text-primary" /> Dark Mode</>}
                  </button>
                </div>
              </div>

              {/* Profile Details Card */}
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.email}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">College</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.college?.name || 'Not Provided'}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Course</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.course?.name || 'Not Provided'} {user.branch ? `- ${user.branch}` : ''}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Edit Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="email" 
                          value={user.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">College Name</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="text" 
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          placeholder="e.g. BBD University"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="text" 
                          name="courseName"
                          value={formData.courseName}
                          onChange={handleChange}
                          placeholder="e.g. B.Tech"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Branch</label>
                      <div className="relative">
                        <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="text" 
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          placeholder="e.g. Computer Science"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester (Course Started)</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="number" 
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          placeholder="e.g. 1"
                          min="1"
                          max="10"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70">
                      <Save className="h-5 w-5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 rounded-2xl border border-primary/20">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-white dark:bg-dark-card p-3 rounded-xl shadow-sm">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Papers Uploaded</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{userPapers.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-white dark:bg-dark-card p-3 rounded-xl shadow-sm">
                      <Download className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userPapers.reduce((acc, paper) => acc + (paper.downloads || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload History List */}
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Uploads</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loadingPapers ? (
                    <div className="p-8 text-center text-gray-500">Loading papers...</div>
                  ) : userPapers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">You haven't uploaded any papers yet.</div>
                  ) : (
                    userPapers.map((paper) => (
                      <div key={paper._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{paper.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Uploaded on {new Date(paper.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${paper.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                            {paper.status || 'Pending'}
                          </span>
                          <span className="text-gray-500 text-sm font-medium flex items-center gap-1"><Download className="h-4 w-4" /> {paper.downloads || 0}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
