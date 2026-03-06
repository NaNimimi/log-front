import { api } from './index'

export const authApi = {
  login: (email, password) =>
    api.post('/api/login', { email, password }),

  logout: () =>
    api.post('/api/logout'),

  logoutAll: () =>
    api.post('/api/logout/all'),

  me: () =>
    api.get('/api/me'),

  changePassword: (current_password, new_password) =>
    api.post('/api/password/change', { current_password, new_password }),

  resetPassword: email =>
    api.post('/api/password/reset', { email }),

  confirmPassword: email =>
    api.post('/api/password/confirm', { email }),
}
