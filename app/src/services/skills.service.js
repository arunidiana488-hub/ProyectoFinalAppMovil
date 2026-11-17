import { api } from './api';

// Módulo: Habilidades (rama feature/jobs-skills) → /api/skills
export const skillsService = {
    // Sin userId devuelve las habilidades del usuario conectado
    list: async (userId) => (await api.get('/api/skills', { user_id: userId })).habilidades,

    create: async (datos) => (await api.post('/api/skills', datos)).habilidad,

    update: async (id, datos) => (await api.put(`/api/skills/${id}`, datos)).habilidad,

    remove: (id) => api.delete(`/api/skills/${id}`)
};
