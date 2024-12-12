document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
        // Cargar los datos del usuario en el formulario
        document.getElementById("userImage").src = user.imagen || 'default-avatar-url.jpg';
        document.getElementById("userName").innerText = user.nombre;
        document.getElementById("userEmail").innerText = user.email;
        document.getElementById("userPhone").innerText = user.telefono;
        
        // Asignar valores a los campos del formulario
        const names = user.nombre.split(' ');
        document.getElementById("firstName").value = names[0]; // Suponiendo que el primer nombre está en 'nombre'
        document.getElementById("username").value = user.username; // Cargar el username
        document.getElementById("email").value = user.email;
        document.getElementById("phoneNumber").value = user.telefono;

        // Manejar el envío del formulario
        document.getElementById("editProfileForm").addEventListener("submit", async function (event) {
            event.preventDefault();

            const firstName = document.getElementById("firstName").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const phoneNumber = document.getElementById("phoneNumber").value.trim();

            try {
                const response = await fetch('http://localhost:8000/backend/profileInfo.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_usuario: user.id,
                        nombre: firstName, // Guardar solo el primer nombre
                        username,
                        email,
                        telefono: phoneNumber,
                    })
                });

                const result = await response.json();
                if (result.success) {
                    // Actualizar localStorage con los nuevos datos
                    localStorage.setItem("usuario", JSON.stringify({ ...user, nombre: firstName, username, email, telefono: phoneNumber }));
                    document.getElementById('message').innerText = 'Perfil actualizado con éxito.';
                    document.getElementById('message').style.display = 'block';
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
                document.getElementById('message').innerText = 'Error al actualizar el perfil.';
                document.getElementById('message').style.display = 'block';
            }
        });
    } else {
        window.location.href = '/login'; // Redirigir si no hay usuario
    }
});
