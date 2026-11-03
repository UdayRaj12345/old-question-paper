
import axios from 'axios'

export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '')
  }

  if (import.meta.env.DEV) {
    return '/api'
  }

  return 'https://paperhub-r8p4.onrender.com/api'
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
})

export const getPapers = async (params = {}) => {
  const { data } = await api.get('/papers', { params })
  return data
}

export const getPaper = async (id) => {
  const { data } = await api.get(`/papers/${id}`)
  return data.data
}

export const getApiHealth = async () => {
  const { data } = await api.get('/health')
  return data
}

export const getUniversities = async () => {
  const { data } = await api.get('/academic/universities')
  return data.data
}

export const getCourses = async () => {
  const { data } = await api.get('/academic/courses')
  return data.data
}

export const getSubjects = async () => {
  const { data } = await api.get('/academic/subjects')
  return data.data
}

export default api
