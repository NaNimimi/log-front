import { api } from './index'

export const loadsApi = {
  getAll: () =>
    api.get('/api/loads'),

  getMy: () =>
    api.get('/api/loads/my'),

  getOne: id =>
    api.get(`/api/loads/${id}`),

  create: data =>
    api.post('/api/loads/create', data),
  /**
   * data: {
   *   origin_facility: Number,
   *   load_id: Number,
   *   destination_facility: Number,
   *   origin_datetime: ISO string,
   *   destination: String,
   *   total_miles: Number,
   *   destination_datetime: ISO string,
   *   payout: String
   * }
   */

  update: (id, data) =>
    api.put(`/api/loads/${id}/update`, data),

  cancel: id =>
    api.post(`/api/loads/${id}/cancel`),

  assign: id =>
    api.post(`/api/loads/${id}/assign`),

  updateStatus: id =>
    api.post(`/api/loads/${id}/status`),

  getStats: () =>
    api.get('/api/loads/stats'),
}
