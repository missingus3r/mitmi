const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../models/Question');

const questions = [
  // Intereses
  {
    questionId: 'q1',
    text: '¿Qué tipo de películas prefieres?',
    category: 'interests',
    type: 'multiple',
    options: ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Romance', 'Documental'],
    weight: 2
  },
  {
    questionId: 'q2',
    text: '¿Qué tipo de música escuchas?',
    category: 'interests',
    type: 'multiple',
    options: ['Rock', 'Pop', 'Reggaeton', 'Electrónica', 'Jazz', 'Clásica', 'Hip Hop', 'Indie'],
    weight: 2
  },
  {
    questionId: 'q3',
    text: '¿Qué haces en tu tiempo libre?',
    category: 'hobbies',
    type: 'multiple',
    options: ['Leer', 'Hacer ejercicio', 'Videojuegos', 'Cocinar', 'Viajar', 'Arte', 'Deportes', 'Socializar'],
    weight: 3
  },

  // Estilo de vida
  {
    questionId: 'q4',
    text: '¿Eres más de salir o quedarte en casa?',
    category: 'lifestyle',
    type: 'multiple',
    options: ['Definitivamente salir', 'Más de salir', 'Equilibrado', 'Más de casa', 'Definitivamente casa'],
    weight: 2
  },
  {
    questionId: 'q5',
    text: '¿Prefieres la mañana o la noche?',
    category: 'lifestyle',
    type: 'multiple',
    options: ['Madrugador', 'Mañana', 'Tarde', 'Noche', 'Trasnochador'],
    weight: 1
  },
  {
    questionId: 'q6',
    text: '¿Con qué frecuencia haces ejercicio?',
    category: 'lifestyle',
    type: 'multiple',
    options: ['Diario', '4-5 veces/semana', '2-3 veces/semana', '1 vez/semana', 'Rara vez', 'Nunca'],
    weight: 1
  },

  // Valores
  {
    questionId: 'q7',
    text: '¿Qué es más importante para ti en una relación?',
    category: 'values',
    type: 'multiple',
    options: ['Comunicación', 'Confianza', 'Diversión', 'Apoyo mutuo', 'Pasión', 'Lealtad'],
    weight: 3
  },
  {
    questionId: 'q8',
    text: '¿Qué tan importante es la familia para ti?',
    category: 'values',
    type: 'multiple',
    options: ['Muy importante', 'Importante', 'Moderadamente importante', 'Poco importante', 'No muy importante'],
    weight: 2
  },
  {
    questionId: 'q9',
    text: '¿Cómo manejas los conflictos?',
    category: 'values',
    type: 'multiple',
    options: ['Hablo directamente', 'Necesito tiempo para pensar', 'Evito confrontaciones', 'Busco compromiso', 'Prefiero que pase el tiempo'],
    weight: 2
  },

  // Preferencias de relación
  {
    questionId: 'q10',
    text: '¿Qué buscas en Mitmi?',
    category: 'preferences',
    type: 'multiple',
    options: ['Relación seria a largo plazo', 'Conocer gente nueva', 'Amistad', 'Ver qué pasa', 'Algo casual'],
    weight: 3
  },
  {
    questionId: 'q11',
    text: '¿Qué tan importante es tener intereses en común?',
    category: 'preferences',
    type: 'multiple',
    options: ['Muy importante', 'Importante', 'Moderadamente importante', 'Poco importante', 'No muy importante'],
    weight: 2
  },
  {
    questionId: 'q12',
    text: '¿Prefieres planes espontáneos o planificados?',
    category: 'lifestyle',
    type: 'multiple',
    options: ['Muy espontáneo', 'Algo espontáneo', 'Equilibrado', 'Algo planificado', 'Muy planificado'],
    weight: 1
  },

  // Adicionales
  {
    questionId: 'q13',
    text: '¿Tienes mascotas o te gustaría tenerlas?',
    category: 'lifestyle',
    type: 'multiple',
    options: ['Tengo y amo', 'Me gustaría tener', 'Me son indiferentes', 'Prefiero no tener', 'Soy alérgico/a'],
    weight: 1
  },
  {
    questionId: 'q14',
    text: '¿Qué tan sociable eres?',
    category: 'lifestyle',
    type: 'multiple',
    options: ['Muy sociable', 'Sociable', 'Moderadamente sociable', 'Poco sociable', 'Introvertido/a'],
    weight: 2
  },
  {
    questionId: 'q15',
    text: '¿Qué tan importante es el sentido del humor?',
    category: 'values',
    type: 'multiple',
    options: ['Esencial', 'Muy importante', 'Importante', 'Moderadamente importante', 'No tan importante'],
    weight: 2
  }
];

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    await Question.deleteMany({});
    console.log('Preguntas anteriores eliminadas');

    await Question.insertMany(questions);
    console.log('15 preguntas insertadas exitosamente');

    mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedQuestions();
