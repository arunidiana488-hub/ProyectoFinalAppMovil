export const isEmail = (texto) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(texto || '').trim());

// "2026-12-31" válido
export const isIsoDate = (texto) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(texto || ''))) return false;
    return !Number.isNaN(new Date(`${texto}T00:00:00`).getTime());
};

// Texto → número o null (acepta "12.000" y "12000")
export const toNumberOrNull = (texto) => {
    const limpio = String(texto ?? '').replace(/\./g, '').replace(',', '.').trim();
    if (!limpio) return null;
    const numero = Number(limpio);
    return Number.isFinite(numero) ? numero : NaN;
};

// Quita espacios y convierte "" en null (para no guardar textos vacíos)
export const cleanText = (texto) => {
    const limpio = String(texto ?? '').trim();
    return limpio ? limpio : null;
};
