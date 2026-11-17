const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok } = require('../utils/response');
const { pick, notEmpty, assertUuid } = require('../utils/validators');
const { forbidden } = require('../utils/ApiError');

const CAMPOS = ['title', 'description', 'experience', 'education', 'skills', 'languages'];

// GET /api/curriculums/me → mi currículum (o null si todavía no existe)
const getMine = async (req, res) => {
    const { data, error } = await supabase
        .from('curriculums')
        .select('*')
        .eq('user_id', req.user.id)
        .maybeSingle();

    check(error, 'Error al consultar tu currículum');
    ok(res, { curriculum: data });
};

// GET /api/curriculums/user/:userId → currículum de un candidato (reclutador o administrador)
const getByUser = async (req, res) => {
    const { userId } = req.params;
    assertUuid(userId, 'userId');

    if (req.user.id !== userId && !['recruiter', 'administrator'].includes(req.user.role)) {
        throw forbidden();
    }

    const { data, error } = await supabase
        .from('curriculums')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    check(error, 'Error al consultar el currículum');
    ok(res, { curriculum: data });
};

// PUT /api/curriculums/me → crea o actualiza mi currículum (uno por usuario)
const upsertMine = async (req, res) => {
    const datos = pick(req.body, CAMPOS);
    notEmpty(datos);

    const { data, error } = await supabase
        .from('curriculums')
        .upsert(
            [{ ...datos, user_id: req.user.id, updated_at: new Date().toISOString() }],
            { onConflict: 'user_id' }
        )
        .select('*')
        .single();

    check(error, 'Error al guardar tu currículum');
    ok(res, { curriculum: data }, { mensaje: 'Currículum guardado correctamente' });
};

module.exports = { getMine, getByUser, upsertMine };
