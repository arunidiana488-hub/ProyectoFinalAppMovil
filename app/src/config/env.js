// URL de la API. Se toma de app/.env (EXPO_PUBLIC_API_URL) y se puede cambiar
// dentro de la app, en la pantalla de inicio de sesión ("Servidor").
export const DEFAULT_API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const REQUEST_TIMEOUT_MS = 20000;

// Cuentas de prueba creadas por `npm run seed` en el backend
export const DEMO_PASSWORD = 'Talento2026!';
export const DEMO_ACCOUNTS = [
    { role: 'candidate', label: 'Camila Mendoza', detail: 'Cuenta candidata', email: 'candidata@talentonova.bo', icon: 'person-outline' },
    { role: 'recruiter', label: 'Kantutani Tech', detail: 'Cuenta reclutadora', email: 'empresa@talentonova.bo', icon: 'briefcase-outline' },
    { role: 'administrator', label: 'Administración', detail: 'Cuenta supervisora', email: 'admin@talentonova.bo', icon: 'shield-checkmark-outline' }
];
