document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.querySelector(".container-fluid");
    const user = JSON.parse(localStorage.getItem("usuario"));

    if (user) {
        // Eliminar el botón de inicio de sesión si el usuario está logueado
        const loginButton = document.querySelector(".btn-outline-dark");
        if (loginButton) loginButton.remove();

        // Crear un enlace que redirija al perfil del usuario
        const userSection = document.createElement("div");
        userSection.className = "d-flex align-items-center";

        userSection.innerHTML = `
            <a href="profileInfo.html" class="d-flex align-items-center text-decoration-none text-dark me-2">
                <span>Hola, ${user.nombre}</span>
                <img src="${user.imagen || 'https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'}" 
                     alt="Avatar" class="avatar rounded-circle ms-2" width="30" height="30">
            </a>
            <button id="logoutButton" class="btn btn-outline-danger ms-2">Cerrar Sesión</button>
        `;

        navbarContainer.appendChild(userSection);

        // Si el usuario es propietario (rol=3), mostrar la opción de "Gestión de Alojamientos"
        if (user.rol === 3) {
            const gestionAlojamientosLink = document.getElementById("gestionAlojamientosLink");
            if (gestionAlojamientosLink) {
                gestionAlojamientosLink.style.display = "inline";  // Mostrar el enlace
            }
        }

        // Manejar cierre de sesión
        document.getElementById("logoutButton").addEventListener("click", function () {
            localStorage.removeItem("usuario");
            window.location.reload();
        });
    } else {
        // Si no hay usuario, se puede ocultar el botón de cierre de sesión y mostrar el login
        const loginButton = document.querySelector(".btn-outline-dark");
        if (loginButton) loginButton.style.display = "inline"; // Mostrar el login si no hay usuario
    }
});
