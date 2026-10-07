import { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { mockUniversities, mockCourses } from '../services/mockData'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    universityName: '',
    courseName: '',
    subjectName: '',
    subjectCode: '',
    semester: '',
    examType: ''
  })

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        if (file.size <= 20 * 1024 * 1024) { // 20MB limit
          setSelectedFile(file)
        } else {
          toast.error("File size exceeds 20MB limit")
        }
      } else {
        toast.error("Only PDF files are allowed")
      }
    }
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        toast.error("Only PDF files are allowed")
      }
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to upload papers")
      navigate('/login')
      return
    }
    if (!selectedFile) {
      toast.error("Please select a PDF file first")
      return
    }

    setUploading(true)

    const uploadData = new FormData()
    uploadData.append('pdf', selectedFile)
    Object.keys(formData).forEach(key => {
      uploadData.append(key, formData[key])
    })

    try {
      await api.post('/papers', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success("Paper uploaded successfully!")
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload paper')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Question Paper</h1>
        <p className="text-gray-500 mt-2">Contribute to the community by uploading previous year papers.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleUpload} className="space-y-8">
          
          {/* File Upload Area */}
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedFile(null)
                  }}
                  className="mt-4 text-sm text-red-500 hover:text-red-600 font-medium z-10 relative"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Click or drag PDF to upload</p>
                <p className="text-sm text-gray-500 mt-2">Maximum file size 20MB</p>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University *</label>
              <select name="universityName" value={formData.universityName} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select University</option>
                {mockUniversities.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course *</label>
              <select name="courseName" value={formData.courseName} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select Course</option>
                {mockCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject Name *</label>
              <input type="text" name="subjectName" value={formData.subjectName} onChange={handleChange} required placeholder="e.g. Data Structures" className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject Code</label>
              <input type="text" name="subjectCode" value={formData.subjectCode} onChange={handleChange} placeholder="e.g. CS201" className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester *</label>
              <select name="semester" value={formData.semester} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select Semester</option>
                {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Type *</label>
              <select name="examType" value={formData.examType} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select Exam Type</option>
                <option value="End Term">End Term</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Class Test">Class Test</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button 
              type="submit" 
              className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading securely...
                </>
              ) : (
                'Submit Paper'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadPage
