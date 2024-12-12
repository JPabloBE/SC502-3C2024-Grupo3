function handleSubmit(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const formData = new FormData(event.target);
    formData.append('rol', selectedRole); // Agregar el rol al formulario

    fetch('/backend/registrar.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message); // Mostrar mensaje de éxito
                window.location.href = '/login.html'; // Redirigir a la página de inicio de sesión
            } else {
                alert(data.message); // Mostrar mensaje de error
            }
        })
        .catch(error => console.error('Error:', error));
}
