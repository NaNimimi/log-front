import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadsApi } from '@/api/loads'

export const useLoadsStore = defineStore('loads', () => {
  const loads = ref([])
  const currentLoad = ref(null)
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await loadsApi.getAll()
      loads.value = data
    } catch (e) {
      error.value = e.response?.data?.message || 'Error loading loads'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    loading.value = true
    try {
      const { data } = await loadsApi.getOne(id)
      currentLoad.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function createLoad(payload) {
    const { data } = await loadsApi.create(payload)
    loads.value.unshift(data)
    return data
  }

  async function updateLoad(id, payload) {
    const { data } = await loadsApi.update(id, payload)
    const idx = loads.value.findIndex(l => l.id === id)
    if (idx !== -1) loads.value[idx] = data
    if (currentLoad.value?.id === id) currentLoad.value = data
    return data
  }

  async function cancelLoad(id) {
    const { data } = await loadsApi.cancel(id)
    const idx = loads.value.findIndex(l => l.id === id)
    if (idx !== -1) loads.value[idx] = data
    return data
  }

  async function assignLoad(id) {
    const { data } = await loadsApi.assign(id)
    const idx = loads.value.findIndex(l => l.id === id)
    if (idx !== -1) loads.value[idx] = data
    return data
  }

  async function fetchStats() {
    const { data } = await loadsApi.getStats()
    stats.value = data
    return data
  }

  return { loads, currentLoad, stats, loading, error, fetchAll, fetchOne, createLoad, updateLoad, cancelLoad, assignLoad, fetchStats }
})
