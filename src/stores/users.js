import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usersApi } from '@/api/users'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const currentUser = ref(null)
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll(search = '') {
    loading.value = true
    error.value = null
    try {
      const { data } = await usersApi.getAll(search)
      users.value = data
    } catch (e) {
      error.value = e.response?.data?.message || 'Error fetching users'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    loading.value = true
    try {
      const { data } = await usersApi.getOne(id)
      currentUser.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function createUser(payload) {
    const { data } = await usersApi.create(payload)
    users.value.unshift(data)
    return data
  }

  async function updateUser(id, payload) {
    const { data } = await usersApi.update(id, payload)
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) users.value[idx] = data
    return data
  }

  async function deleteUser(id) {
    await usersApi.delete(id)
    users.value = users.value.filter(u => u.id !== id)
  }

  async function toggleActive(id) {
    const { data } = await usersApi.toggleActive(id)
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) users.value[idx] = { ...users.value[idx], ...data }
    return data
  }

  async function fetchStats() {
    const { data } = await usersApi.getStats()
    stats.value = data
    return data
  }

  return { users, currentUser, stats, loading, error, fetchAll, fetchOne, createUser, updateUser, deleteUser, toggleActive, fetchStats }
})
