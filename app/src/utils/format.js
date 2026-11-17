const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// 12000 → "12.000"
export const formatNumber = (valor) => {
    const numero = Math.round(Number(valor) || 0);
    return String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const SIMBOLOS = { BOB: 'Bs', USD: '$us' };

// (5000, 7000, 'BOB') → "Bs 5.000 – 7.000"
export const formatSalary = (min, max, moneda = 'BOB') => {
    const simbolo = SIMBOLOS[moneda] || moneda || 'Bs';
    const tieneMin = min !== null && min !== undefined && min !== '';
    const tieneMax = max !== null && max !== undefined && max !== '';
    if (tieneMin && tieneMax) return `${simbolo} ${formatNumber(min)} – ${formatNumber(max)}`;
    if (tieneMin) return `Desde ${simbolo} ${formatNumber(min)}`;
    if (tieneMax) return `Hasta ${simbolo} ${formatNumber(max)}`;
    return 'Salario a convenir';
};

// "2026-11-17T10:00:00Z" → "17 nov 2026"
export const formatDate = (iso) => {
    if (!iso) return '—';
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return '—';
    return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
};

// "17 nov 2026, 14:05"
export const formatDateTime = (iso) => {
    if (!iso) return '—';
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return '—';
    const hh = String(fecha.getHours()).padStart(2, '0');
    const mm = String(fecha.getMinutes()).padStart(2, '0');
    return `${formatDate(iso)}, ${hh}:${mm}`;
};

// "hace 3 días", "hoy"
export const timeAgo = (iso) => {
    if (!iso) return '';
    const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (dias <= 0) return 'hoy';
    if (dias === 1) return 'ayer';
    if (dias < 30) return `hace ${dias} días`;
    const meses = Math.floor(dias / 30);
    return meses === 1 ? 'hace 1 mes' : `hace ${meses} meses`;
};

// Días que faltan para una fecha (negativo si ya pasó)
export const daysUntil = (iso) => {
    if (!iso) return null;
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
};

// "Camila Mendoza" → "CM"
export const initials = (nombre = '') =>
    nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() || '')
        .join('') || '?';

export const firstName = (nombre = '') => nombre.trim().split(/\s+/)[0] || '';

// "Buenos días" según la hora
export const greeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
};

// Fecha larga de hoy: "martes, 17 de noviembre"
export const todayLabel = () => {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const hoy = new Date();
    return `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${meses[hoy.getMonth()]}`;
};
