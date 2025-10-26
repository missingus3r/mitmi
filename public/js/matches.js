// Manejar creación de matches
document.querySelectorAll('.create-match').forEach(button => {
  button.addEventListener('click', async function() {
    const targetUserId = this.getAttribute('data-user-id');

    if (!targetUserId) {
      alert('Error: Usuario no encontrado');
      return;
    }

    // Deshabilitar botón mientras se procesa
    this.disabled = true;
    this.textContent = 'Creando match...';

    try {
      const response = await fetch('/matches/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetUserId })
      });

      const data = await response.json();

      if (data.success) {
        alert(`¡Match creado! ${data.compatibility}% de compatibilidad`);
        // Redirigir al chat
        window.location.href = `/chat/${data.matchId}`;
      } else {
        alert('Error al crear match: ' + (data.error || 'Error desconocido'));
        this.disabled = false;
        this.textContent = 'Hacer Match';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear match');
      this.disabled = false;
      this.textContent = 'Hacer Match';
    }
  });
});
