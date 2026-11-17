const crypto = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

// Guarda la contraseña como "scrypt$sal$hash": nunca se guarda en texto plano.
const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scrypt(password, salt, KEY_LENGTH);
    return `scrypt$${salt}$${hash.toString('hex')}`;
};

const verifyPassword = async (password, guardado) => {
    if (!guardado || typeof guardado !== 'string') return false;
    const [algoritmo, salt, hashHex] = guardado.split('$');
    if (algoritmo !== 'scrypt' || !salt || !hashHex) return false;

    const esperado = Buffer.from(hashHex, 'hex');
    const calculado = await scrypt(password, salt, esperado.length);
    return esperado.length === calculado.length && crypto.timingSafeEqual(esperado, calculado);
};

module.exports = { hashPassword, verifyPassword };
