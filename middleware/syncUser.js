const User = require('../models/User');

// Middleware para sincronizar usuario de Auth0 con MongoDB
const syncUser = async (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    try {
      const auth0User = req.oidc.user;

      let user = await User.findOne({ auth0Id: auth0User.sub });

      if (!user) {
        // Crear nuevo usuario si no existe
        user = new User({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          name: auth0User.name,
          photo: auth0User.picture
        });
        await user.save();
      }

      // Agregar usuario a request
      req.user = user;
    } catch (error) {
      console.error('Error sincronizando usuario:', error);
    }
  }
  next();
};

module.exports = syncUser;
