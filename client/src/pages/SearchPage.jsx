import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Download, Star, Clock, Book, ChevronDown } from 'lucide-react'
import { mockUniversities, mockCourses } from '../services/mockData'
import { getPapers } from '../services/api'

const displayName = (value) => (typeof value === 'object' ? value?.name : value) || 'Not specified'

const normalisePaper = (paper) => ({
  ...paper,
  id: paper._id,
  university: displayName(paper.university),
  course: displayName(paper.course),
  subject: displayName(paper.subject),
  subjectCode: paper.subjectCode || paper.subject?.code || 'N/A',
})

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [papers, setPapers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filters state
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')

  useEffect(() => {
    let isCurrent = true

    const loadPapers = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await getPapers({ search: query || undefined, limit: 50 })
        if (!isCurrent) return

        let results = response.data.map(normalisePaper)
        if (selectedUniversity) results = results.filter((paper) => paper.university === selectedUniversity)
        if (selectedCourse) results = results.filter((paper) => paper.course === selectedCourse)
        if (selectedSemester) results = results.filter((paper) => String(paper.semester) === selectedSemester.replace(/\D/g, ''))
        setPapers(results)
      } catch (requestError) {
        if (isCurrent) {
          setPapers([])
          setError(requestError.response?.data?.message || 'Could not connect to the API. Start the server on port 5000 and check MongoDB.')
        }
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    loadPapers()
    return () => { isCurrent = false }
  }, [query, selectedUniversity, selectedCourse, selectedSemester])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ q: query })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sticky top-24">
          <div className="flex items-center gap-2 font-bold text-lg mb-6 text-gray-900 dark:text-white">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University</label>
              <select 
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="">All Universities</option>
                {mockUniversities.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="">All Courses</option>
                {mockCourses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
              <select 
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="">All Semesters</option>
                {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => (
                  <option key={s} value={s}>{s} Semester</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => {
                setSelectedUniversity('')
                setSelectedCourse('')
                setSelectedSemester('')
                setQuery('')
                setSearchParams({})
              }}
              className="w-full py-2 text-sm text-gray-500 hover:text-primary transition-colors border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for papers..." 
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
              />
            </div>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-colors hidden sm:block">
              Search
            </button>
            <button 
              type="button" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 p-3 rounded-xl text-gray-600 dark:text-gray-300"
            >
              <Filter className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {papers.length} Results found
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Sort by:</span>
            <select className="bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-gray-900 dark:text-white outline-none">
              <option>Most Relevant</option>
              <option>Newest</option>
              <option>Most Downloaded</option>
              <option>Highest Rated</option>
            </select>
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500">Loading papers…</div>
          ) : papers.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No papers found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            papers.map(paper => (
              <Link key={paper.id} to={`/paper/${paper.id}`} className="block group">
                <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition-all hover:border-primary/50 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {paper.subjectCode}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
                          <Book className="w-3 h-3" /> {paper.examType}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {paper.title}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {paper.university} • {paper.course} • {paper.semester} Semester • {paper.academicYear}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-gray-400" />
                          {paper.downloads} Downloads
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                          {paper.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {new Date(paper.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center sm:items-start justify-end sm:flex-col gap-2">
                      <button className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-3 rounded-xl transition-colors flex items-center justify-center">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
