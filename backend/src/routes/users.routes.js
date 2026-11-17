const express = require('express');
const router = express.Router();

const { requireAuth, requireRole } = require('../middleware/auth');
const { listUsers, getUser, updateMe, updateStatus } = require('../controllers/users.controller');

router.get('/', requireRole('recruiter', 'administrator'), listUsers);         // Buscar usuarios / candidatos
router.put('/me', requireAuth, updateMe);                                      // Editar mis datos
router.get('/:id', requireAuth, getUser);                                      // Perfil completo
router.patch('/:id/status', requireRole('administrator'), updateStatus);       // Activar / suspender

module.exports = router;
