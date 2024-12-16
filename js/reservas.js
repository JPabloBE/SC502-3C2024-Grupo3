document.addEventListener('DOMContentLoaded', async () => {
    const reservasList = document.getElementById('reservas-list');
    const navbarContainer = document.querySelector(".container-fluid");
    const user = JSON.parse(localStorage.getItem("usuario"));

    try {
        const response = await fetch('http://localhost:8000/backend/reservar.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
 
        const alojamientos = await response.json();

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
                
                // Depuración: imprimir valores en la consola
                console.log({user, fecha, noches, personas });

                // Validar campos
                if (!fecha || isNaN(noches) || isNaN(personas) || noches <= 0 || personas <= 0) {
                    alert('Por favor, completa todos los campos con valores válidos.');
                    return;
                }

                const total = noches * precioNoche;

                try {
                    const reservationData = {
                        alojamientoId,
                        user,
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
                        let usuario = `Nombre:${user.nombre} \nUsuario ID: ${user.id}`;
                        alert (`Reserva confirmada:\n${usuario}\nFecha: ${fecha}\nNoches: ${noches}\nTotal: $${total}`);
                    } else {
                        alert(`Error al reservar: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error al reservar:', error);
                    alert('Error al procesar la reserva. Por favor, iniciar sesion ');
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar las reservas:', error);
        reservasList.innerHTML = '<div class="text-danger text-center">Error al cargar las reservas. Por favor, intenta más tarde.</div>';
    }
});