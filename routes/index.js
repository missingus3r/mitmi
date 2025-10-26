const express = require('express');
const router = express.Router();

// Página de inicio / Landing
router.get('/', (req, res) => {
  res.render('pages/landing', {
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.user
  });
});

// Dashboard después de login
router.get('/dashboard', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/');
  }

  // Si el perfil no está completo, redirigir a setup
  if (!req.user.profileCompleted) {
    return res.redirect('/profile/setup');
  }

  res.redirect('/matches');
});

module.exports = router;
