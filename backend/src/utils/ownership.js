const supabase = require('../config/supabase');
const { check } = require('./db');

// Ids de las empresas a las que pertenece un reclutador
const getMyCompanyIds = async (userId) => {
    const { data, error } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('user_id', userId);
    check(error, 'Error al consultar tus empresas');
    return data.map((fila) => fila.company_id);
};

const isCompanyMember = async (userId, companyId) => {
    const ids = await getMyCompanyIds(userId);
    return ids.includes(companyId);
};

module.exports = { getMyCompanyIds, isCompanyMember };
