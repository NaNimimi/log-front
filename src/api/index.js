import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach Bearer token
const attachToken = config => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}

api.interceptors.request.use(attachToken)
adminApi.interceptors.request.use(attachToken)

// Response interceptor — handle 401
const handleAuthError = error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

api.interceptors.response.use(res => res, handleAuthError)
adminApi.interceptors.response.use(res => res, handleAuthError)

export { api, adminApi }
