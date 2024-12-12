const modal = document.getElementById("modal-alojamiento");
const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modal-title");
const saveAlojamientoBtn = document.getElementById("save-alojamiento-btn");

// Elementos del formulario
const formAlojamiento = document.getElementById("form-alojamiento");
const nombreInput = document.getElementById("nombre");
const descripcionInput = document.getElementById("descripcion");
const tipoInput = document.getElementById("alojamientoTipo");
const habitacionesInput = document.getElementById("numHabitaciones");
const banosInput = document.getElementById("numBanos");
const capacidadInput = document.getElementById("capacidad");
const precioInput = document.getElementById("precioNoche");
const ubicacionInput = document.getElementById("ubicacion");
const calificacionInput = document.getElementById("calificacion");
const activoInput = document.getElementById("activo");
const imagenFileInput = document.getElementById("imagenFile");
const previewImage = document.getElementById("previewImage");

let isEditMode = false;

// Función para abrir el modal en modo agregar
function openAddModal() {
    modalTitle.textContent = "Agregar Alojamiento";
    formAlojamiento.reset();
    previewImage.src = "";
    isEditMode = false;
    modal.style.display = "block";
    overlay.style.display = "block";  // Mostrar el overlay (fondo oscuro)
}

// Función para abrir el modal en modo editar con datos pre-llenados
function openEditModal(alojamiento) {
    modalTitle.textContent = "Editar Alojamiento";
    nombreInput.value = alojamiento.nombre;
    descripcionInput.value = alojamiento.descripcion;
    tipoInput.value = alojamiento.alojamientoTipo;
    habitacionesInput.value = alojamiento.numHabitaciones;
    banosInput.value = alojamiento.numBanos;
    capacidadInput.value = alojamiento.capacidad;
    precioInput.value = alojamiento.precioNoche;
    ubicacionInput.value = alojamiento.ubicacion;
    calificacionInput.value = alojamiento.calificacion;
    activoInput.checked = alojamiento.activo;
    previewImage.src = alojamiento.rutaImagen || "";
    isEditMode = true;
    modal.style.display = "block";
    overlay.style.display = "block";  // Mostrar el overlay (fondo oscuro)
}

// Función para cerrar el modal
function closeModal() {
    modal.style.display = "none";
    overlay.style.display = "none";  // Ocultar el overlay (fondo oscuro)
}

// Asigna evento al botón de "Agregar Alojamiento"
document.getElementById("add-alojamiento-btn").addEventListener("click", openAddModal);

// Agrega el evento a los botones de "Editar" para cada alojamiento
document.querySelectorAll(".edit-alojamiento-btn").forEach(button => {
    button.addEventListener("click", () => {
        const alojamiento = {
            nombre: "Nombre de ejemplo",
            descripcion: "Descripción de ejemplo",
            alojamientoTipo: "Tipo de ejemplo",
            numHabitaciones: 2,
            numBanos: 1,
            capacidad: 4,
            precioNoche: 100.0,
            ubicacion: "Ubicación de ejemplo",
            calificacion: 8.5,
            activo: true,
            rutaImagen: "ruta_a_la_imagen.jpg"
        };
        openEditModal(alojamiento);
    });
});

// Vista previa de la imagen cargada
function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Cierra el modal si se hace clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === overlay) {
        closeModal();
    }
});