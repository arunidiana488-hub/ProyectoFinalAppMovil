const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok } = require('../utils/response');

// Cuenta filas de una tabla con un filtro opcional (sin traer los datos)
const contar = async (tabla, filtro = (q) => q) => {
    const { count, error } = await filtro(supabase.from(tabla).select('id', { count: 'exact', head: true }));
    check(error, `Error al contar ${tabla}`);
    return count || 0;
};

// GET /api/admin/stats → indicadores del panel de supervisión
const estadisticas = async (req, res) => {
    const [
        usuarios, candidatos, reclutadores, suspendidos,
        empresas, empresasPendientes,
        ofertasPublicadas, ofertasBorrador,
        postulaciones, documentosPendientes
    ] = await Promise.all([
        contar('users', (q) => q.is('deleted_at', null)),
        contar('users', (q) => q.eq('role', 'candidate').is('deleted_at', null)),
        contar('users', (q) => q.eq('role', 'recruiter').is('deleted_at', null)),
        contar('users', (q) => q.eq('account_status', 'suspended')),
        contar('companies'),
        contar('companies', (q) => q.eq('verification_status', 'pending')),
        contar('jobs', (q) => q.eq('publication_status', 'published')),
        contar('jobs', (q) => q.eq('publication_status', 'draft')),
        contar('applications'),
        contar('documents', (q) => q.eq('verification_status', 'pending'))
    ]);

    ok(res, {
        estadisticas: {
            usuarios, candidatos, reclutadores, suspendidos,
            empresas, empresasPendientes,
            ofertasPublicadas, ofertasBorrador,
            postulaciones, documentosPendientes
        }
    });
};

module.exports = { estadisticas };
