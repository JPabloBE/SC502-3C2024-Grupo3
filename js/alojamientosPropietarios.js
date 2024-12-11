document.addEventListener('DOMContentLoaded', () => {
    const modal = new bootstrap.Modal(document.getElementById('modal-alojamiento'));
    const alojamientosContainer = document.getElementById('alojamientos-container');
    const alertContainer = document.getElementById('alert-container'); // Contenedor para alertas

    let isEditMode = false;
    let originalData = {}; // Variable para almacenar los datos originales

    // Función para cargar alojamientos
    async function cargarAlojamientos() {
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            if (!usuario || !usuario.id) {
                mostrarAlerta("Error: Usuario no logueado.", "danger");
                return;
            }

            // Enviar el id_usuario como parámetro en la solicitud
            const response = await fetch(`http://localhost:8000/backend/alojamientosPropietarios.php?id_usuario=${usuario.id}`);
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
                asignarEventosBotones();
            } else {
                console.error("La respuesta no es un array válido", alojamientos);
            }
        } catch (error) {
            console.error('Error al cargar alojamientos:', error);
        }
    }

    function asignarEventosBotones() {
        document.querySelectorAll('.edit-alojamiento-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                await cargarAlojamientoPorId(id); // Cargar datos para editar
            });
        });

        document.querySelectorAll('.delete-alojamiento-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                await eliminarAlojamientos(id); // Llamar a la función para eliminar
            });
        });
    }

    // Función para abrir el modal
    document.getElementById('add-alojamiento-btn').addEventListener('click', () => {
        isEditMode = false; // Modo de creación
        document.getElementById('form-alojamiento').reset(); // Limpiar el formulario
        if (alertContainer) alertContainer.innerHTML = ''; // Limpiar mensajes previos
        modal.show(); // Mostrar el modal
    });

    // Función para guardar alojamiento
    document.getElementById('save-alojamiento-btn').addEventListener('click', async () => {
        const formData = new FormData(document.getElementById('form-alojamiento'));
        const data = Object.fromEntries(formData.entries());

        // Verificar si todos los campos requeridos están llenos
        if (!data.nombre || !data.descripcion || !data.alojamientoTipo || !data.numHabitaciones || !data.numBanos || !data.capacidad || !data.precioNoche || !data.ubicacion || !data.calificacion) {
            mostrarAlerta("Por favor, completa todos los campos requeridos.", "danger");
            return;
        }

        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario) {
            data.id_usuario = usuario.id;
        } else {
            mostrarAlerta("Error: No hay usuario logueado.", "danger");
            return;
        }

        try {
            let response;
            if (isEditMode) {
                // Si estamos en modo edición, usamos PUT
                response = await fetch(`http://localhost:8000/backend/alojamientosPropietarios.php`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            } else {
                // Si estamos creando un nuevo alojamiento, usamos POST
                response = await fetch(`http://localhost:8000/backend/alojamientosPropietarios.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            }

            const result = await response.json();

            if (response.ok) {
                await cargarAlojamientos();
                modal.hide();
                mostrarAlerta(isEditMode ? "Alojamiento actualizado exitosamente." : "Alojamiento agregado exitosamente.", "success");
            } else {
                mostrarAlerta(`Error al ${isEditMode ? 'actualizar' : 'agregar'} alojamiento: ${result.error}`, "danger");
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta("Error al conectar con el servidor.", "danger");
        }
    });

    // Función para eliminar alojamiento
    async function eliminarAlojamientos(id) {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este alojamiento?");
        if (!confirmacion) return;

        try {
            const response = await fetch(`http://localhost:8000/backend/alojamientosPropietarios.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_alojamiento: id })
            });

            const result = await response.json();

            if (response.ok) {
                mostrarAlerta("Alojamiento eliminado exitosamente.", "success");
                await cargarAlojamientos();
            } else {
                mostrarAlerta(`Error al eliminar alojamiento: ${result.error}`, "danger");
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta("Error al conectar con el servidor.", "danger");
        }
    }

    function mostrarAlerta(mensaje, tipo) {
        const alerta = document.createElement('div');

        alerta.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                <strong>${tipo === 'success' ? 'Éxito!' : 'Error!'}</strong> ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        alertContainer.appendChild(alerta);

        // Ocultar la alerta después de 5 segundos
        setTimeout(() => {
            alerta.classList.remove('show');
            alerta.classList.add('fade');

            setTimeout(() => {
                alertContainer.removeChild(alerta);
            }, 150); // Tiempo de espera para que la animación 'fade' complete
        }, 3000); // Tiempo en milisegundos
    }

    async function cargarAlojamientoPorId(id) {
        try {
            const response = await fetch(`http://localhost:8000/backend/alojamientosPropietarios.php?id_alojamiento=${id}`);
            const alojamiento = await response.json();

            if (response.ok && alojamiento) {
                // Rellenar el formulario con los datos del alojamiento
                document.querySelector('input[name="id_alojamiento"]').value = alojamiento.id_alojamiento;
                document.getElementById('nombre').value = alojamiento.nombre;
                document.getElementById('descripcion').value = alojamiento.descripcion;
                document.getElementById('alojamientoTipo').value = alojamiento.tipo_alojamiento;
                document.getElementById('numHabitaciones').value = alojamiento.num_habitaciones;
                document.getElementById('numBanos').value = alojamiento.num_banos;
                document.getElementById('capacidad').value = alojamiento.capacidad;
                document.getElementById('precioNoche').value = alojamiento.precio_noche;
                document.getElementById('ubicacion').value = alojamiento.ubicacion;
                document.getElementById('calificacion').value = alojamiento.calificacion;
                document.getElementById('activo').checked = alojamiento.disponibilidad === 1; // Suponiendo que disponibilidad es un booleano
                document.getElementById('imagenUrl').value = alojamiento.alojamiento_imagen;

                originalData = { ...alojamiento }; // Guardar los datos originales
                isEditMode = true; // Cambiar a modo edición
                modal.show(); // Mostrar el modal
            } else {
                console.error("Error al cargar el alojamiento:", response.statusText);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
        }
    }

    // Cargar alojamientos al inicio
    cargarAlojamientos();
});
