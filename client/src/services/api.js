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

const apiBaseUrl = getApiBaseUrl()

const api = axios.create({
  baseURL: apiBaseUrl,
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

export default api
