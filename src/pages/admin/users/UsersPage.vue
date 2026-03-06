<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Users</h4>
      <button class="btn btn-primary" @click="openCreate">
        <i class="bx bx-user-plus me-1" /> Add User
      </button>
    </div>

    <!-- Stats -->
    <div class="row g-4 mb-4" v-if="usersStore.stats">
      <div class="col-sm-4">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-primary mb-0">{{ usersStore.stats.total ?? '—' }}</h3>
            <p class="text-muted mb-0">Total Users</p>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-success mb-0">{{ usersStore.stats.active ?? '—' }}</h3>
            <p class="text-muted mb-0">Active</p>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-danger mb-0">{{ usersStore.stats.inactive ?? '—' }}</h3>
            <p class="text-muted mb-0">Inactive</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">All Users</h5>
        <input v-model="search" @input="onSearch" type="text" class="form-control" style="max-width:220px" placeholder="Search users..." />
      </div>
      <div class="table-responsive text-nowrap">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="usersStore.loading">
              <td colspan="5" class="text-center py-4"><div class="spinner-border text-primary" /></td>
            </tr>
            <tr v-else-if="usersStore.users.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">No users found</td>
            </tr>
            <tr v-for="user in usersStore.users" :key="user.id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar avatar-sm me-2">
                    <span class="avatar-initial rounded-circle bg-label-primary">
                      {{ initials(user) }}
                    </span>
                  </div>
                  {{ user.first_name }} {{ user.last_name }}
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span v-for="role in user.roles" :key="role.id" class="badge bg-label-info me-1">{{ role.name }}</span>
                <span v-if="!user.roles?.length" class="text-muted">—</span>
              </td>
              <td>
                <span class="badge" :class="user.is_active ? 'bg-label-success' : 'bg-label-secondary'">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="dropdown">
                  <button class="btn btn-sm btn-icon btn-text-secondary" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded" />
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" @click="editUser(user)"><i class="bx bx-edit me-2" />Edit</a></li>
                    <li><a class="dropdown-item" @click="toggleUser(user.id)"><i class="bx bx-toggle-left me-2" />Toggle Active</a></li>
                    <li><a class="dropdown-item" @click="forceLogout(user.id)"><i class="bx bx-log-out me-2" />Force Logout</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item text-danger" @click="deleteUser(user.id)"><i class="bx bx-trash me-2" />Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UserFormModal v-if="showModal" :user="selectedUser" @close="showModal = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { usersApi } from '@/api/users'
import UserFormModal from '@/components/users/UserFormModal.vue'

const usersStore = useUsersStore()
const search = ref('')
const showModal = ref(false)
const selectedUser = ref(null)

let searchTimer = null
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => usersStore.fetchAll(search.value), 400)
}

const initials = u => `${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase()
function openCreate() { selectedUser.value = null; showModal.value = true }
function editUser(user) { selectedUser.value = user; showModal.value = true }

async function toggleUser(id) {
  try { await usersStore.toggleActive(id) } catch {}
}

async function forceLogout(id) {
  try { await usersApi.forceLogout(id) } catch {}
}

async function deleteUser(id) {
  if (!confirm('Delete this user?')) return
  try { await usersStore.deleteUser(id) } catch {}
}

function onSaved() { showModal.value = false; usersStore.fetchAll() }

onMounted(() => {
  usersStore.fetchAll()
  usersStore.fetchStats()
})
</script>
