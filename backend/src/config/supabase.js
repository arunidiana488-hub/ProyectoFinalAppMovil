const { createClient } = require('@supabase/supabase-js');

// La API usa la clave SECRETA (sb_secret_...): solo vive en el servidor.
// Se acepta el nombre antiguo SUPABASE_PUBLISHABLE_KEY para no romper .env existentes.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en el archivo .env');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
});

module.exports = supabase;
