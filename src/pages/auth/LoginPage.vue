<template>
  <div class="authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner py-4">
      <div class="card">
        <div class="card-body">
          <div class="app-brand justify-content-center mb-4 mt-2">
            <span class="app-brand-text demo fw-bold">Logistics</span>
          </div>
          <h4 class="mb-1">Welcome back! 👋</h4>
          <p class="mb-4 text-muted">Please sign in to your account</p>

          <form @submit.prevent="handleLogin" novalidate>
            <div class="mb-3">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                placeholder="Enter your email"
                autocomplete="email"
              />
              <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label" for="password">Password</label>
              <div class="input-group">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="············"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bx bx-show' : 'bx bx-hide'" />
                </button>
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>
            </div>

            <div v-if="authStore.error" class="alert alert-danger mb-3" role="alert">
              {{ authStore.error }}
            </div>

            <button
              type="submit"
              class="btn btn-primary d-grid w-100"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-1" />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function validate() {
  errors.email = ''
  errors.password = ''
  let valid = true
  if (!form.email) { errors.email = 'Email is required'; valid = false }
  else if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Enter a valid email'; valid = false }
  if (!form.password) { errors.password = 'Password is required'; valid = false }
  return valid
}

async function handleLogin() {
  if (!validate()) return
  try {
    await authStore.login(form.email, form.password)
    router.push('/')
  } catch {}
}
</script>
