import { api } from './api';

// Módulo: Ofertas laborales (rama feature/jobs-skills) → /api/jobs
export const jobsService = {
    // filtros: { q, work_modality, employment_type, city, publication_status, mine }
    list: async (filtros = {}) => (await api.get('/api/jobs', filtros)).ofertas,

    get: async (id) => (await api.get(`/api/jobs/${id}`)).oferta,

    create: async (datos) => (await api.post('/api/jobs', datos)).oferta,

    update: async (id, datos) => (await api.put(`/api/jobs/${id}`, datos)).oferta,

    remove: (id) => api.delete(`/api/jobs/${id}`)
};
