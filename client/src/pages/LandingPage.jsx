import { motion } from 'framer-motion'
import { Search, Download, ShieldCheck, ArrowRight, BookOpen, GraduationCap, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const LandingPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const stats = [
    { label: 'Total Papers', value: '10,000+', icon: BookOpen },
    { label: 'Universities', value: '50+', icon: GraduationCap },
    { label: 'Active Students', value: '25,000+', icon: Users },
    { label: 'Downloads', value: '1M+', icon: Download },
  ]

  const features = [
    {
      title: 'Easy Search',
      description: 'Advanced filtering by university, course, semester, and subject code.',
      icon: Search,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Instant Download',
      description: 'Preview and download PDF question papers instantly with no wait times.',
      icon: Download,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Verified Papers',
      description: 'All papers are verified by faculty or trusted community members.',
      icon: ShieldCheck,
      color: 'bg-purple-500/10 text-purple-500',
    },
  ]

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: AI-Powered Search is Live!
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
            The Ultimate Hub for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Previous Year Papers
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Ace your exams with QuestionHub. Search, preview, and download thousands of verified previous year question papers from top universities.
          </p>

          <div className="w-full max-w-2xl mx-auto bg-white dark:bg-dark-card p-2 rounded-2xl shadow-xl shadow-primary/10 border border-gray-200 dark:border-gray-800">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search className="absolute left-4 h-6 w-6 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject, code, or university..." 
                className="w-full pl-12 pr-32 py-4 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white text-lg placeholder-gray-400"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-hover text-white px-6 rounded-xl font-medium transition-colors flex items-center gap-2">
                Search
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Popular searches:</span>
            <Link to="/search?q=Data+Structures" className="hover:text-primary transition-colors underline decoration-dotted">Data Structures</Link>
            <Link to="/search?q=Operating+Systems" className="hover:text-primary transition-colors underline decoration-dotted">Operating Systems</Link>
            <Link to="/search?q=Engineering+Maths" className="hover:text-primary transition-colors underline decoration-dotted">Engineering Maths</Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
    { /* <section className="border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="bg-primary/10 p-4 rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why choose QuestionHub?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to prepare for your exams efficiently, all in one place.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              
              <div className="mt-8 flex items-center text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        <div className="bg-gradient-to-br from-primary to-purple-800 rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to ace your exams?</h2>
            <p className="text-purple-100 text-lg md:text-xl mb-10">
              Join thousands of students who are already using QuestionHub to improve their grades. Registration is free and takes less than a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg">
                Create Free Account
              </Link>
              <Link to="/search" className="bg-primary-hover text-white border border-purple-400 hover:bg-purple-600 px-8 py-4 rounded-full font-bold text-lg transition-colors">
                Browse Papers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
