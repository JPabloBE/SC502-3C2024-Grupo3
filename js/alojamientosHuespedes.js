document.addEventListener('DOMContentLoaded', async () => {
  const alojamientosList = document.getElementById('alojamiento-list');

  try {
    const response = await fetch('http://localhost:8000/backend/alojamientosHuespedes.php');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const alojamientos = await response.json();

    alojamientosList.innerHTML = `
      <div class="container py-2">
        <div class="h1 text-center text-dark" id="pageHeaderTitle">Todos los Alojamientos</div>
        <div class="row"></div>
      </div>
    `;
    const row = alojamientosList.querySelector('.row');

    alojamientos.forEach(alojamiento => {
      const card = document.createElement('div');
      card.className = 'col-md-4'; // Tres columnas por fila en pantallas medianas
      card.innerHTML = `
        <div class="card shadow mb-4">
          <img src="${alojamiento.alojamiento_imagen}" class="card-img-top" alt="Imagen del Alojamiento">
          <div class="card-body">
            <h5 class="card-title">${alojamiento.alojamiento_nombre}</h5>
            <div class="anfitrion d-flex align-items-center mb-3">
              <img src="${alojamiento.anfitrion_imagen || '/imgs/anfitrion-placeholder.png'}" 
                   alt="Foto del Anfitrión" 
                   class="me-2 anfitrion-img">
              <div>
                <span class="bold">Anfitrión:</span> 
                <span>${alojamiento.anfitrion_nombre || 'No especificado'}</span>
              </div>
            </div>
            <p class="card-text">${alojamiento.descripcion}</p>
            <p class="card-text">Precio por Noche: <span>$${alojamiento.precio_noche}</span></p>
            <div class="ubicacion d-flex align-items-center">
              <img src="/imgs/Location-icon.png" alt="Ícono de Ubicación" class="me-2" style="width: 20px; height: 20px;">
              <p class="card-text">Ubicación: <span>${alojamiento.ubicacion || 'No especificada'}</span></p>
            </div>
            <div class="d-flex justify-content-between mt-3">
              <a href="/usuario/alojamientos/${alojamiento.anfitrion_id}" class="btn btn-primary">Ver Detalle</a>
              <button class="btn btn-success reservar-btn" data-id="${alojamiento.alojamiento_id}">Reservar Ahora</button>
            </div>
          </div>
        </div>
      `;
      row.appendChild(card);
    });

    // Manejar el evento de reserva
    document.querySelectorAll('.reservar-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const alojamientoId = e.target.getAttribute('data-id');
        try {
          const response = await fetch(`/reservar/${alojamientoId}`, { method: 'POST' });
          if (response.ok) {
            alert('Reserva realizada con éxito');
          } else {
            alert('Error al realizar la reserva. Inténtalo de nuevo más tarde.');
          }
        } catch (error) {
          console.error('Error al realizar la reserva:', error);
          alert('Error al conectar con el servidor. Inténtalo más tarde.');
        }
      });
    });

  } catch (error) {
    console.error('Error al cargar los alojamientos:', error);
    alojamientosList.innerHTML = '<div class="text-danger text-center">Error al cargar los alojamientos. Por favor, intenta más tarde.</div>';
  }
});
