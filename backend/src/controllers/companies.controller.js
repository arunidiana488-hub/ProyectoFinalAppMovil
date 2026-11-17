const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok, created } = require('../utils/response');
const { pick, required, assertUuid, notEmpty, oneOf, cleanSearch } = require('../utils/validators');
const { forbidden, notFound } = require('../utils/ApiError');
const { isCompanyMember } = require('../utils/ownership');
const { VERIFICATION_STATUS } = require('../utils/constants');

const CAMPOS = [
    'business_name', 'tax_identification_number', 'description', 'industry', 'company_size',
    'website', 'email', 'phone', 'country', 'department', 'city', 'address', 'logo'
];

// GET /api/companies?q=tech&verification_status=pending
const listCompanies = async (req, res) => {
    const { q, verification_status } = req.query;

    let consulta = supabase.from('companies').select('*');
    if (verification_status) {
        oneOf(verification_status, VERIFICATION_STATUS, 'verification_status');
        consulta = consulta.eq('verification_status', verification_status);
    }
    if (q) consulta = consulta.ilike('business_name', `%${cleanSearch(q)}%`);

    const { data, error } = await consulta.order('business_name', { ascending: true });
    check(error, 'Error al consultar empresas');

    ok(res, { total: data.length, empresas: data });
};

// GET /api/companies/mine → empresas del reclutador
const myCompanies = async (req, res) => {
    const { data, error } = await supabase
        .from('company_members')
        .select('company:companies(*)')
        .eq('user_id', req.user.id);

    check(error, 'Error al consultar tus empresas');
    const empresas = data.map((fila) => fila.company).filter(Boolean);
    ok(res, { total: empresas.length, empresas });
};

// GET /api/companies/:id
const getCompany = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const { data, error } = await supabase.from('companies').select('*').eq('id', id).maybeSingle();
    check(error, 'Error al consultar la empresa');
    if (!data) throw notFound('Empresa no encontrada');

    ok(res, { empresa: data });
};

// POST /api/companies → el reclutador crea su empresa y queda como miembro
const createCompany = async (req, res) => {
    const datos = pick(req.body, CAMPOS);
    required(datos, ['business_name', 'tax_identification_number']);

    const { data, error } = await supabase
        .from('companies')
        .insert([{ ...datos, verification_status: 'pending' }])
        .select('*')
        .single();
    check(error, 'Error al crear la empresa', { '23505': 'Ya existe una empresa con ese NIT' });

    const { error: errorMiembro } = await supabase
        .from('company_members')
        .insert([{ company_id: data.id, user_id: req.user.id }]);
    check(errorMiembro, 'La empresa se creó, pero no se pudo vincular a tu cuenta');

    created(res, { empresa: data }, 'Empresa registrada. Queda pendiente de verificación.');
};

// PUT /api/companies/:id → miembro de la empresa o administrador
const updateCompany = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    if (req.user.role !== 'administrator' && !(await isCompanyMember(req.user.id, id))) {
        throw forbidden('Solo los miembros de la empresa pueden editarla');
    }

    const datos = pick(req.body, CAMPOS);
    notEmpty(datos);

    const { data, error } = await supabase
        .from('companies')
        .update({ ...datos, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .maybeSingle();

    check(error, 'Error al actualizar la empresa', { '23505': 'Ya existe una empresa con ese NIT' });
    if (!data) throw notFound('Empresa no encontrada');

    ok(res, { empresa: data }, { mensaje: 'Empresa actualizada correctamente' });
};

// PATCH /api/companies/:id/verification → verificar o rechazar (solo administrador)
const verifyCompany = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const { verification_status } = pick(req.body, ['verification_status']);
    required({ verification_status }, ['verification_status']);
    oneOf(verification_status, VERIFICATION_STATUS, 'verification_status');

    const { data, error } = await supabase
        .from('companies')
        .update({ verification_status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .maybeSingle();

    check(error, 'Error al verificar la empresa');
    if (!data) throw notFound('Empresa no encontrada');

    ok(res, { empresa: data }, { mensaje: 'Estado de verificación actualizado' });
};

module.exports = { listCompanies, myCompanies, getCompany, createCompany, updateCompany, verifyCompany };
