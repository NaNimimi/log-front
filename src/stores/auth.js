import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles?.some(r => r.slug === 'admin') ?? false)

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.login(email, password)
      token.value = data.token
      localStorage.setItem('auth_token', data.token)
      await fetchMe()
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    const { data } = await authApi.me()
    user.value = data
    return data
  }

  async function logout() {
    try { await authApi.logout() } catch {}
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  async function logoutAll() {
    try { await authApi.logoutAll() } catch {}
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  async function changePassword(current_password, new_password) {
    const { data } = await authApi.changePassword(current_password, new_password)
    return data
  }

  return { token, user, loading, error, isAuthenticated, isAdmin, login, logout, logoutAll, fetchMe, changePassword }
})
