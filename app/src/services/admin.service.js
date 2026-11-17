import { api } from './api';

// Módulo: Administración (rama feature/documents-admin) → /api/admin
export const adminService = {
    stats: async () => (await api.get('/api/admin/stats')).estadisticas
};
