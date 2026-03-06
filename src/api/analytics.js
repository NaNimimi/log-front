import { adminApi } from './index'

export const analyticsApi = {
  overview: () =>
    adminApi.get('/admin-api/analytics/overview'),

  loadsFrequency: () =>
    adminApi.get('/admin-api/analytics/loads/frequency'),

  loadsRoutes: () =>
    adminApi.get('/admin-api/analytics/loads/routes'),

  loadsTrends: () =>
    adminApi.get('/admin-api/analytics/loads/trends'),

  loadsCompare: () =>
    adminApi.get('/admin-api/analytics/loads/compare'),
}

export const permissionsApi = {
  getAll: () =>
    adminApi.get('/admin-api/permissions'),
}

export const activityLogsApi = {
  getAll: () =>
    adminApi.get('/admin-api/activity-logs'),

  getOne: id =>
    adminApi.get(`/admin-api/activity-logs/${id}`),
}
