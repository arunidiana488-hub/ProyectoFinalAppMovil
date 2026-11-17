const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok, created } = require('../utils/response');
const { pick, required, oneOf, EMAIL } = require('../utils/validators');
const { badRequest, unauthorized, forbidden, notFound } = require('../utils/ApiError');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/token');

// Columnas del usuario que se pueden mostrar (nunca password_hash)
const USER_FIELDS = 'id, full_name, email, phone, profile_photo, role, account_status, created_at, last_login_at';

const crearSesion = (usuario) => ({
    token: signToken({ sub: usuario.id, role: usuario.role, name: usuario.full_name }),
    usuario
});

// POST /api/auth/register
const register = async (req, res) => {
    const datos = pick(req.body, ['full_name', 'email', 'password', 'role', 'phone']);
    required(datos, ['full_name', 'email', 'password']);

    datos.email = String(datos.email).trim().toLowerCase();
    datos.role = datos.role || 'candidate';

    if (!EMAIL.test(datos.email)) throw badRequest('El correo no es válido');
    if (String(datos.password).length < 8) throw badRequest('La contraseña debe tener al menos 8 caracteres');
    // Un administrador no se puede registrar solo
    oneOf(datos.role, ['candidate', 'recruiter'], 'role');

    const { password, ...resto } = datos;
    const { data, error } = await supabase
        .from('users')
        .insert([{ ...resto, password_hash: await hashPassword(password), account_status: 'active' }])
        .select(USER_FIELDS)
        .single();

    check(error, 'Error al crear la cuenta', { '23505': 'Ya existe una cuenta con ese correo' });

    created(res, crearSesion(data), 'Cuenta creada correctamente');
};

// POST /api/auth/login
const login = async (req, res) => {
    const datos = pick(req.body, ['email', 'password']);
    required(datos, ['email', 'password']);

    const { data: usuario, error } = await supabase
        .from('users')
        .select(`${USER_FIELDS}, password_hash, deleted_at`)
        .eq('email', String(datos.email).trim().toLowerCase())
        .maybeSingle();

    check(error, 'Error al iniciar sesión');

    const valido = usuario && (await verifyPassword(String(datos.password), usuario.password_hash));
    if (!valido) throw unauthorized('Correo o contraseña incorrectos');
    if (usuario.deleted_at || usuario.account_status !== 'active') {
        throw forbidden('Tu cuenta está suspendida. Contacta al administrador.');
    }

    await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', usuario.id);

    const { password_hash, deleted_at, ...publico } = usuario;
    ok(res, crearSesion(publico), { mensaje: `Bienvenido, ${publico.full_name}` });
};

// GET /api/auth/me
const me = async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select(`${USER_FIELDS}, empresas:company_members(company:companies(id, business_name, city, logo, verification_status))`)
        .eq('id', req.user.id)
        .maybeSingle();

    check(error, 'Error al consultar tu cuenta');
    if (!data) throw notFound('Tu cuenta ya no existe');

    const { empresas, ...usuario } = data;
    ok(res, { usuario: { ...usuario, empresas: (empresas || []).map((e) => e.company).filter(Boolean) } });
};

module.exports = { register, login, me, USER_FIELDS };
