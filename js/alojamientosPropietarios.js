const modal = new bootstrap.Modal(document.getElementById('modal-alojamiento'));
const alojamientosContainer = document.getElementById('alojamientos-container');
const messageContainer = document.getElementById('message-container'); // Contenedor para mensajes
let isEditMode = false;

// Función para cargar alojamientos
async function cargarAlojamientos() {
    try {
        const response = await fetch('http://localhost:8000/backend/alojamientosPropietarios.php');
        const alojamientos = await response.json();

        if (Array.isArray(alojamientos)) {
            alojamientosContainer.innerHTML = ''; // Limpiar contenedor
            alojamientos.forEach(alojamiento => {
                const card = document.createElement('div');
                card.className = 'col-12 col-sm-6 col-md-4 mb-4';
                card.innerHTML =
                    `<div class='card'>
                        <img src="${alojamiento.alojamiento_imagen}" class='card-img-top' alt="${alojamiento.nombre}">
                        <div class='card-body'>
                            <h5 class='card-title'>${alojamiento.nombre}</h5>
                            <p class='card-text'>${alojamiento.descripcion}</p>
                            <p class='card-text'>$${alojamiento.precio_noche} por noche</p>
                            <button class='btn btn-primary edit-alojamiento-btn' data-id="${alojamiento.id_alojamiento}">Editar</button>
                            <button class='btn btn-danger delete-alojamiento-btn' data-id="${alojamiento.id_alojamiento}">Eliminar</button>
                        </div>
                    </div>`;
                alojamientosContainer.appendChild(card);
            });

            // Asignar eventos a los botones después de que se han creado
            document.querySelectorAll('.edit-alojamiento-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const id = event.target.getAttribute('data-id');
                    await cargarAlojamientoPorId(id); // Cargar datos para editar
                });
            });

            document.querySelectorAll('.delete-alojamiento-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const id = event.target.getAttribute('data-id');
                    await eliminarAlojamiento(id); // Llamar a la función para eliminar
                });
            });
        } else {
            console.error("La respuesta no es un array válido", alojamientos);
        }
    } catch (error) {
        console.error('Error al cargar alojamientos:', error);
    }
}

// Función para abrir el modal
document.getElementById('add-alojamiento-btn').addEventListener('click', () => {
    isEditMode = false; // Modo de creación
    document.getElementById('form-alojamiento').reset(); // Limpiar el formulario
    messageContainer.innerText = ''; // Limpiar mensajes previos
    modal.show(); // Mostrar el modal
});

// Función para guardar alojamiento
document.getElementById('save-alojamiento-btn').addEventListener('click', async () => {
    const formData = new FormData(document.getElementById('form-alojamiento'));
    const data = Object.fromEntries(formData.entries());

    // Obtener el id_usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        data.id_usuario = usuario.id; // Agregar id_usuario a los datos
    } else {
        messageContainer.innerText = "Error: No hay usuario logueado.";
        messageContainer.classList.add("text-danger");
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/backend/alojamientosPropietarios.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            await cargarAlojamientos(); // Recargar alojamientos después de guardar
            modal.hide(); // Cerrar el modal
            messageContainer.innerText = "Alojamiento guardado exitosamente.";
            messageContainer.classList.remove("text-danger");
            messageContainer.classList.add("text-success");
        } else {
            const errorData = await response.json();
            messageContainer.innerText = `Error al guardar alojamiento: ${errorData.error}`;
            messageContainer.classList.add("text-danger");
        }
    } catch (error) {
        console.error('Error:', error);
        messageContainer.innerText = "Error al conectar con el servidor.";
        messageContainer.classList.add("text-danger");
    }
});

// Cargar alojamientos al inicio
cargarAlojamientos();