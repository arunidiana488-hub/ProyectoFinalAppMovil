const crypto = require('node:crypto');
const { JWT_SECRET, JWT_EXPIRES_DAYS } = require('../config/env');

// Token de sesión con el estándar JWT (HS256), firmado con JWT_SECRET.
const base64url = (texto) => Buffer.from(texto).toString('base64url');

const firmar = (contenido) =>
    crypto.createHmac('sha256', JWT_SECRET).update(contenido).digest('base64url');

const signToken = (payload) => {
    const ahora = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = base64url(JSON.stringify({ ...payload, iat: ahora, exp: ahora + JWT_EXPIRES_DAYS * 86400 }));
    return `${header}.${body}.${firmar(`${header}.${body}`)}`;
};

// Devuelve el contenido del token o null si es inválido o venció
const verifyToken = (token) => {
    if (!token || typeof token !== 'string') return null;
    const partes = token.split('.');
    if (partes.length !== 3) return null;

    const [header, body, firma] = partes;
    const esperada = Buffer.from(firmar(`${header}.${body}`));
    const recibida = Buffer.from(firma);
    if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) return null;

    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch {
        return null;
    }
};

module.exports = { signToken, verifyToken };
