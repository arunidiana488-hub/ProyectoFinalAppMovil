import { DEFAULT_API_URL, REQUEST_TIMEOUT_MS } from '../config/env';

// Cliente HTTP único: todas las pantallas llaman a la API a través de aquí.
let baseUrl = DEFAULT_API_URL;
let authToken = null;
let onUnauthorized = null;

export const setApiBaseUrl = (url) => {
    baseUrl = String(url || DEFAULT_API_URL).trim().replace(/\/+$/, '');
};
export const getApiBaseUrl = () => baseUrl;
export const setAuthToken = (token) => {
    authToken = token || null;
};
// Se llama cuando la sesión vence (401) para cerrar sesión automáticamente
export const setUnauthorizedHandler = (fn) => {
    onUnauthorized = fn;
};

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// { q: 'a', vacio: '' } → "?q=a"
export const toQuery = (params = {}) => {
    const partes = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    return partes.length ? `?${partes.join('&')}` : '';
};

export const request = async (path, { method = 'GET', body, skipAuthHandler = false } = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;
    try {
        response = await fetch(`${baseUrl}${path}`, {
            method,
            headers: {
                Accept: 'application/json',
                ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: controller.signal
        });
    } catch (error) {
        const mensaje = error?.name === 'AbortError'
            ? 'El servidor tardó demasiado en responder. Intenta de nuevo.'
            : 'No se pudo conectar con el servidor. Revisa tu conexión y la URL de la API.';
        throw new ApiError(mensaje, 0);
    } finally {
        clearTimeout(timer);
    }

    let datos = null;
    try {
        datos = await response.json();
    } catch {
        datos = null;
    }

    if (!response.ok || datos?.success === false) {
        if (response.status === 401 && !skipAuthHandler && onUnauthorized) onUnauthorized();
        const mensaje = datos?.mensaje || `Error ${response.status} del servidor`;
        throw new ApiError(mensaje, response.status);
    }

    return datos || {};
};

export const api = {
    get: (path, params) => request(`${path}${toQuery(params)}`),
    post: (path, body, options) => request(path, { method: 'POST', body: body ?? {}, ...options }),
    put: (path, body) => request(path, { method: 'PUT', body: body ?? {} }),
    patch: (path, body) => request(path, { method: 'PATCH', body: body ?? {} }),
    delete: (path) => request(path, { method: 'DELETE' })
};
