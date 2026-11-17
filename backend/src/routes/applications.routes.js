const express = require('express');
const router = express.Router();

const { requireAuth, requireRole } = require('../middleware/auth');
const {
    postular,
    misPostulaciones,
    postulacionesRecibidas,
    obtenerPostulacion,
    cambiarEstado,
    retirarPostulacion
} = require('../controllers/applications.controller');

router.post('/', requireRole('candidate'), postular);                                          // Postular
router.get('/mine', requireRole('candidate'), misPostulaciones);                               // Mis postulaciones
router.get('/received', requireRole('recruiter', 'administrator'), postulacionesRecibidas);    // Recibidas
router.get('/:id', requireAuth, obtenerPostulacion);                                           // Detalle + historial
router.patch('/:id/status', requireRole('recruiter', 'administrator'), cambiarEstado);         // Cambiar etapa
router.delete('/:id', requireRole('candidate', 'administrator'), retirarPostulacion);          // Retirar

module.exports = router;
