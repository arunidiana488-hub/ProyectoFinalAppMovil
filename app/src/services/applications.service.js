import { api } from './api';

// Módulo: Postulaciones (rama feature/applications) → /api/applications
export const applicationsService = {
    apply: async (jobId) => (await api.post('/api/applications', { job_id: jobId })).postulacion,

    mine: async () => (await api.get('/api/applications/mine')).postulaciones,

    // filtros: { job_id, status }
    received: async (filtros = {}) => (await api.get('/api/applications/received', filtros)).postulaciones,

    get: async (id) => (await api.get(`/api/applications/${id}`)).postulacion,

    changeStatus: async (id, status, note) =>
        (await api.patch(`/api/applications/${id}/status`, { status, note })).postulacion,

    withdraw: (id) => api.delete(`/api/applications/${id}`)
};
