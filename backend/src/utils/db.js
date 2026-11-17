const { ApiError } = require('./ApiError');

// Traduce los errores de Postgres/Supabase a respuestas claras.
// `mensajes` permite personalizar el texto por código, por ejemplo { '23505': 'Ese correo ya existe' }.
const check = (error, mensaje = 'Error en la base de datos', mensajes = {}) => {
    if (!error) return;

    if (mensajes[error.code]) {
        const status = error.code === '23505' ? 409 : 400;
        throw new ApiError(status, mensajes[error.code]);
    }

    switch (error.code) {
        case '23505':
            throw new ApiError(409, 'Ya existe un registro con esos datos');
        case '23503':
            throw new ApiError(400, 'Un dato relacionado no existe o está en uso');
        case '23502':
            throw new ApiError(400, 'Falta un dato obligatorio');
        case '22P02':
        case '22007':
        case '22008':
        case '23514':
            throw new ApiError(400, 'Algún dato tiene un formato inválido', error.message);
        case '42P01':
        case '42703':
        case 'PGRST204':
        case 'PGRST205':
            throw new ApiError(500, 'La base de datos no está actualizada: ejecuta la migración SQL', error.message);
        default:
            throw new ApiError(500, mensaje, error.message);
    }
};

module.exports = { check };
