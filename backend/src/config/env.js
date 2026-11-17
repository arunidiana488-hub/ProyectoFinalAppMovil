const DEFAULT_SECRET = 'talentonova-clave-de-desarrollo';

const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

if (JWT_SECRET === DEFAULT_SECRET) {
    console.warn('⚠️  JWT_SECRET no está definido en .env: se usa una clave de desarrollo.');
}

module.exports = {
    PORT: Number(process.env.PORT) || 3000,
    JWT_SECRET,
    JWT_EXPIRES_DAYS: Number(process.env.JWT_EXPIRES_DAYS) || 7
};
