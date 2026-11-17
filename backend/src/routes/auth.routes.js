const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const { register, login, me } = require('../controllers/auth.controller');

router.post('/register', register);   // Crear cuenta (candidato o reclutador)
router.post('/login', login);         // Iniciar sesión → devuelve token
router.get('/me', requireAuth, me);   // Datos de la sesión actual

module.exports = router;
