import { api } from './api';

// Módulo: Perfil y currículum (rama feature/profile-cv) → /api/users y /api/curriculums
export const usersService = {
    // filtros: { role, q, skill, status }
    list: async (filtros = {}) => (await api.get('/api/users', filtros)).usuarios,

    get: async (id) => (await api.get(`/api/users/${id}`)).usuario,

    updateMe: async (datos) => (await api.put('/api/users/me', datos)).usuario,

    setStatus: async (id, accountStatus) =>
        (await api.patch(`/api/users/${id}/status`, { account_status: accountStatus })).usuario
};

export const curriculumsService = {
    mine: async () => (await api.get('/api/curriculums/me')).curriculum,

    saveMine: async (datos) => (await api.put('/api/curriculums/me', datos)).curriculum
};
