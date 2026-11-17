const express = require('express');
const router = express.Router();

const { optionalAuth, requireRole } = require('../middleware/auth');
const {
    obtenerOfertas,
    obtenerOfertaPorId,
    crearOferta,
    actualizarOferta,
    eliminarOferta
} = require('../controllers/jobs.controller');

const gestor = requireRole('recruiter', 'administrator');

router.get('/', optionalAuth, obtenerOfertas);          // Listar (con filtros)
router.get('/:id', optionalAuth, obtenerOfertaPorId);   // Ver una
router.post('/', gestor, crearOferta);                  // Crear
router.put('/:id', gestor, actualizarOferta);           // Editar
router.delete('/:id', gestor, eliminarOferta);          // Eliminar

module.exports = router;
