const User = require('../models/User');
const Match = require('../models/Match');
const { findPotentialMatches, calculateCompatibility } = require('../utils/matching');

// Mostrar potenciales matches
exports.showMatches = async (req, res) => {
  try {
    if (!req.user.profileCompleted) {
      return res.redirect('/profile/setup');
    }

    const potentialMatches = await findPotentialMatches(req.user._id, User, Match);

    res.render('pages/matches', {
      user: req.user,
      matches: potentialMatches,
      isAuthenticated: req.oidc.isAuthenticated()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar matches');
  }
};

// Crear match con otro usuario
exports.createMatch = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Calcular compatibilidad
    const compatibility = calculateCompatibility(req.user, targetUser);

    // Crear match
    const match = new Match({
      users: [req.user._id, targetUserId],
      compatibilityScore: compatibility,
      status: 'chatting'
    });

    await match.save();

    res.json({
      success: true,
      matchId: match._id,
      compatibility
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear match' });
  }
};

// Listar matches activos del usuario
exports.getActiveMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user._id,
      status: { $in: ['chatting', 'photo_reveal_pending', 'photo_matching', 'matched'] }
    })
      .populate('users')
      .sort('-createdAt');

    res.render('pages/my-matches', {
      user: req.user,
      matches,
      isAuthenticated: req.oidc.isAuthenticated()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar matches activos');
  }
};

// Solicitar revelar fotos
exports.requestPhotoReveal = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ error: 'Match no encontrado' });
    }

    // Verificar que el usuario es parte del match
    const userIndex = match.users.findIndex(id => id.toString() === req.user._id.toString());
    if (userIndex === -1) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Marcar que este usuario acepta revelar fotos
    if (userIndex === 0) {
      match.photoReveal.user1Accepted = true;
    } else {
      match.photoReveal.user2Accepted = true;
    }

    // Si ambos aceptaron, revelar fotos
    if (match.photoReveal.user1Accepted && match.photoReveal.user2Accepted) {
      match.photoReveal.bothAccepted = true;
      match.status = 'photo_matching';
    }

    await match.save();

    res.json({
      success: true,
      bothAccepted: match.photoReveal.bothAccepted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al solicitar revelación de fotos' });
  }
};

// Responder al match por fotos
exports.photoMatchResponse = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { liked } = req.body;

    const match = await Match.findById(matchId);

    if (!match || match.status !== 'photo_matching') {
      return res.status(400).json({ error: 'Match no válido para esta acción' });
    }

    // Verificar que el usuario es parte del match
    const userIndex = match.users.findIndex(id => id.toString() === req.user._id.toString());
    if (userIndex === -1) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Marcar respuesta del usuario
    if (userIndex === 0) {
      match.photoMatch.user1Liked = liked;
    } else {
      match.photoMatch.user2Liked = liked;
    }

    // Si ambos respondieron
    if (match.photoMatch.user1Liked !== null && match.photoMatch.user2Liked !== null) {
      if (match.photoMatch.user1Liked && match.photoMatch.user2Liked) {
        // Ambos se gustaron - Match completo
        match.photoMatch.bothLiked = true;
        match.status = 'matched';
      } else {
        // Al menos uno rechazó - Match rechazado
        match.status = 'rejected';
        match.endedAt = new Date();
      }
    }

    await match.save();

    res.json({
      success: true,
      bothLiked: match.photoMatch.bothLiked,
      status: match.status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar respuesta' });
  }
};
