const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const chatController = require('../controllers/chatController');

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Ver chat de un match
router.get('/:matchId', chatController.showChat);

// Obtener mensajes de un match
router.get('/:matchId/messages', chatController.getMessages);

module.exports = router;
