// Conectar a Socket.IO
const socket = io();

// Variables globales del chat (definidas en la página)
// matchId, userId, matchStatus

// Unirse a la sala del chat
socket.emit('join-chat', matchId);

// Referencias a elementos del DOM
const messagesContainer = document.getElementById('messagesContainer');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.getElementById('typingIndicator');
const requestPhotoRevealBtn = document.getElementById('requestPhotoReveal');
const likePhotoBtn = document.getElementById('likePhoto');
const dislikePhotoBtn = document.getElementById('dislikePhoto');

// Scroll al final de los mensajes
function scrollToBottom() {
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Scroll inicial
scrollToBottom();

// Enviar mensaje
if (messageForm) {
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const content = messageInput.value.trim();

    if (!content) return;

    // Enviar mensaje via Socket.IO
    socket.emit('send-message', {
      matchId,
      senderId: userId,
      content
    });

    // Limpiar input
    messageInput.value = '';

    // Detener indicador de escritura
    socket.emit('stop-typing', { matchId, userId });
  });
}

// Recibir nuevos mensajes
socket.on('new-message', (message) => {
  const messageDiv = document.createElement('div');
  const isOwnMessage = message.senderId._id === userId;

  messageDiv.className = `message ${isOwnMessage ? 'message-sent' : 'message-received'}`;

  const time = new Date(message.createdAt).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  messageDiv.innerHTML = `
    <div class="message-content">${escapeHtml(message.content)}</div>
    <div class="message-time">${time}</div>
  `;

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
});

// Indicador de escritura
let typingTimeout;

if (messageInput) {
  messageInput.addEventListener('input', () => {
    socket.emit('typing', { matchId, userId });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('stop-typing', { matchId, userId });
    }, 1000);
  });
}

// Mostrar indicador cuando el otro usuario está escribiendo
socket.on('user-typing', (data) => {
  if (data.userId !== userId && typingIndicator) {
    typingIndicator.style.display = 'block';
  }
});

socket.on('user-stop-typing', (data) => {
  if (data.userId !== userId && typingIndicator) {
    typingIndicator.style.display = 'none';
  }
});

// Solicitar revelar fotos
if (requestPhotoRevealBtn) {
  requestPhotoRevealBtn.addEventListener('click', async () => {
    if (!confirm('¿Quieres solicitar ver las fotos? El chat se pausará hasta que ambos acepten y completen el match por fotos.')) {
      return;
    }

    try {
      const response = await fetch(`/matches/${matchId}/request-photo-reveal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        if (data.bothAccepted) {
          alert('¡Ambos aceptaron! Recargando para ver las fotos...');
        } else {
          alert('Solicitud enviada. Esperando que la otra persona acepte.');
        }
        location.reload();
      } else {
        alert('Error: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al solicitar revelación de fotos');
    }
  });
}

// Responder al match por fotos (me gusta)
if (likePhotoBtn) {
  likePhotoBtn.addEventListener('click', async () => {
    await handlePhotoResponse(true);
  });
}

// Responder al match por fotos (no me gusta)
if (dislikePhotoBtn) {
  dislikePhotoBtn.addEventListener('click', async () => {
    if (!confirm('¿Estás seguro? Si rechazas, la conversación terminará.')) {
      return;
    }
    await handlePhotoResponse(false);
  });
}

async function handlePhotoResponse(liked) {
  try {
    const response = await fetch(`/matches/${matchId}/photo-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ liked })
    });

    const data = await response.json();

    if (data.success) {
      if (data.status === 'matched') {
        alert('¡Match completo! Ambos se gustaron. Pueden seguir chateando.');
      } else if (data.status === 'rejected') {
        alert('No hubo match. La conversación ha terminado.');
      } else {
        alert('Respuesta registrada. Esperando respuesta de la otra persona...');
      }
      location.reload();
    } else {
      alert('Error: ' + (data.error || 'Error desconocido'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar respuesta');
  }
}

// Función para escapar HTML (prevenir XSS)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Manejo de errores de Socket.IO
socket.on('error', (message) => {
  alert('Error: ' + message);
});
