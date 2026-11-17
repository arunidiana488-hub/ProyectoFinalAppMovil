const { badRequest } = require('./ApiError');

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isUuid = (valor) => typeof valor === 'string' && UUID.test(valor);

// Lanza 400 si el valor no es un uuid
const assertUuid = (valor, campo = 'id') => {
    if (!isUuid(valor)) throw badRequest(`${campo} no es un uuid válido`);
};

// Toma solo los campos permitidos del body (req.body puede venir vacío)
const pick = (body, campos) => {
    const datos = {};
    campos.forEach((campo) => {
        if (body && body[campo] !== undefined) datos[campo] = body[campo];
    });
    return datos;
};

// Lanza 400 si falta alguno de los campos obligatorios
const required = (datos, campos) => {
    const faltan = campos.filter((c) => datos[c] === undefined || datos[c] === null || String(datos[c]).trim() === '');
    if (faltan.length) throw badRequest(`Faltan campos obligatorios: ${faltan.join(', ')}`);
};

// Lanza 400 si el valor no está en la lista permitida
const oneOf = (valor, permitidos, campo) => {
    if (valor !== undefined && valor !== null && !permitidos.includes(valor)) {
        throw badRequest(`${campo} debe ser: ${permitidos.join(', ')}`);
    }
};

// Lanza 400 si no se envió nada para actualizar
const notEmpty = (datos) => {
    if (Object.keys(datos).length === 0) throw badRequest('Envía al menos un campo para actualizar');
};

// Quita caracteres que rompen los filtros de búsqueda de Supabase
const cleanSearch = (texto) => String(texto || '').replace(/[%,()*]/g, ' ').trim();

module.exports = { isUuid, assertUuid, pick, required, oneOf, notEmpty, cleanSearch, EMAIL };
