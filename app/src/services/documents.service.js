import { api } from './api';

// Módulo: Documentos (rama feature/documents-admin) → /api/documents
export const documentsService = {
    mine: async () => (await api.get('/api/documents/mine')).documentos,

    // Solo administrador. estado: pending | verified | rejected
    list: async (estado) => (await api.get('/api/documents', { status: estado })).documentos,

    create: async (datos) => (await api.post('/api/documents', datos)).documento,

    remove: (id) => api.delete(`/api/documents/${id}`),

    review: async (id, estado, motivo) =>
        (await api.patch(`/api/documents/${id}/review`, { status: estado, rejection_reason: motivo })).documento
};
