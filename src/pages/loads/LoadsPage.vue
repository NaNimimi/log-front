<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Loads</h4>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bx bx-plus me-1" /> New Load
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4" v-if="loadsStore.stats">
      <div class="col-sm-6 col-xl-3">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="avatar flex-shrink-0 me-3">
              <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-package" /></span>
            </div>
            <div>
              <p class="mb-0 text-muted small">Total Loads</p>
              <h5 class="mb-0">{{ loadsStore.stats.total ?? '—' }}</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="avatar flex-shrink-0 me-3">
              <span class="avatar-initial rounded bg-label-success"><i class="bx bx-check-circle" /></span>
            </div>
            <div>
              <p class="mb-0 text-muted small">Completed</p>
              <h5 class="mb-0">{{ loadsStore.stats.completed ?? '—' }}</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="avatar flex-shrink-0 me-3">
              <span class="avatar-initial rounded bg-label-warning"><i class="bx bx-time" /></span>
            </div>
            <div>
              <p class="mb-0 text-muted small">In Progress</p>
              <h5 class="mb-0">{{ loadsStore.stats.in_progress ?? '—' }}</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="avatar flex-shrink-0 me-3">
              <span class="avatar-initial rounded bg-label-danger"><i class="bx bx-x-circle" /></span>
            </div>
            <div>
              <p class="mb-0 text-muted small">Cancelled</p>
              <h5 class="mb-0">{{ loadsStore.stats.cancelled ?? '—' }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loads Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">All Loads</h5>
        <div class="input-group" style="max-width:250px">
          <span class="input-group-text"><i class="bx bx-search" /></span>
          <input v-model="search" type="text" class="form-control" placeholder="Search..." />
        </div>
      </div>
      <div class="table-responsive text-nowrap">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Load ID</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Miles</th>
              <th>Payout</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadsStore.loading">
              <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" />
              </td>
            </tr>
            <tr v-else-if="filteredLoads.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">No loads found</td>
            </tr>
            <tr v-for="load in filteredLoads" :key="load.id">
              <td><strong>#{{ load.load_id || load.id }}</strong></td>
              <td>{{ load.origin_facility?.name || load.origin_facility }}</td>
              <td>{{ load.destination }}</td>
              <td>{{ load.total_miles }} mi</td>
              <td>${{ load.payout }}</td>
              <td>
                <span class="badge" :class="statusBadge(load.status)">{{ load.status }}</span>
              </td>
              <td>
                <div class="dropdown">
                  <button class="btn btn-sm btn-icon btn-text-secondary" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded" />
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" @click="viewLoad(load.id)"><i class="bx bx-show me-2" />View</a></li>
                    <li><a class="dropdown-item" @click="editLoad(load)"><i class="bx bx-edit me-2" />Edit</a></li>
                    <li><a class="dropdown-item" @click="assignLoad(load.id)"><i class="bx bx-user-check me-2" />Assign</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item text-danger" @click="cancelLoad(load.id)"><i class="bx bx-x me-2" />Cancel</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <LoadFormModal
      v-if="showModal"
      :load="selectedLoad"
      @close="showModal = false"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadsStore } from '@/stores/loads'
import LoadFormModal from '@/components/loads/LoadFormModal.vue'

const router = useRouter()
const loadsStore = useLoadsStore()

const search = ref('')
const showModal = ref(false)
const selectedLoad = ref(null)

const filteredLoads = computed(() => {
  if (!search.value) return loadsStore.loads
  const q = search.value.toLowerCase()
  return loadsStore.loads.filter(l =>
    String(l.load_id || l.id).includes(q) ||
    l.destination?.toLowerCase().includes(q)
  )
})

const statusBadge = status => ({
  'bg-label-success': status === 'completed',
  'bg-label-warning': status === 'in_progress' || status === 'assigned',
  'bg-label-danger':  status === 'cancelled',
  'bg-label-secondary': !status || status === 'pending',
})

function openCreateModal() { selectedLoad.value = null; showModal.value = true }
function editLoad(load) { selectedLoad.value = load; showModal.value = true }
function viewLoad(id) { router.push(`/loads/${id}`) }

async function assignLoad(id) {
  try { await loadsStore.assignLoad(id) } catch {}
}

async function cancelLoad(id) {
  if (!confirm('Cancel this load?')) return
  try { await loadsStore.cancelLoad(id) } catch {}
}

function onSaved() { showModal.value = false; loadsStore.fetchAll() }

onMounted(() => {
  loadsStore.fetchAll()
  loadsStore.fetchStats()
})
</script>
