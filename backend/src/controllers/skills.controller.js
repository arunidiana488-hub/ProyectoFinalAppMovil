const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok, created } = require('../utils/response');
const { pick, required, assertUuid, notEmpty, oneOf } = require('../utils/validators');
const { forbidden, notFound } = require('../utils/ApiError');
const { SKILL_LEVELS } = require('../utils/constants');

const CAMPOS = ['skill_name', 'level', 'category'];
const DUPLICADA = { '23505': 'El usuario ya tiene registrada esa habilidad' };

const buscarHabilidad = async (id) => {
    const { data, error } = await supabase.from('skills').select('*').eq('id', id).maybeSingle();
    check(error, 'Error al consultar la habilidad');
    if (!data) throw notFound('Habilidad no encontrada');
    return data;
};

const verificarDueno = (user, habilidad) => {
    if (user.role !== 'administrator' && habilidad.user_id !== user.id) {
        throw forbidden('Solo puedes modificar tus propias habilidades');
    }
};

// GET /api/skills?user_id=...  (sin user_id: las mías)
const obtenerHabilidades = async (req, res) => {
    const userId = req.query.user_id || req.user.id;
    assertUuid(userId, 'user_id');

    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    check(error, 'Error al consultar habilidades');
    ok(res, { total: data.length, habilidades: data });
};

// GET /api/skills/:id
const obtenerHabilidadPorId = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);
    ok(res, { habilidad: await buscarHabilidad(id) });
};

// POST /api/skills → el candidato agrega una habilidad a su perfil
const crearHabilidad = async (req, res) => {
    const datos = pick(req.body, CAMPOS);
    required(datos, ['skill_name', 'level']);
    oneOf(datos.level, SKILL_LEVELS, 'level');
    datos.skill_name = String(datos.skill_name).trim();

    // El administrador puede indicar el usuario; el candidato siempre la crea para sí mismo
    const userId = req.user.role === 'administrator' && req.body?.user_id ? req.body.user_id : req.user.id;
    assertUuid(userId, 'user_id');

    const { data, error } = await supabase
        .from('skills')
        .insert([{ ...datos, user_id: userId }])
        .select()
        .single();

    check(error, 'Error al crear la habilidad', { ...DUPLICADA, '23503': 'El usuario no existe' });
    created(res, { habilidad: data }, 'Habilidad agregada correctamente');
};

// PUT /api/skills/:id
const actualizarHabilidad = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const datos = pick(req.body, CAMPOS);
    notEmpty(datos);
    oneOf(datos.level, SKILL_LEVELS, 'level');
    if (datos.skill_name !== undefined) datos.skill_name = String(datos.skill_name).trim();

    verificarDueno(req.user, await buscarHabilidad(id));

    const { data, error } = await supabase
        .from('skills')
        .update({ ...datos, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    check(error, 'Error al actualizar la habilidad', DUPLICADA);
    ok(res, { habilidad: data }, { mensaje: 'Habilidad actualizada correctamente' });
};

// DELETE /api/skills/:id
const eliminarHabilidad = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const habilidad = await buscarHabilidad(id);
    verificarDueno(req.user, habilidad);

    const { error } = await supabase.from('skills').delete().eq('id', id);
    check(error, 'Error al eliminar la habilidad');

    ok(res, { habilidad }, { mensaje: 'Habilidad eliminada correctamente' });
};

module.exports = {
    obtenerHabilidades,
    obtenerHabilidadPorId,
    crearHabilidad,
    actualizarHabilidad,
    eliminarHabilidad
};
