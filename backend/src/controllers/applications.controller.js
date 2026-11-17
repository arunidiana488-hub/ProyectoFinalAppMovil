const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok, created } = require('../utils/response');
const { pick, required, assertUuid, oneOf } = require('../utils/validators');
const { badRequest, forbidden, notFound } = require('../utils/ApiError');
const { getMyCompanyIds } = require('../utils/ownership');
const { APPLICATION_STATUS } = require('../utils/constants');

const SELECT_POSTULACION = `*,
    job:jobs(id, job_title, city, work_modality, publication_status, company_id,
        company:companies(id, business_name, logo)),
    candidate:users(id, full_name, email, phone, profile_photo)`;

const registrarHistorial = async (applicationId, status, note, changedBy) => {
    const { error } = await supabase
        .from('application_history')
        .insert([{ application_id: applicationId, status, note: note || null, changed_by: changedBy }]);
    check(error, 'Error al guardar el historial de la postulación');
};

const buscarPostulacion = async (id) => {
    const { data, error } = await supabase
        .from('applications')
        .select(`${SELECT_POSTULACION}, history:application_history(id, status, note, created_at)`)
        .eq('id', id)
        .maybeSingle();
    check(error, 'Error al consultar la postulación');
    if (!data) throw notFound('Postulación no encontrada');

    data.history = (data.history || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return data;
};

// ¿Puede el usuario ver o gestionar esta postulación?
const tieneAcceso = async (user, postulacion, soloGestion = false) => {
    if (user.role === 'administrator') return true;
    if (user.role === 'candidate') return !soloGestion && postulacion.user_id === user.id;
    if (user.role === 'recruiter') {
        const empresas = await getMyCompanyIds(user.id);
        return empresas.includes(postulacion.job?.company_id);
    }
    return false;
};

// POST /api/applications  { job_id } → el candidato se postula
const postular = async (req, res) => {
    const { job_id } = pick(req.body, ['job_id']);
    required({ job_id }, ['job_id']);
    assertUuid(job_id, 'job_id');

    const { data: oferta, error: errorOferta } = await supabase
        .from('jobs')
        .select('id, publication_status, expiration_date')
        .eq('id', job_id)
        .maybeSingle();
    check(errorOferta, 'Error al consultar la oferta');
    if (!oferta) throw notFound('La oferta no existe');
    if (oferta.publication_status !== 'published') throw badRequest('Esta oferta no está recibiendo postulaciones');
    if (oferta.expiration_date && new Date(oferta.expiration_date) < new Date()) {
        throw badRequest('La fecha límite de esta oferta ya pasó');
    }

    const { data, error } = await supabase
        .from('applications')
        .insert([{ user_id: req.user.id, job_id, application_status: 'pending' }])
        .select('*')
        .single();
    check(error, 'Error al enviar la postulación', { '23505': 'Ya te postulaste a esta oferta' });

    await registrarHistorial(data.id, 'pending', 'Postulación enviada', req.user.id);

    created(res, { postulacion: data }, 'Postulación enviada correctamente');
};

// GET /api/applications/mine → postulaciones del candidato
const misPostulaciones = async (req, res) => {
    const { data, error } = await supabase
        .from('applications')
        .select(SELECT_POSTULACION)
        .eq('user_id', req.user.id)
        .order('application_date', { ascending: false });

    check(error, 'Error al consultar tus postulaciones');
    ok(res, { total: data.length, postulaciones: data });
};

// GET /api/applications/received?job_id=...&status=interview → postulaciones a las ofertas de mis empresas
const postulacionesRecibidas = async (req, res) => {
    const { job_id, status } = req.query;

    let consulta = supabase.from('applications').select(SELECT_POSTULACION);

    if (req.user.role === 'recruiter') {
        const empresas = await getMyCompanyIds(req.user.id);
        if (!empresas.length) return ok(res, { total: 0, postulaciones: [] });

        const { data: ofertas, error } = await supabase.from('jobs').select('id').in('company_id', empresas);
        check(error, 'Error al consultar tus ofertas');
        const ids = ofertas.map((o) => o.id);
        if (!ids.length) return ok(res, { total: 0, postulaciones: [] });
        consulta = consulta.in('job_id', ids);
    }

    if (job_id) {
        assertUuid(job_id, 'job_id');
        consulta = consulta.eq('job_id', job_id);
    }
    if (status) {
        oneOf(status, APPLICATION_STATUS, 'status');
        consulta = consulta.eq('application_status', status);
    }

    const { data, error } = await consulta.order('application_date', { ascending: false });
    check(error, 'Error al consultar las postulaciones');
    ok(res, { total: data.length, postulaciones: data });
};

// GET /api/applications/:id → detalle con historial
const obtenerPostulacion = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const postulacion = await buscarPostulacion(id);
    if (!(await tieneAcceso(req.user, postulacion))) throw forbidden('No puedes ver esta postulación');

    ok(res, { postulacion });
};

// PATCH /api/applications/:id/status  { status, note } → el reclutador cambia la etapa
const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const { status, note } = pick(req.body, ['status', 'note']);
    required({ status }, ['status']);
    oneOf(status, APPLICATION_STATUS, 'status');

    const postulacion = await buscarPostulacion(id);
    if (!(await tieneAcceso(req.user, postulacion, true))) {
        throw forbidden('Solo la empresa de la oferta puede cambiar el estado');
    }
    if (postulacion.application_status === status) throw badRequest('La postulación ya tiene ese estado');

    const { error } = await supabase.from('applications').update({ application_status: status }).eq('id', id);
    check(error, 'Error al cambiar el estado');

    await registrarHistorial(id, status, note, req.user.id);

    ok(res, { postulacion: await buscarPostulacion(id) }, { mensaje: 'Estado actualizado correctamente' });
};

// DELETE /api/applications/:id → el candidato retira su postulación
const retirarPostulacion = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const postulacion = await buscarPostulacion(id);
    if (req.user.role !== 'administrator' && postulacion.user_id !== req.user.id) {
        throw forbidden('Solo puedes retirar tus propias postulaciones');
    }
    if (['hired', 'rejected'].includes(postulacion.application_status)) {
        throw badRequest('Este proceso ya terminó y no se puede retirar');
    }

    const { error } = await supabase.from('applications').delete().eq('id', id);
    check(error, 'Error al retirar la postulación');

    ok(res, { postulacion }, { mensaje: 'Postulación retirada' });
};

module.exports = {
    postular,
    misPostulaciones,
    postulacionesRecibidas,
    obtenerPostulacion,
    cambiarEstado,
    retirarPostulacion
};
