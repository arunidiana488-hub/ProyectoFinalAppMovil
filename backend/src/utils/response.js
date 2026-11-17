// Formato único de respuesta exitosa: { success: true, mensaje?, ...datos }
const ok = (res, datos = {}, { status = 200, mensaje } = {}) =>
    res.status(status).json({
        success: true,
        ...(mensaje ? { mensaje } : {}),
        ...datos
    });

const created = (res, datos, mensaje) => ok(res, datos, { status: 201, mensaje });

module.exports = { ok, created };
