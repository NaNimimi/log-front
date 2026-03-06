import { api, adminApi } from './index'

// Admin endpoints
export const facilitiesAdminApi = {
  getAll: () =>
    adminApi.get('/admin-api/facilities'),

  getOne: id =>
    adminApi.get(`/admin-api/facilities/${id}`),

  create: data =>
    adminApi.post('/admin-api/facilities/create', data),
  // data: { code, name? }

  update: (id, data) =>
    adminApi.put(`/admin-api/facilities/${id}/update`, data),
  // data: { code, name }

  delete: id =>
    adminApi.delete(`/admin-api/facilities/${id}/delete`),

  getStats: () =>
    adminApi.get('/admin-api/facilities/stats'),
}

// Worker endpoints
export const facilitiesApi = {
  getAll: () =>
    api.get('/api/facilities'),

  getOne: id =>
    api.get(`/api/facilities/${id}`),
}
