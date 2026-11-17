const express = require('express');
const router = express.Router();

const { requireAuth, requireRole } = require('../middleware/auth');
const {
    misDocumentos,
    listarDocumentos,
    registrarDocumento,
    eliminarDocumento,
    revisarDocumento
} = require('../controllers/documents.controller');

router.get('/mine', requireAuth, misDocumentos);                                 // Mis documentos
router.get('/', requireRole('administrator'), listarDocumentos);                 // Todos (?status=pending)
router.post('/', requireRole('candidate'), registrarDocumento);                  // Registrar título o certificado
router.delete('/:id', requireAuth, eliminarDocumento);                           // Eliminar
router.patch('/:id/review', requireRole('administrator'), revisarDocumento);     // Verificar o rechazar

module.exports = router;
