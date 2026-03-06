<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Facilities</h4>
      <button class="btn btn-primary" @click="openCreate">
        <i class="bx bx-plus me-1" /> Add Facility
      </button>
    </div>

    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th><th>Code</th><th>Name</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="4" class="text-center py-4"><div class="spinner-border text-primary" /></td></tr>
            <tr v-else-if="!facilities.length"><td colspan="4" class="text-center py-4 text-muted">No facilities</td></tr>
            <tr v-for="f in facilities" :key="f.id">
              <td>{{ f.id }}</td>
              <td><code>{{ f.code }}</code></td>
              <td>{{ f.name || '—' }}</td>
              <td>
                <button class="btn btn-sm btn-icon btn-text-warning me-1" @click="editFacility(f)"><i class="bx bx-edit" /></button>
                <button class="btn btn-sm btn-icon btn-text-danger" @click="deleteFacility(f.id)"><i class="bx bx-trash" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Inline modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background:rgba(0,0,0,.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selected ? 'Edit Facility' : 'Create Facility' }}</h5>
            <button class="btn-close" @click="showModal = false" />
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Code</label>
              <input v-model="form.code" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input v-model="form.name" type="text" class="form-control" />
            </div>
            <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-outline-secondary" @click="showModal = false">Cancel</button>
              <button class="btn btn-primary" :disabled="saving" @click="handleSubmit">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { facilitiesAdminApi } from '@/api/facilities'

const facilities = ref([])
const loading = ref(false)
const showModal = ref(false)
const selected = ref(null)
const saving = ref(false)
const formError = ref('')
const form = reactive({ code: '', name: '' })

async function load() {
  loading.value = true
  try { const { data } = await facilitiesAdminApi.getAll(); facilities.value = data } catch {}
  finally { loading.value = false }
}

function openCreate() { selected.value = null; form.code = ''; form.name = ''; showModal.value = true }
function editFacility(f) { selected.value = f; form.code = f.code; form.name = f.name || ''; showModal.value = true }

async function handleSubmit() {
  saving.value = true; formError.value = ''
  try {
    if (selected.value) await facilitiesAdminApi.update(selected.value.id, { ...form })
    else await facilitiesAdminApi.create({ ...form })
    showModal.value = false; await load()
  } catch (e) { formError.value = e.response?.data?.message || 'Error' }
  finally { saving.value = false }
}

async function deleteFacility(id) {
  if (!confirm('Delete this facility?')) return
  try { await facilitiesAdminApi.delete(id); await load() } catch {}
}

onMounted(load)
</script>
