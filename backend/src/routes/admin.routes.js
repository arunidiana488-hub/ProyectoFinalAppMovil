const express = require('express');
const router = express.Router();

const { requireRole } = require('../middleware/auth');
const { estadisticas } = require('../controllers/admin.controller');

router.get('/stats', requireRole('administrator'), estadisticas);   // Indicadores del panel

module.exports = router;
