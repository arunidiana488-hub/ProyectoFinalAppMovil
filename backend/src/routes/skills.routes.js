const express = require('express');
const router = express.Router();

const { requireAuth, requireRole } = require('../middleware/auth');
const {
    obtenerHabilidades,
    obtenerHabilidadPorId,
    crearHabilidad,
    actualizarHabilidad,
    eliminarHabilidad
} = require('../controllers/skills.controller');

const duenoOAdmin = requireRole('candidate', 'administrator');

router.get('/', requireAuth, obtenerHabilidades);             // Listar (?user_id=)
router.get('/:id', requireAuth, obtenerHabilidadPorId);       // Ver una
router.post('/', duenoOAdmin, crearHabilidad);                // Crear
router.put('/:id', duenoOAdmin, actualizarHabilidad);         // Editar
router.delete('/:id', duenoOAdmin, eliminarHabilidad);        // Eliminar

module.exports = router;
