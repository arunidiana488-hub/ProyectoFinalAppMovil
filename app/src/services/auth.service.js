import { api } from './api';

// Módulo: Autenticación (rama feature/auth)
export const authService = {
    login: (email, password) =>
        api.post('/api/auth/login', { email, password }, { skipAuthHandler: true }),

    register: (datos) =>
        api.post('/api/auth/register', datos, { skipAuthHandler: true }),

    me: async () => (await api.get('/api/auth/me')).usuario,

    health: () => api.get('/api/health')
};
