import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import routes from '~pages'



// Pages
import LoginPage       from '@/pages/auth/LoginPage.vue'
import LoadsPage       from '@/pages/loads/LoadsPage.vue'
import UsersPage       from '@/pages/admin/users/UsersPage.vue'
import AnalyticsPage   from '@/pages/admin/analytics/AnalyticsPage.vue'

const routes = [
  // Public
  { path: '/login', name: 'login', component: LoginPage, meta: { public: true } },

  // Worker routes
  { path: '/',        redirect: '/loads' },
  { path: '/loads',   name: 'loads',   component: LoadsPage,     meta: { requiresAuth: true } },
  {
    path: '/loads/:id',
    name: 'load-detail',
    component: () => import('@/pages/loads/LoadDetailPage.vue'),
    meta: { requiresAuth: true },
  },

  // Admin routes
  {
    path: '/admin',
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'users',      name: 'admin-users',     component: UsersPage },
      { path: 'analytics',  name: 'admin-analytics', component: AnalyticsPage },
      {
        path: 'facilities',
        name: 'admin-facilities',
        component: () => import('@/pages/admin/facilities/FacilitiesPage.vue'),
      },
      {
        path: 'roles',
        name: 'admin-roles',
        component: () => import('@/pages/admin/roles/RolesPage.vue'),
      },
      {
        path: 'activity-logs',
        name: 'admin-logs',
        component: () => import('@/pages/admin/ActivityLogsPage.vue'),
      },
    ],
  },

  // 404
  { path: '/:pathMatch(.*)*', redirect: '/loads' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.public) return next()

  if (!auth.isAuthenticated) return next('/login')

  // Try to fetch user if not loaded
  if (!auth.user) {
    try { await auth.fetchMe() } catch { return next('/login') }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) return next('/loads')

  next()
})

export default router

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
