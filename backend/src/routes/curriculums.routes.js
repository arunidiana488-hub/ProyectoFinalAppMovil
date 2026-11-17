const express = require('express');
const router = express.Router();

const { requireAuth, requireRole } = require('../middleware/auth');
const { getMine, getByUser, upsertMine } = require('../controllers/curriculums.controller');

router.get('/me', requireAuth, getMine);                         // Mi currículum
router.put('/me', requireRole('candidate'), upsertMine);         // Crear o actualizar mi currículum
router.get('/user/:userId', requireAuth, getByUser);             // Currículum de un candidato

module.exports = router;
