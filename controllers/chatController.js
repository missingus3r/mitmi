const Match = require('../models/Match');
const Message = require('../models/Message');
const User = require('../models/User');

// Mostrar chat de un match
exports.showChat = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId).populate('users');

    if (!match) {
      return res.status(404).send('Match no encontrado');
    }

    // Verificar que el usuario es parte del match
    const isUserInMatch = match.users.some(u => u._id.toString() === req.user._id.toString());
    if (!isUserInMatch) {
      return res.status(403).send('No autorizado');
    }

    // Obtener el otro usuario
    const otherUser = match.users.find(u => u._id.toString() !== req.user._id.toString());

    // Obtener mensajes
    const messages = await Message.find({ matchId })
      .populate('senderId')
      .sort('createdAt');

    // Marcar mensajes como leídos
    await Message.updateMany(
      {
        matchId,
        senderId: { $ne: req.user._id },
        read: false
      },
      { read: true }
    );

    res.render('pages/chat', {
      user: req.user,
      match,
      otherUser,
      messages,
      isAuthenticated: req.oidc.isAuthenticated()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el chat');
  }
};

// Enviar mensaje (usado por Socket.IO)
exports.sendMessage = async (matchId, senderId, content) => {
  try {
    const match = await Match.findById(matchId);

    if (!match || match.status === 'rejected') {
      throw new Error('No se puede enviar mensajes en este match');
    }

    // Si el chat está en pausa (esperando match por fotos), no permitir mensajes
    if (match.status === 'photo_matching') {
      throw new Error('El chat está en pausa hasta completar el match por fotos');
    }

    const message = new Message({
      matchId,
      senderId,
      content
    });

    await message.save();
    await message.populate('senderId');

    return message;
  } catch (error) {
    throw error;
  }
};

// Obtener mensajes de un match
exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;

    const messages = await Message.find({ matchId })
      .populate('senderId')
      .sort('createdAt');

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};
