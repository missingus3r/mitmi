const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  photo: String,

  // Respuestas a preguntas de intereses
  answers: [{
    questionId: String,
    answer: String
  }],

  // Preferencias físicas y demográficas
  preferences: {
    gender: String, // 'male', 'female', 'any'
    minAge: Number,
    maxAge: Number,
    minHeight: Number,
    maxHeight: Number
  },

  // Datos personales
  profile: {
    age: Number,
    height: Number,
    gender: String,
    bio: String
  },

  // Estado del perfil
  profileCompleted: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
