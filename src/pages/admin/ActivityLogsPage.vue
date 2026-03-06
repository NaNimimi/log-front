<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold mb-4">Activity Logs</h4>
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-hover">
          <thead>
            <tr><th>ID</th><th>User</th><th>Action</th><th>Description</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary" /></td></tr>
            <tr v-else-if="!logs.length"><td colspan="5" class="text-center py-4 text-muted">No activity logs</td></tr>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ log.id }}</td>
              <td>{{ log.user?.email || log.user_id || '—' }}</td>
              <td><span class="badge bg-label-primary">{{ log.action }}</span></td>
              <td>{{ log.description || '—' }}</td>
              <td>{{ formatDate(log.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { activityLogsApi } from '@/api/analytics'

const logs = ref([])
const loading = ref(false)

const formatDate = d => d ? new Date(d).toLocaleString() : '—'

onMounted(async () => {
  loading.value = true
  try { const { data } = await activityLogsApi.getAll(); logs.value = Array.isArray(data) ? data : data?.logs || [] }
  catch {}
  finally { loading.value = false }
})
</script>
