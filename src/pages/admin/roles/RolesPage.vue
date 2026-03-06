<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Roles & Permissions</h4>
      <button class="btn btn-primary" @click="openCreate"><i class="bx bx-plus me-1" />Add Role</button>
    </div>

    <div class="card">
      <div class="card-header">
        <input v-model="search" @input="onSearch" type="text" class="form-control" style="max-width:220px" placeholder="Search roles..." />
      </div>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Slug</th><th>Permissions</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary" /></td></tr>
            <tr v-else-if="!roles.length"><td colspan="5" class="text-center py-4 text-muted">No roles</td></tr>
            <tr v-for="role in roles" :key="role.id">
              <td>{{ role.id }}</td>
              <td>{{ role.name }}</td>
              <td><code>{{ role.slug }}</code></td>
              <td>
                <span v-for="p in role.permissions?.slice(0,3)" :key="p.id" class="badge bg-label-secondary me-1">{{ p.name }}</span>
                <span v-if="(role.permissions?.length || 0) > 3" class="text-muted small">+{{ role.permissions.length - 3 }} more</span>
              </td>
              <td>
                <button class="btn btn-sm btn-icon btn-text-warning me-1" @click="editRole(role)"><i class="bx bx-edit" /></button>
                <button class="btn btn-sm btn-icon btn-text-danger" @click="deleteRole(role.id)"><i class="bx bx-trash" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background:rgba(0,0,0,.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selected ? 'Edit Role' : 'Create Role' }}</h5>
            <button class="btn-close" @click="showModal = false" />
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input v-model="form.name" type="text" class="form-control" />
            </div>
            <div class="mb-3" v-if="!selected">
              <label class="form-label">Slug</label>
              <input v-model="form.slug" type="text" class="form-control" />
            </div>
            <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-outline-secondary" @click="showModal = false">Cancel</button>
              <button class="btn btn-primary" :disabled="saving" @click="handleSubmit">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1" />Save
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
import { rolesApi } from '@/api/roles'

const roles = ref([])
const loading = ref(false)
const search = ref('')
const showModal = ref(false)
const selected = ref(null)
const saving = ref(false)
const formError = ref('')
const form = reactive({ name: '', slug: '' })

let timer = null
function onSearch() { clearTimeout(timer); timer = setTimeout(load, 400) }

async function load() {
  loading.value = true
  try { const { data } = await rolesApi.getAll(search.value); roles.value = Array.isArray(data) ? data : data?.roles || [] }
  catch {} finally { loading.value = false }
}

function openCreate() { selected.value = null; form.name = ''; form.slug = ''; showModal.value = true }
function editRole(r) { selected.value = r; form.name = r.name; form.slug = r.slug; showModal.value = true }

async function handleSubmit() {
  saving.value = true; formError.value = ''
  try {
    if (selected.value) await rolesApi.update(selected.value.id, { name: form.name })
    else await rolesApi.create({ name: form.name, slug: form.slug })
    showModal.value = false; await load()
  } catch (e) { formError.value = e.response?.data?.message || 'Error' }
  finally { saving.value = false }
}

async function deleteRole(id) {
  if (!confirm('Delete role?')) return
  try { await rolesApi.delete(id); await load() } catch {}
}

onMounted(load)
</script>
