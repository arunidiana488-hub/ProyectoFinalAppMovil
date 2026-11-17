// Error con código HTTP. Los controladores lo lanzan y el errorHandler lo responde.
class ApiError extends Error {
    constructor(status, mensaje, detalle) {
        super(mensaje);
        this.status = status;
        this.detalle = detalle;
    }
}

const badRequest = (mensaje, detalle) => new ApiError(400, mensaje, detalle);
const unauthorized = (mensaje = 'Debes iniciar sesión') => new ApiError(401, mensaje);
const forbidden = (mensaje = 'No tienes permiso para realizar esta acción') => new ApiError(403, mensaje);
const notFound = (mensaje = 'Registro no encontrado') => new ApiError(404, mensaje);
const conflict = (mensaje) => new ApiError(409, mensaje);

module.exports = { ApiError, badRequest, unauthorized, forbidden, notFound, conflict };
