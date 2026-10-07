import { useParams, Link } from 'react-router-dom'
import { Download, Bookmark, Share2, AlertTriangle, Star, Eye, Calendar, User, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getPaper, getApiBaseUrl } from '../services/api'

const displayName = (value) => (typeof value === 'object' ? value?.name : value) || 'Not specified'

const PaperDetailsPage = () => {
  const { id } = useParams()
  const [paper, setPaper] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const loadPaper = async () => {
      try {
        const response = await getPaper(id)
        setPaper({
          ...response,
          university: displayName(response.university),
          course: displayName(response.course),
          subject: displayName(response.subject),
          subjectCode: response.subjectCode || response.subject?.code || 'N/A',
          uploadedBy: displayName(response.uploadedBy),
          tags: [response.examType, response.branch, response.language].filter(Boolean),
        })
      } catch (error) {
        setLoadError(error.response?.data?.message || 'Paper could not be loaded from the API.')
      }
    }
    loadPaper()
  }, [id])

  const handleDownload = async () => {
    if (!paper?._id) {
      toast.error('PDF not found')
      return
    }

    const apiBaseUrl = getApiBaseUrl()
    const downloadUrl = `${apiBaseUrl}/papers/${paper._id}/download`
    const downloadFileName = (paper.originalFileName || `${paper.title || 'Paper'}.pdf`).toLowerCase().endsWith('.pdf')
      ? (paper.originalFileName || `${paper.title || 'Paper'}.pdf`)
      : `${paper.originalFileName || `${paper.title || 'Paper'}`}.pdf`

    try {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      })

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`)
      }

      const contentType = response.headers.get('content-type') || 'application/pdf'
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(new Blob([blob], { type: contentType }))
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = downloadFileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(objectUrl)
      toast.success('Download started!')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error(error.message || 'Download failed. Please try again.')
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks!')
  }

  if (loadError) return <p className="mx-auto max-w-7xl px-4 py-8 text-red-600">{loadError}</p>
  if (!paper) return <p className="mx-auto max-w-7xl px-4 py-8 text-gray-500">Loading paper…</p>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/search" className="hover:text-primary transition-colors">{paper.university}</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 dark:text-gray-300 font-medium truncate max-w-[200px]">{paper.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Details & PDF */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {paper.title}
              </h1>
              <div className="flex gap-2 shrink-0">
                <button onClick={handleBookmark} className={`p-2 rounded-xl transition-colors ${isBookmarked ? 'text-primary bg-primary/10' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <Bookmark className="h-6 w-6" fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {paper.academicYear}</div>
              <div className="flex items-center gap-1.5"><User className="h-4 w-4" /> Uploaded by {paper.uploadedBy}</div>
              <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {paper.views || 0} Views</div>
              <div className="flex items-center gap-1.5"><Download className="h-4 w-4" /> {paper.downloads} Downloads</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {paper.tags.map(tag => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Real PDF Viewer */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#2a2a2a] h-[800px] flex flex-col">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{paper.title}.pdf</span>
                <div className="flex gap-2">
                  <a href={paper.pdfURL} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white dark:bg-gray-700 text-xs rounded border border-gray-300 dark:border-gray-600 shadow-sm font-medium hover:bg-gray-50 transition-colors">
                    Open in New Tab
                  </a>
                </div>
              </div>
              <div className="flex-1 w-full h-full">
                {paper.pdfURL ? (
                  <iframe 
                    src={`${paper.pdfURL}#view=FitH`} 
                    title={paper.title} 
                    width="100%" 
                    height="100%" 
                    className="border-0 w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">PDF not available</div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Comments (3)
            </h3>
            
            <div className="flex gap-4 mb-8">
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
                U
              </div>
              <div className="flex-1">
                <textarea 
                  placeholder="Add a comment or ask a question..." 
                  className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[100px] resize-y"
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 shrink-0 font-bold">
                    S{i}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">Student {i}</span>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">This paper was really helpful for my midterms. Are there solutions available for the long answer questions?</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Meta info & CTA */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sticky top-24">
            <button 
              onClick={handleDownload}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-6"
            >
              <Download className="h-5 w-5" /> Download PDF
            </button>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">University</span>
                <span className="font-medium text-gray-900 dark:text-white">{paper.university}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Course</span>
                <span className="font-medium text-gray-900 dark:text-white">{paper.course}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Subject</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">{paper.subject}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Code</span>
                <span className="font-medium text-gray-900 dark:text-white">{paper.subjectCode}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Exam Type</span>
                <span className="font-medium text-gray-900 dark:text-white">{paper.examType}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500">Rating</span>
                <div className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
                  <Star className="h-4 w-4 text-yellow-400" fill="currentColor" /> {paper.rating} / 5.0
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
              <button className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center justify-center gap-1 w-full">
                <AlertTriangle className="h-4 w-4" /> Report an issue with this paper
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaperDetailsPage
