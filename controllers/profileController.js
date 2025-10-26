const User = require('../models/User');
const Question = require('../models/Question');

// Mostrar formulario de perfil
exports.showProfileForm = async (req, res) => {
  try {
    const questions = await Question.find().sort('category');
    res.render('pages/profile-setup', {
      user: req.user,
      questions,
      isAuthenticated: req.oidc.isAuthenticated()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario');
  }
};

// Guardar perfil y respuestas
exports.saveProfile = async (req, res) => {
  try {
    const { age, height, gender, bio, prefGender, prefMinAge, prefMaxAge, prefMinHeight, prefMaxHeight, ...answers } = req.body;

    // Procesar respuestas
    const userAnswers = Object.keys(answers)
      .filter(key => key.startsWith('q_'))
      .map(key => ({
        questionId: key.replace('q_', ''),
        answer: answers[key]
      }));

    // Actualizar usuario
    await User.findByIdAndUpdate(req.user._id, {
      profile: {
        age: parseInt(age),
        height: parseInt(height),
        gender,
        bio
      },
      preferences: {
        gender: prefGender,
        minAge: parseInt(prefMinAge),
        maxAge: parseInt(prefMaxAge),
        minHeight: parseInt(prefMinHeight),
        maxHeight: parseInt(prefMaxHeight)
      },
      answers: userAnswers,
      profileCompleted: true
    });

    res.redirect('/matches');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar el perfil');
  }
};

// Subir foto de perfil
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se subió ninguna foto');
    }

    await User.findByIdAndUpdate(req.user._id, {
      photo: `/images/uploads/${req.file.filename}`
    });

    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al subir la foto');
  }
};
