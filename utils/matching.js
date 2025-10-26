// Calcula compatibilidad entre dos usuarios basado en respuestas
function calculateCompatibility(user1, user2) {
  if (!user1.answers || !user2.answers || user1.answers.length === 0 || user2.answers.length === 0) {
    return 0;
  }

  let matchingAnswers = 0;
  let totalQuestions = 0;

  // Comparar respuestas a las mismas preguntas
  user1.answers.forEach(answer1 => {
    const answer2 = user2.answers.find(a => a.questionId === answer1.questionId);
    if (answer2) {
      totalQuestions++;
      if (answer1.answer === answer2.answer) {
        matchingAnswers++;
      }
    }
  });

  if (totalQuestions === 0) return 0;

  return Math.round((matchingAnswers / totalQuestions) * 100);
}

// Verifica si un usuario cumple con las preferencias de otro
function meetsPreferences(user, preferences) {
  if (!preferences) return true;

  const { gender, minAge, maxAge, minHeight, maxHeight } = preferences;
  const profile = user.profile;

  if (!profile) return false;

  if (gender && gender !== 'any' && profile.gender !== gender) {
    return false;
  }

  if (minAge && profile.age < minAge) return false;
  if (maxAge && profile.age > maxAge) return false;
  if (minHeight && profile.height < minHeight) return false;
  if (maxHeight && profile.height > maxHeight) return false;

  return true;
}

// Encuentra potenciales matches para un usuario
async function findPotentialMatches(userId, User, Match) {
  const currentUser = await User.findById(userId);

  if (!currentUser || !currentUser.profileCompleted) {
    return [];
  }

  // Obtener IDs de usuarios con los que ya tiene match
  const existingMatches = await Match.find({
    users: userId,
    status: { $ne: 'rejected' }
  });

  const matchedUserIds = existingMatches.flatMap(match =>
    match.users.filter(id => id.toString() !== userId.toString())
  );

  // Buscar usuarios que cumplan preferencias mutuas
  const potentialUsers = await User.find({
    _id: {
      $ne: userId,
      $nin: matchedUserIds
    },
    profileCompleted: true
  });

  // Filtrar por preferencias mutuas y calcular compatibilidad
  const matches = potentialUsers
    .filter(user =>
      meetsPreferences(user, currentUser.preferences) &&
      meetsPreferences(currentUser, user.preferences)
    )
    .map(user => ({
      user,
      compatibility: calculateCompatibility(currentUser, user)
    }))
    .filter(match => match.compatibility >= 30) // Mínimo 30% compatibilidad
    .sort((a, b) => b.compatibility - a.compatibility);

  return matches;
}

module.exports = {
  calculateCompatibility,
  meetsPreferences,
  findPotentialMatches
};
