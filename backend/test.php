<?php
// Conectar a la base de datos
require 'dbConection.php';

// Datos del nuevo usuario
$nombre = "hugo "; // Cambia esto por el nombre del usuario deseado
$username = "hug ";     // Cambia esto por el nombre de usuario deseado
$email = "hugg@example.com";   // Cambia esto por el email deseado
$password = "contra";  // Cambia esto por la contraseña deseada
$telefono = "1234567890";         // Cambia esto por el teléfono deseado
$rol = "3";                 // Cambia esto por el rol deseado (ej. "admin", "usuario")
$usuario_imagen = "https://kellyweaverphotography.com/wp-content/uploads/2023/08/Denver-Dating-Profile-Photo-Men-5.jpg"; // Cambia esto por la ruta a la imagen del usuario

// Hashear la contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Preparar la consulta para insertar el nuevo usuario
$stmt = $pdo->prepare("INSERT INTO homeAwayDB.Usuario (nombre, username, email, contrasena, telefono, rol, usuario_imagen) 
VALUES (:nombre, :username, :email, :contrasena, :telefono, :rol, :usuario_imagen)");

$stmt->bindParam(':nombre', $nombre);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':contrasena', $hashedPassword);
$stmt->bindParam(':telefono', $telefono);
$stmt->bindParam(':rol', $rol);
$stmt->bindParam(':usuario_imagen', $usuario_imagen);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo "Usuario creado exitosamente.";
} else {
    echo "Error al crear el usuario.";
}
?>