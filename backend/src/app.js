const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const curriculumsRoutes = require('./routes/curriculums.routes');
const companiesRoutes = require('./routes/companies.routes');
const jobsRoutes = require('./routes/jobs.routes');
const skillsRoutes = require('./routes/skills.routes');
const applicationsRoutes = require('./routes/applications.routes');
const documentsRoutes = require('./routes/documents.routes');
const adminRoutes = require('./routes/admin.routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
    res.status(200).json({
        proyecto: 'TALENTO NOVA',
        mensaje: 'API REST funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            usuarios: '/api/users',
            curriculums: '/api/curriculums',
            empresas: '/api/companies',
            ofertas: '/api/jobs',
            habilidades: '/api/skills',
            postulaciones: '/api/applications',
            documentos: '/api/documents',
            administracion: '/api/admin'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ estado: 'OK', servidor: 'Activo' });
});

// Módulos (cada uno en su rama: ver GUIA_RAMAS.md)
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/curriculums', curriculumsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/admin', adminRoutes);

// Siempre al final
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
