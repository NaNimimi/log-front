import { adminApi } from './index'

export const rolesApi = {
  getAll: (search = '') =>
    adminApi.get('/admin-api/roles', { params: { search } }),

  getOne: id =>
    adminApi.get(`/admin-api/roles/${id}`),

  create: data =>
    adminApi.post('/admin-api/roles/create', data),
  // data: { name, slug }

  update: (id, data) =>
    adminApi.put(`/admin-api/roles/${id}/update`, data),

  delete: id =>
    adminApi.delete(`/admin-api/roles/${id}/delete`),

  getStats: () =>
    adminApi.get('/admin-api/roles/stats'),

  addPermissions: (id, permission_id) =>
    adminApi.post(`/admin-api/roles/${id}/permissions`, { permission_id }),

  removePermissions: (id, permissions) =>
    adminApi.delete(`/admin-api/roles/${id}/permissions/remove`, { data: { permissions } }),
}
