import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    const sessionToken = localStorage.getItem('sessionToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (sessionToken) {
      config.headers['X-Session-Token'] = sessionToken
    }
  }
  return config
})

// Handle session expired errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.code === 'SESSION_INVALID') {
      // Clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('sessionToken')
        window.location.href = '/login?session_expired=true'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth API
export const authApi = {
  register: (data: { fullName: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  me: () => api.get('/auth/me'),
}

// Public API
export const publicApi = {
  getCourses: () => api.get('/courses'),
  getCourse: (slug: string) => api.get(`/courses/${slug}`),
  getCms: (section: string) => api.get(`/cms/${section}`),
}

// Student API
export const studentApi = {
  getMyCourses: () => api.get('/my-courses'),
  getMyCourse: (slug: string) => api.get(`/my-courses/${slug}`),
  getLesson: (id: number) => api.get(`/lessons/${id}`),
  startView: (id: number) => api.post(`/lessons/${id}/view`),
  getViewStatus: (id: number) => api.get(`/lessons/${id}/view-status`),
}
