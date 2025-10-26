require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/database');
const authMiddleware = require('./config/auth0');
const syncUser = require('./middleware/syncUser');
const chatController = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conectar a MongoDB
connectDB();

// Configurar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
    }
  })
);

// Configurar Auth0
app.use(authMiddleware);
app.use(syncUser);

// Configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', require('./routes/index'));
app.use('/profile', require('./routes/profile'));
app.use('/matches', require('./routes/matches'));
app.use('/chat', require('./routes/chat'));

// Socket.IO para chat en tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a una sala de chat (match)
  socket.on('join-chat', (matchId) => {
    socket.join(matchId);
    console.log(`Usuario se unió al chat: ${matchId}`);
  });

  // Enviar mensaje
  socket.on('send-message', async (data) => {
    try {
      const { matchId, senderId, content } = data;
      const message = await chatController.sendMessage(matchId, senderId, content);

      // Emitir mensaje a todos en la sala
      io.to(matchId).emit('new-message', message);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Usuario está escribiendo
  socket.on('typing', (data) => {
    socket.to(data.matchId).emit('user-typing', {
      userId: data.userId
    });
  });

  // Usuario dejó de escribir
  socket.on('stop-typing', (data) => {
    socket.to(data.matchId).emit('user-stop-typing', {
      userId: data.userId
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = { app, io };
