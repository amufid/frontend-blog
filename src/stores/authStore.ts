import api from '@/utils/api'
import { baseURL } from '@/utils/baseUrl'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

interface AuthState {
  user: string | null
  token: string | null
  isAuthenticated: boolean
}

const state = ref<AuthState>({
  user: null,
  token: null,
  isAuthenticated: false,
})

export const useAuthStore = defineStore('auth', () => {
  const setAuthState = (user: string | null, token: string | null, isAuthenticated: boolean) => {
    state.value.user = user
    state.value.token = token
    state.value.isAuthenticated = isAuthenticated
  }

  const login = (token: string) => {
    setAuthState(null, token, true)
    Cookies.set('x-token', token)
  }

  const token = Cookies.get('x-token')

  const fetchUser = async () => {
    try {
      const response = await api.get(`${baseURL}/user`)
      if (response.status === 200) {
        setAuthState(response.data.name, token || null, true)
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      }
    } catch (error) {
      console.error('Gagal memuat user:', error)
      logout()
    }
  }

  const logout = () => {
    setAuthState(null, null, false)
    Cookies.remove('x-token')
    window.location.href = '/login'
  }

  onMounted(() => {
    if (token) {
      fetchUser()
    }
  })

  return {
    state,
    login,
    fetchUser,
    logout,
  }
})
