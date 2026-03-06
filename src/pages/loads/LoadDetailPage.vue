<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="d-flex align-items-center mb-4 gap-3">
      <button class="btn btn-outline-secondary btn-sm" @click="$router.back()">
        <i class="bx bx-arrow-back me-1" /> Back
      </button>
      <h4 class="fw-bold mb-0">Load Detail</h4>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" />
    </div>

    <template v-else-if="load">
      <div class="row g-4">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Load #{{ load.load_id || load.id }}</h5>
              <span class="badge fs-6" :class="statusBadge(load.status)">{{ load.status }}</span>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-sm-6">
                  <p class="text-muted mb-1 small">Origin Facility</p>
                  <p class="mb-0 fw-semibold">{{ load.origin_facility?.name || load.origin_facility }}</p>
                </div>
                <div class="col-sm-6">
                  <p class="text-muted mb-1 small">Destination</p>
                  <p class="mb-0 fw-semibold">{{ load.destination }}</p>
                </div>
                <div class="col-sm-6">
                  <p class="text-muted mb-1 small">Origin Date</p>
                  <p class="mb-0">{{ formatDate(load.origin_datetime) }}</p>
                </div>
                <div class="col-sm-6">
                  <p class="text-muted mb-1 small">Destination Date</p>
                  <p class="mb-0">{{ formatDate(load.destination_datetime) }}</p>
                </div>
                <div class="col-sm-6">
                  <p class="text-muted mb-1 small">Total Miles</p>
                  <p class="mb-0">{{ load.total_miles }} mi</p>
                </div>
                <div class="col-sm-6">
                  <p class="text-muted mb-1 small">Payout</p>
                  <p class="mb-0 text-success fw-semibold">${{ load.payout }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-header"><h5 class="mb-0">Actions</h5></div>
            <div class="card-body d-grid gap-2">
              <button class="btn btn-outline-primary" @click="showEdit = true"><i class="bx bx-edit me-1" />Edit Load</button>
              <button class="btn btn-outline-success" @click="assignLoad"><i class="bx bx-user-check me-1" />Assign</button>
              <button class="btn btn-outline-warning" @click="updateStatus"><i class="bx bx-refresh me-1" />Update Status</button>
              <button class="btn btn-outline-danger" @click="cancelLoad"><i class="bx bx-x me-1" />Cancel Load</button>
            </div>
          </div>
        </div>
      </div>

      <LoadFormModal v-if="showEdit" :load="load" @close="showEdit = false" @saved="onSaved" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadsStore } from '@/stores/loads'
import LoadFormModal from '@/components/loads/LoadFormModal.vue'

const route = useRoute()
const loadsStore = useLoadsStore()
const loading = ref(true)
const showEdit = ref(false)

const load = ref(null)
const formatDate = d => d ? new Date(d).toLocaleString() : '—'
const statusBadge = s => ({
  'bg-label-success': s === 'completed',
  'bg-label-warning': s === 'in_progress' || s === 'assigned',
  'bg-label-danger': s === 'cancelled',
  'bg-label-secondary': !s || s === 'pending',
})

async function assignLoad() { try { load.value = await loadsStore.assignLoad(load.value.id) } catch {} }
async function updateStatus() { try { const { data } = await import('@/api/loads').then(m => m.loadsApi.updateStatus(load.value.id)); load.value = data } catch {} }
async function cancelLoad() {
  if (!confirm('Cancel this load?')) return
  try { load.value = await loadsStore.cancelLoad(load.value.id) } catch {}
}
function onSaved() { showEdit.value = false; refresh() }
async function refresh() { load.value = await loadsStore.fetchOne(route.params.id) }

onMounted(async () => {
  try { load.value = await loadsStore.fetchOne(route.params.id) } catch {}
  finally { loading.value = false }
})
</script>
