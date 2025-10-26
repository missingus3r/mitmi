const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middleware/requireAuth');
const profileController = require('../controllers/profileController');

// Configuración de multer para subida de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
  }
});

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Mostrar formulario de configuración de perfil
router.get('/setup', profileController.showProfileForm);

// Guardar perfil
router.post('/setup', profileController.saveProfile);

// Subir foto
router.post('/upload-photo', upload.single('photo'), profileController.uploadPhoto);

module.exports = router;
