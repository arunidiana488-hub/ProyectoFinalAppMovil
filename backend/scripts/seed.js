/**
 * Carga datos de demostración: cuentas de prueba, empresas, ofertas,
 * currículums, habilidades, postulaciones y documentos.
 *
 * Uso:  npm run seed
 * Se puede ejecutar varias veces: actualiza en lugar de duplicar.
 */
require('dotenv').config({ quiet: true });

const supabase = require('../src/config/supabase');
const { hashPassword } = require('../src/utils/password');

const PASSWORD = 'Talento2026!';

const usuarios = [
    { key: 'camila', full_name: 'Camila Mendoza', email: 'candidata@talentonova.bo', role: 'candidate', phone: '+591 70123456' },
    { key: 'rodrigo', full_name: 'Rodrigo Salvatierra', email: 'empresa@talentonova.bo', role: 'recruiter', phone: '+591 71234567' },
    { key: 'admin', full_name: 'Administración Talento Nova', email: 'admin@talentonova.bo', role: 'administrator' },
    { key: 'mateo', full_name: 'Mateo Vargas', email: 'mateo.vargas@talentonova.bo', role: 'candidate', phone: '+591 72345678' },
    { key: 'sofia', full_name: 'Sofía Paredes', email: 'sofia.paredes@talentonova.bo', role: 'candidate', phone: '+591 73456789' },
    { key: 'valeria', full_name: 'Valeria Rojas', email: 'valeria.rojas@talentonova.bo', role: 'candidate', phone: '+591 74567890' }
];

const curriculums = {
    camila: {
        title: 'Diseñadora de Producto UX/UI',
        description: 'Diseño productos digitales inclusivos que convierten necesidades complejas en experiencias claras. Cinco años creando productos para fintech, educación y servicios.',
        experience: 'Product Designer Senior · Banco Unión Digital (2023 – Actualidad): rediseño del flujo de créditos, +28% de finalización.\nUX Designer · Jalasoft (2021 – 2023): investigación y diseño para productos B2B en tres países.',
        education: 'Licenciatura en Diseño Gráfico · Universidad Católica Boliviana (2016 – 2020)\nDiplomado en UX Research · Universidad Privada Boliviana (2022)',
        languages: 'Español (nativo), Inglés (B2)'
    },
    mateo: {
        title: 'Analista de Datos',
        description: 'Convierto datos en decisiones de negocio medibles y accionables.',
        experience: 'Analista BI · Nexo Bolivia (2022 – Actualidad)\nAsistente de datos · Tigo Bolivia (2020 – 2022)',
        education: 'Ingeniería de Sistemas · Universidad Mayor de San Simón (2015 – 2020)',
        languages: 'Español (nativo), Inglés (B1)'
    },
    sofia: {
        title: 'Especialista en Marketing Digital',
        description: 'Estratega de crecimiento enfocada en adquisición, contenido y analítica.',
        experience: 'Growth Lead · Andes Digital (2021 – Actualidad)',
        education: 'Comunicación Social · Universidad Privada Boliviana (2014 – 2019)',
        languages: 'Español (nativo), Inglés (C1), Portugués (B1)'
    },
    valeria: {
        title: 'Desarrolladora Móvil',
        description: 'Construyo apps móviles con React Native y Expo, enfocadas en rendimiento y accesibilidad.',
        experience: 'Mobile Developer · Kantutani Tech (2023 – Actualidad)\nFrontend Developer · Freelance (2021 – 2023)',
        education: 'Ingeniería de Sistemas · Escuela Militar de Ingeniería (2016 – 2021)',
        languages: 'Español (nativo), Inglés (B2)'
    }
};

const habilidades = {
    camila: [['Figma', 'advanced', 'Diseño'], ['UX Research', 'advanced', 'Diseño'], ['Design systems', 'intermediate', 'Diseño'], ['Accesibilidad', 'intermediate', 'Diseño'], ['Trabajo en equipo', 'advanced', 'Habilidad blanda']],
    mateo: [['Python', 'advanced', 'Programación'], ['SQL', 'advanced', 'Base de datos'], ['Power BI', 'intermediate', 'Análisis']],
    sofia: [['SEO', 'advanced', 'Marketing'], ['Google Analytics', 'intermediate', 'Análisis'], ['Liderazgo', 'advanced', 'Habilidad blanda']],
    valeria: [['React Native', 'advanced', 'Programación'], ['JavaScript', 'advanced', 'Programación'], ['Node.js', 'intermediate', 'Programación'], ['Supabase', 'basic', 'Base de datos']]
};

const empresas = [
    { key: 'kantutani', business_name: 'Kantutani Tech SRL', tax_identification_number: '1020304050', industry: 'Tecnología', company_size: '51-200', website: 'https://kantutani.example', email: 'talento@kantutani.example', phone: '+591 2 2123456', country: 'Bolivia', department: 'La Paz', city: 'La Paz', address: 'Av. Arce 2510, Sopocachi', description: 'Construimos plataformas financieras digitales para la región andina.', verification_status: 'verified' },
    { key: 'andes', business_name: 'Andes Digital SA', tax_identification_number: '2030405060', industry: 'Marketing y medios', company_size: '11-50', country: 'Bolivia', department: 'Santa Cruz', city: 'Santa Cruz de la Sierra', description: 'Agencia de crecimiento digital para marcas bolivianas.', verification_status: 'pending' }
];

const ofertas = [
    { id: 'a1000000-0000-4000-8000-000000000001', job_title: 'Product Designer Senior', city: 'La Paz', department: 'La Paz', work_modality: 'hybrid', employment_type: 'full_time', salary_min: 12000, salary_max: 15000, description: 'Lidera el diseño de experiencias para nuestra plataforma financiera regional.', requirements: 'Figma, UX Research, Design systems, 4+ años de experiencia', responsibilities: 'Diseñar flujos completos, investigar con usuarios y mantener el sistema de diseño.', experience_required: '4 años', education_required: 'Licenciatura en Diseño o afines', vacancies: 1, publication_status: 'published', dias: 45 },
    { id: 'a1000000-0000-4000-8000-000000000002', job_title: 'Desarrollador Móvil React Native', city: 'La Paz', department: 'La Paz', work_modality: 'remote', employment_type: 'full_time', salary_min: 10000, salary_max: 14000, description: 'Construye la app móvil de banca digital con React Native y Expo.', requirements: 'React Native, JavaScript, APIs REST, Git', responsibilities: 'Desarrollar pantallas, integrar APIs y publicar en tiendas.', experience_required: '2 años', education_required: 'Ingeniería de Sistemas', vacancies: 2, publication_status: 'published', dias: 30 },
    { id: 'a1000000-0000-4000-8000-000000000003', job_title: 'Analista BI', city: 'Cochabamba', department: 'Cochabamba', work_modality: 'hybrid', employment_type: 'full_time', salary_min: 8000, salary_max: 11000, description: 'Transforma información comercial en tableros y modelos predictivos.', requirements: 'Power BI, SQL, Python', responsibilities: 'Construir tableros, automatizar reportes y acompañar a negocio.', experience_required: '2 años', education_required: 'Ingeniería de Sistemas o Industrial', vacancies: 1, publication_status: 'published', dias: 20 },
    { id: 'a1000000-0000-4000-8000-000000000004', job_title: 'Practicante de Soporte TI', city: 'La Paz', department: 'La Paz', work_modality: 'onsite', employment_type: 'internship', salary_min: 2500, salary_max: 3000, description: 'Apoya al equipo de infraestructura en la atención a usuarios internos.', requirements: 'Estudiante de Sistemas, ganas de aprender', responsibilities: 'Atender tickets, configurar equipos y documentar procesos.', experience_required: 'Sin experiencia', education_required: 'Estudiante universitario', vacancies: 3, publication_status: 'draft', dias: 60 }
];

const salir = (mensaje, error) => {
    console.error(`❌ ${mensaje}:`, error?.message || error);
    process.exit(1);
};

const main = async () => {
    console.log('Cargando datos de demostración…');

    // 1) Usuarios
    const ids = {};
    for (const u of usuarios) {
        const { key, ...datos } = u;
        const { data, error } = await supabase
            .from('users')
            .upsert([{ ...datos, account_status: 'active', password_hash: await hashPassword(PASSWORD) }], { onConflict: 'email' })
            .select('id')
            .single();
        if (error) salir(`Usuario ${u.email}`, error);
        ids[key] = data.id;
    }
    console.log(`✔ ${usuarios.length} usuarios`);

    // 2) Empresas y miembros
    const empresaIds = {};
    for (const e of empresas) {
        const { key, ...datos } = e;
        const { data, error } = await supabase
            .from('companies')
            .upsert([datos], { onConflict: 'tax_identification_number' })
            .select('id')
            .single();
        if (error) salir(`Empresa ${e.business_name}`, error);
        empresaIds[key] = data.id;
    }
    const { error: errMiembro } = await supabase
        .from('company_members')
        .upsert([{ company_id: empresaIds.kantutani, user_id: ids.rodrigo }], { onConflict: 'company_id,user_id' });
    if (errMiembro) salir('Miembro de empresa', errMiembro);
    console.log(`✔ ${empresas.length} empresas`);

    // 3) Ofertas
    for (const o of ofertas) {
        const { dias, ...datos } = o;
        const { error } = await supabase.from('jobs').upsert([{
            ...datos,
            company_id: empresaIds.kantutani,
            created_by: ids.rodrigo,
            country: 'Bolivia',
            salary_currency: 'BOB',
            publication_date: datos.publication_status === 'published' ? new Date().toISOString() : null,
            expiration_date: new Date(Date.now() + dias * 86400000).toISOString()
        }], { onConflict: 'id' });
        if (error) salir(`Oferta ${o.job_title}`, error);
    }
    console.log(`✔ ${ofertas.length} ofertas`);

    // 4) Currículums y habilidades
    for (const [key, cv] of Object.entries(curriculums)) {
        const { error } = await supabase.from('curriculums').upsert([{ ...cv, user_id: ids[key] }], { onConflict: 'user_id' });
        if (error) salir(`Currículum ${key}`, error);
    }
    for (const [key, lista] of Object.entries(habilidades)) {
        const filas = lista.map(([skill_name, level, category]) => ({ user_id: ids[key], skill_name, level, category }));
        const { error } = await supabase.from('skills').upsert(filas, { onConflict: 'user_id,skill_name' });
        if (error) salir(`Habilidades ${key}`, error);
    }
    console.log('✔ currículums y habilidades');

    // 5) Postulaciones con historial
    const postulaciones = [
        { user: 'camila', job: ofertas[0].id, pasos: ['pending', 'reviewing', 'shortlisted', 'interview'] },
        { user: 'valeria', job: ofertas[1].id, pasos: ['pending', 'reviewing'] },
        { user: 'mateo', job: ofertas[2].id, pasos: ['pending'] },
        { user: 'sofia', job: ofertas[0].id, pasos: ['pending', 'rejected'] }
    ];
    const notas = {
        pending: 'Postulación enviada',
        reviewing: 'El equipo está revisando el perfil',
        shortlisted: 'Perfil preseleccionado',
        interview: 'Entrevista agendada',
        rejected: 'Se avanzó con otros perfiles'
    };
    for (const p of postulaciones) {
        const estado = p.pasos[p.pasos.length - 1];
        const { data, error } = await supabase
            .from('applications')
            .upsert([{ user_id: ids[p.user], job_id: p.job, application_status: estado }], { onConflict: 'user_id,job_id' })
            .select('id')
            .single();
        if (error) salir('Postulación', error);

        const { count } = await supabase
            .from('application_history')
            .select('id', { count: 'exact', head: true })
            .eq('application_id', data.id);
        if (!count) {
            const base = Date.now() - p.pasos.length * 86400000;
            const filas = p.pasos.map((status, i) => ({
                application_id: data.id,
                status,
                note: notas[status],
                changed_by: i === 0 ? ids[p.user] : ids.rodrigo,
                created_at: new Date(base + i * 86400000).toISOString()
            }));
            const { error: errHist } = await supabase.from('application_history').insert(filas);
            if (errHist) salir('Historial', errHist);
        }
    }
    console.log(`✔ ${postulaciones.length} postulaciones`);

    // 6) Documentos
    const documentos = [
        { user: 'camila', document_type: 'degree', file_name: 'Titulo_Licenciatura_Diseno.pdf', verification_status: 'verified' },
        { user: 'camila', document_type: 'certificate', file_name: 'Diplomado_UX_Research.pdf', verification_status: 'pending' },
        { user: 'mateo', document_type: 'degree', file_name: 'Titulo_Ingenieria_Sistemas.pdf', verification_status: 'pending' },
        { user: 'valeria', document_type: 'technical_title', file_name: 'Certificado_React_Native.pdf', verification_status: 'pending' }
    ];
    for (const d of documentos) {
        const { data: existe } = await supabase
            .from('documents')
            .select('id')
            .eq('user_id', ids[d.user])
            .eq('file_name', d.file_name)
            .maybeSingle();
        if (existe) continue;

        const { user, ...datos } = d;
        const { error } = await supabase.from('documents').insert([{
            ...datos,
            user_id: ids[user],
            mime_type: 'application/pdf',
            file_size: 245760,
            ...(d.verification_status === 'verified'
                ? { verification_date: new Date().toISOString(), verified_by: ids.admin }
                : {})
        }]);
        if (error) salir('Documento', error);
    }
    console.log(`✔ ${documentos.length} documentos`);

    console.log('\nListo. Cuentas de prueba (contraseña para todas: ' + PASSWORD + ')');
    console.log('  Candidata:      candidata@talentonova.bo');
    console.log('  Reclutador:     empresa@talentonova.bo');
    console.log('  Administrador:  admin@talentonova.bo');
};

main().catch((error) => salir('Error inesperado', error));
