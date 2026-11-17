const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok } = require('../utils/response');
const { pick, assertUuid, oneOf, notEmpty, required } = require('../utils/validators');
const { forbidden, notFound, badRequest } = require('../utils/ApiError');
const { ROLES, ACCOUNT_STATUS } = require('../utils/constants');
const { USER_FIELDS } = require('./auth.controller');

// La relación 1 a 1 con curriculums puede llegar como objeto o como lista: se deja siempre como objeto
const normalizar = (usuario) => ({
    ...usuario,
    curriculum: Array.isArray(usuario.curriculum) ? usuario.curriculum[0] || null : usuario.curriculum || null
});

// GET /api/users?role=candidate&q=diseño&skill=react&status=active
// Administrador: ve a todos. Reclutador: solo candidatos activos (buscador de talento).
const listUsers = async (req, res) => {
    const { role, q, skill, status } = req.query;
    const esAdmin = req.user.role === 'administrator';

    let consulta = supabase
        .from('users')
        .select(`${USER_FIELDS}, curriculum:curriculums(title, description), skills(skill_name, level)`)
        .is('deleted_at', null);

    if (esAdmin) {
        if (role) {
            oneOf(role, ROLES, 'role');
            consulta = consulta.eq('role', role);
        }
        if (status) {
            oneOf(status, ACCOUNT_STATUS, 'status');
            consulta = consulta.eq('account_status', status);
        }
    } else {
        consulta = consulta.eq('role', 'candidate').eq('account_status', 'active');
    }

    const { data, error } = await consulta.order('full_name', { ascending: true });
    check(error, 'Error al consultar usuarios');

    // Búsqueda por texto y por habilidad (se filtra aquí para buscar en varias tablas)
    const texto = String(q || '').trim().toLowerCase();
    const habilidad = String(skill || '').trim().toLowerCase();

    const usuarios = data.map(normalizar).filter((u) => {
        const enTexto = !texto || [u.full_name, u.email, u.curriculum?.title]
            .some((v) => String(v || '').toLowerCase().includes(texto));
        const conHabilidad = !habilidad || (u.skills || [])
            .some((s) => s.skill_name.toLowerCase().includes(habilidad));
        return enTexto && conHabilidad;
    });

    ok(res, { total: usuarios.length, usuarios });
};

// GET /api/users/:id → perfil completo (datos, currículum, habilidades, documentos)
const getUser = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const esPropio = req.user.id === id;
    if (!esPropio && !['recruiter', 'administrator'].includes(req.user.role)) {
        throw forbidden('Solo puedes ver tu propio perfil');
    }

    const { data, error } = await supabase
        .from('users')
        .select(`${USER_FIELDS},
            curriculum:curriculums(*),
            skills(id, skill_name, level, category),
            documentos:documents!documents_user_id_fkey(id, document_type, file_name, verification_status, upload_date)`)
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

    check(error, 'Error al consultar el perfil');
    if (!data) throw notFound('Usuario no encontrado');

    ok(res, { usuario: normalizar(data) });
};

// PUT /api/users/me → actualizar mis datos personales
const updateMe = async (req, res) => {
    const datos = pick(req.body, ['full_name', 'phone', 'profile_photo']);
    notEmpty(datos);
    if (datos.full_name !== undefined) required(datos, ['full_name']);

    const { data, error } = await supabase
        .from('users')
        .update({ ...datos, updated_at: new Date().toISOString() })
        .eq('id', req.user.id)
        .select(USER_FIELDS)
        .single();

    check(error, 'Error al actualizar tu perfil');
    ok(res, { usuario: data }, { mensaje: 'Perfil actualizado correctamente' });
};

// PATCH /api/users/:id/status → activar o suspender una cuenta (solo administrador)
const updateStatus = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const { account_status } = pick(req.body, ['account_status']);
    required({ account_status }, ['account_status']);
    oneOf(account_status, ACCOUNT_STATUS, 'account_status');
    if (id === req.user.id) throw badRequest('No puedes cambiar el estado de tu propia cuenta');

    const { data, error } = await supabase
        .from('users')
        .update({ account_status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(USER_FIELDS)
        .maybeSingle();

    check(error, 'Error al cambiar el estado de la cuenta');
    if (!data) throw notFound('Usuario no encontrado');

    ok(res, { usuario: data }, { mensaje: account_status === 'active' ? 'Cuenta activada' : 'Cuenta suspendida' });
};

module.exports = { listUsers, getUser, updateMe, updateStatus };
