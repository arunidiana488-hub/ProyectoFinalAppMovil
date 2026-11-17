const express = require('express');
const router = express.Router();

const { requireAuth, requireRole } = require('../middleware/auth');
const {
    listCompanies,
    myCompanies,
    getCompany,
    createCompany,
    updateCompany,
    verifyCompany
} = require('../controllers/companies.controller');

router.get('/', requireAuth, listCompanies);                                         // Listar empresas
router.get('/mine', requireRole('recruiter'), myCompanies);                          // Mis empresas
router.get('/:id', requireAuth, getCompany);                                         // Ver una empresa
router.post('/', requireRole('recruiter'), createCompany);                           // Registrar empresa
router.put('/:id', requireRole('recruiter', 'administrator'), updateCompany);        // Editar empresa
router.patch('/:id/verification', requireRole('administrator'), verifyCompany);     // Verificar empresa

module.exports = router;
