import { api } from './api';

// Módulo: Empresas (rama feature/companies) → /api/companies
export const companiesService = {
    // filtros: { q, verification_status }
    list: async (filtros = {}) => (await api.get('/api/companies', filtros)).empresas,

    mine: async () => (await api.get('/api/companies/mine')).empresas,

    get: async (id) => (await api.get(`/api/companies/${id}`)).empresa,

    create: async (datos) => (await api.post('/api/companies', datos)).empresa,

    update: async (id, datos) => (await api.put(`/api/companies/${id}`, datos)).empresa,

    verify: async (id, estado) =>
        (await api.patch(`/api/companies/${id}/verification`, { verification_status: estado })).empresa
};
