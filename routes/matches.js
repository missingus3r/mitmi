const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const matchController = require('../controllers/matchController');

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Ver potenciales matches
router.get('/', matchController.showMatches);

// Mis matches activos
router.get('/my-matches', matchController.getActiveMatches);

// Crear match con otro usuario
router.post('/create', matchController.createMatch);

// Solicitar revelar fotos
router.post('/:matchId/request-photo-reveal', matchController.requestPhotoReveal);

// Responder al match por fotos
router.post('/:matchId/photo-response', matchController.photoMatchResponse);

module.exports = router;
