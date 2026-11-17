const { ApiError } = require('../utils/ApiError');

// Ruta que no existe
const notFoundHandler = (req, res) => {
    res.status(404).json({ success: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Todos los errores de la API terminan aquí (Express 5 envía también los errores async)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            success: false,
            mensaje: err.message,
            ...(err.detalle && process.env.NODE_ENV !== 'production' ? { detalle: err.detalle } : {})
        });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ success: false, mensaje: 'El JSON enviado no es válido' });
    }

    console.error(err);
    res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
};

module.exports = { notFoundHandler, errorHandler };
