const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok, created } = require('../utils/response');
const { pick, required, assertUuid, notEmpty, oneOf, cleanSearch } = require('../utils/validators');
const { badRequest, forbidden, notFound, conflict } = require('../utils/ApiError');
const { getMyCompanyIds, isCompanyMember } = require('../utils/ownership');
const { WORK_MODALITIES, EMPLOYMENT_TYPES, PUBLICATION_STATUS } = require('../utils/constants');

// Columnas de public.jobs que se pueden enviar
const CAMPOS = [
    'company_id', 'job_title', 'description', 'requirements', 'responsibilities',
    'employment_type', 'work_modality', 'country', 'department', 'city',
    'salary_min', 'salary_max', 'salary_currency', 'experience_required',
    'education_required', 'vacancies', 'publication_status', 'publication_date', 'expiration_date'
];

// Oferta + datos básicos de su empresa
const SELECT_OFERTA = '*, company:companies(id, business_name, city, logo, verification_status)';

const validar = (datos) => {
    oneOf(datos.work_modality, WORK_MODALITIES, 'work_modality');
    oneOf(datos.employment_type, EMPLOYMENT_TYPES, 'employment_type');
    oneOf(datos.publication_status, PUBLICATION_STATUS, 'publication_status');
    if (datos.company_id !== undefined) assertUuid(datos.company_id, 'company_id');
    if (datos.vacancies !== undefined && (!Number.isInteger(Number(datos.vacancies)) || Number(datos.vacancies) < 1)) {
        throw badRequest('vacancies debe ser un número entero mayor a 0');
    }
    if (
        datos.salary_min !== undefined && datos.salary_min !== null &&
        datos.salary_max !== undefined && datos.salary_max !== null &&
        Number(datos.salary_min) > Number(datos.salary_max)
    ) {
        throw badRequest('salary_min no puede ser mayor que salary_max');
    }
};

const puedeGestionar = async (user, companyId) =>
    user && (user.role === 'administrator' || (user.role === 'recruiter' && (await isCompanyMember(user.id, companyId))));

const buscarOferta = async (id) => {
    const { data, error } = await supabase.from('jobs').select(SELECT_OFERTA).eq('id', id).maybeSingle();
    check(error, 'Error al consultar la oferta');
    if (!data) throw notFound('Oferta no encontrada');
    return data;
};

// GET /api/jobs
// Filtros: ?q=texto&publication_status=published&company_id=...&city=La Paz&work_modality=remote&mine=true
// Candidatos y visitantes solo ven ofertas publicadas. mine=true → ofertas de mis empresas (reclutador).
const obtenerOfertas = async (req, res) => {
    const { q, publication_status, company_id, city, work_modality, employment_type, mine } = req.query;
    const user = req.user;
    const gestiona = user && ['recruiter', 'administrator'].includes(user.role);

    let consulta = supabase.from('jobs').select(
        gestiona ? `${SELECT_OFERTA}, applications(count)` : SELECT_OFERTA
    );

    if (mine === 'true' && user?.role === 'recruiter') {
        const ids = await getMyCompanyIds(user.id);
        if (!ids.length) return ok(res, { total: 0, ofertas: [] });
        consulta = consulta.in('company_id', ids);
    }

    if (!gestiona) {
        consulta = consulta.eq('publication_status', 'published');
    } else if (publication_status) {
        oneOf(publication_status, PUBLICATION_STATUS, 'publication_status');
        consulta = consulta.eq('publication_status', publication_status);
    }

    if (work_modality) {
        oneOf(work_modality, WORK_MODALITIES, 'work_modality');
        consulta = consulta.eq('work_modality', work_modality);
    }
    if (employment_type) {
        oneOf(employment_type, EMPLOYMENT_TYPES, 'employment_type');
        consulta = consulta.eq('employment_type', employment_type);
    }
    if (city) consulta = consulta.ilike('city', `%${cleanSearch(city)}%`);
    if (company_id) {
        assertUuid(company_id, 'company_id');
        consulta = consulta.eq('company_id', company_id);
    }
    if (q) {
        const texto = cleanSearch(q);
        if (texto) consulta = consulta.or(`job_title.ilike.%${texto}%,description.ilike.%${texto}%,requirements.ilike.%${texto}%`);
    }

    const { data, error } = await consulta.order('created_at', { ascending: false });
    check(error, 'Error al consultar ofertas');

    // applications(count) llega como [{ count: n }]: se convierte en un número
    const ofertas = data.map(({ applications, ...oferta }) =>
        applications ? { ...oferta, total_postulaciones: applications[0]?.count || 0 } : oferta
    );

    ok(res, { total: ofertas.length, ofertas });
};

// GET /api/jobs/:id
const obtenerOfertaPorId = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const oferta = await buscarOferta(id);
    if (oferta.publication_status !== 'published' && !(await puedeGestionar(req.user, oferta.company_id))) {
        throw notFound('Oferta no encontrada');
    }

    ok(res, { oferta });
};

// POST /api/jobs (reclutador de la empresa o administrador)
const crearOferta = async (req, res) => {
    const datos = pick(req.body, CAMPOS);
    required(datos, ['company_id', 'job_title']);
    validar(datos);

    if (!(await puedeGestionar(req.user, datos.company_id))) {
        throw forbidden('Solo puedes publicar ofertas de tu propia empresa');
    }
    if (datos.publication_status === 'published' && !datos.publication_date) {
        datos.publication_date = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('jobs')
        .insert([{ ...datos, created_by: req.user.id }])
        .select(SELECT_OFERTA)
        .single();

    check(error, 'Error al crear la oferta', { '23503': 'La empresa indicada no existe' });
    created(res, { oferta: data }, 'Oferta creada correctamente');
};

// PUT /api/jobs/:id
const actualizarOferta = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const datos = pick(req.body, CAMPOS);
    notEmpty(datos);
    validar(datos);

    const actual = await buscarOferta(id);
    if (!(await puedeGestionar(req.user, actual.company_id))) {
        throw forbidden('Solo puedes editar ofertas de tu propia empresa');
    }
    if (datos.company_id && datos.company_id !== actual.company_id && !(await puedeGestionar(req.user, datos.company_id))) {
        throw forbidden('No puedes mover la oferta a una empresa que no es tuya');
    }
    if (datos.publication_status === 'published' && !actual.publication_date && !datos.publication_date) {
        datos.publication_date = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('jobs')
        .update({ ...datos, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(SELECT_OFERTA)
        .single();

    check(error, 'Error al actualizar la oferta');
    ok(res, { oferta: data }, { mensaje: 'Oferta actualizada correctamente' });
};

// DELETE /api/jobs/:id
const eliminarOferta = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const actual = await buscarOferta(id);
    if (!(await puedeGestionar(req.user, actual.company_id))) {
        throw forbidden('Solo puedes eliminar ofertas de tu propia empresa');
    }

    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error?.code === '23503') {
        throw conflict('No se puede eliminar: la oferta tiene postulaciones. Puedes cerrarla.');
    }
    check(error, 'Error al eliminar la oferta');

    ok(res, { oferta: actual }, { mensaje: 'Oferta eliminada correctamente' });
};

module.exports = { obtenerOfertas, obtenerOfertaPorId, crearOferta, actualizarOferta, eliminarOferta };
