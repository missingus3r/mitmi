const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Puntaje de compatibilidad basado en intereses (0-100)
  compatibilityScore: Number,

  // Estado del match
  status: {
    type: String,
    enum: ['chatting', 'photo_reveal_pending', 'photo_matching', 'matched', 'rejected'],
    default: 'chatting'
  },

  // Control de revelación de fotos
  photoReveal: {
    user1Accepted: {
      type: Boolean,
      default: false
    },
    user2Accepted: {
      type: Boolean,
      default: false
    },
    bothAccepted: {
      type: Boolean,
      default: false
    }
  },

  // Match por fotos (después de revelar)
  photoMatch: {
    user1Liked: {
      type: Boolean,
      default: null
    },
    user2Liked: {
      type: Boolean,
      default: null
    },
    bothLiked: {
      type: Boolean,
      default: false
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  endedAt: Date
});

// Índice para búsquedas rápidas
matchSchema.index({ users: 1, status: 1 });

module.exports = mongoose.model('Match', matchSchema);
