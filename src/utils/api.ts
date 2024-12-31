import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  xsrfCookieName: 'laravel_session',
  xsrfHeaderName: 'X-CSRF-TOKEN',
})

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('x-token')
    const laravelSession = Cookies.get('laravel_session')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (laravelSession) {
      config.headers.Cookie = `laravel_session=${laravelSession}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
