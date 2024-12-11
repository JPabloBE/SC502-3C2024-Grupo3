document.addEventListener('DOMContentLoaded', async () => {
    const reservasList = document.getElementById('reservas-list');
    const userName = document.getElementById('user-name');
    const userImage = document.getElementById('user-image');
  
    try {
        const response = await fetch('http://localhost:8000/backend/reservas.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const { user, alojamientos } = data;
  
        // Mostrar datos del usuario logueado
        if (user) {
            userName.textContent = user.name;
            userImage.src = user.image || '/imgs/user-placeholder.png';
        } else {
            userName.textContent = 'Invitado';
        }
  
        alojamientos.forEach(alojamiento => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card shadow mb-4">
                    <img src="${alojamiento.alojamiento_imagen}" class="card-img-top" alt="Imagen del Alojamiento">
                    <div class="card-body">
                        <h5 class="card-title">${alojamiento.alojamiento_nombre}</h5>
                        <p class="card-text">${alojamiento.descripcion}</p>
                        <p class="card-text">Precio por Noche: $${alojamiento.precio_noche}</p>
                        <form class="reservation-form">
                            <label for="fecha-${alojamiento.id_alojamiento}" class="form-label">Fecha de Inicio:</label>
                            <input type="date" id="fecha-${alojamiento.id_alojamiento}" class="form-control mb-2" required>
  
                            <label for="noches-${alojamiento.id_alojamiento}" class="form-label">Noches:</label>
                            <input type="number" id="noches-${alojamiento.id_alojamiento}" class="form-control mb-2" min="1" required>
  
                            <label for="personas-${alojamiento.id_alojamiento}" class="form-label">Personas:</label>
                            <input type="number" id="personas-${alojamiento.id_alojamiento}" class="form-control mb-2" min="1" required>
  
                            <button type="button" class="btn btn-success btn-reservar" data-id="${alojamiento.id_alojamiento}" data-precio="${alojamiento.precio_noche}">
                                Reservar
                            </button>
                        </form>
                    </div>
                </div>
            `;
            reservasList.appendChild(card);
        });
  
        document.querySelectorAll('.btn-reservar').forEach(button => {
            button.addEventListener('click', async (event) => {
                const alojamientoId = event.target.getAttribute('data-id');
                const precioNoche = event.target.getAttribute('data-precio');
                const fecha = document.getElementById(`fecha-${alojamientoId}`).value;
                const noches = parseInt(document.getElementById(`noches-${alojamientoId}`).value, 10);
                const personas = parseInt(document.getElementById(`personas-${alojamientoId}`).value, 10);
  
                if (!fecha || isNaN(noches) || isNaN(personas) || noches <= 0 || personas <= 0) {
                    alert('Por favor, completa todos los campos con valores válidos.');
                    return;
                }
  
                const total = noches * precioNoche;
  
                try {
                    const reservationData = {
                        alojamientoId,
                        userId: user?.id || null,
                        fecha,
                        noches,
                        personas,
                        total
                    };
  
                    const reservationResponse = await fetch('http://localhost:8000/backend/reservar.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(reservationData)
                    });
  
                    const result = await reservationResponse.json();
  
                    if (reservationResponse.ok) {
                        alert(`Reserva confirmada:\nUsuario: ${user?.name || 'Desconocido'}\nFecha: ${fecha}\nNoches: ${noches}\nTotal: $${total}`);
                    } else {
                        alert(`Error al reservar: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error al reservar:', error);
                    alert('Error al procesar la reserva. Por favor, intenta más tarde.');
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar las reservas:', error);
        reservasList.innerHTML = '<div class="text-danger text-center">Error al cargar los alojamientos. Por favor, intenta más tarde.</div>';
    }
  });