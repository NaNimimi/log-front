import { adminApi } from './index'

export const usersApi = {
  getAll: (search = '') =>
    adminApi.get('/admin-api/users', { params: { search } }),

  getOne: id =>
    adminApi.get(`/admin-api/users/${id}`),

  create: data =>
    adminApi.post('/admin-api/users/create', data),
  // data: { email, first_name, last_name, password, role_id }

  update: (id, data) =>
    adminApi.put(`/admin-api/users/${id}/update`, data),

  delete: id =>
    adminApi.delete(`/admin-api/users/${id}/delete`),

  toggleActive: id =>
    adminApi.post(`/admin-api/users/${id}/toggle-active`),

  changePassword: (id, new_password) =>
    adminApi.post(`/admin-api/users/${id}/change-password`, { new_password }),

  forceLogout: id =>
    adminApi.post(`/admin-api/users/${id}/force-logout`),

  getSessions: id =>
    adminApi.get(`/admin-api/users/${id}/sessions`),

  addRole: (id, role_id) =>
    adminApi.post(`/admin-api/users/${id}/roles`, { role_id }),

  removeRole: (id, role_id) =>
    adminApi.delete(`/admin-api/users/${id}/roles/remove`, { data: { role_id } }),

  getStats: () =>
    adminApi.get('/admin-api/users/stats'),
}
