const { verifyToken } = require('../utils/token');
const { unauthorized, forbidden } = require('../utils/ApiError');

// Lee "Authorization: Bearer <token>" y devuelve el usuario o null
const leerUsuario = (req) => {
    const header = req.headers.authorization || '';
    const [tipo, token] = header.split(' ');
    if (tipo !== 'Bearer' || !token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;
    return { id: payload.sub, role: payload.role, name: payload.name };
};

// Si hay sesión la guarda en req.user; si no, sigue igual (rutas públicas)
const optionalAuth = (req, res, next) => {
    req.user = leerUsuario(req);
    next();
};

// Exige sesión iniciada
const requireAuth = (req, res, next) => {
    req.user = leerUsuario(req);
    if (!req.user) return next(unauthorized('Debes iniciar sesión o tu sesión venció'));
    next();
};

// Exige sesión y uno de los roles indicados. Ej: requireRole('recruiter', 'administrator')
const requireRole = (...roles) => (req, res, next) => {
    req.user = leerUsuario(req);
    if (!req.user) return next(unauthorized('Debes iniciar sesión o tu sesión venció'));
    if (!roles.includes(req.user.role)) return next(forbidden());
    next();
};

module.exports = { optionalAuth, requireAuth, requireRole };
