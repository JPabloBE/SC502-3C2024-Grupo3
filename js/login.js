****login.js:
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        displayError("Por favor, complete todos los campos.");
        return;
    }

    try {
        // Realizar la solicitud al backend
        const response = await fetch('http://localhost:8000/backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Procesar la respuesta del servidor
        const result = await response.json();

        if (result.success) {
            // Guardar datos del usuario en localStorage
            localStorage.setItem("usuario", JSON.stringify({
                id: result.id_usuario,
                rol: result.rol,
                nombre: result.nombre,
                username: result.username,
                email: result.email,
                telefono: result.telefono,
                imagen: result.usuario_imagen,
            }));
            // Redirigir al usuario en caso de éxito
            window.location.href = "/index.html";
        } else {
            displayError(result.message);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        displayError("Error al conectar con el servidor. Inténtelo de nuevo.");
    }
});

// Función para mostrar errores en pantalla
function displayError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.innerText = message;
    errorElement.style.display = "block";
}
