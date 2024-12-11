<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require 'dbConection.php';

try {
    $data = $_POST; // Obtener datos del formulario

    $nombre = trim($data['nombre']);
    $username = trim($data['username']);
    $email = trim($data['email']);
    $password = trim($data['contrasena']);
    $telefono = trim($data['telefono']);
    $rol = trim($data['rol']);
    $usuario_imagen = !empty($data['usuario_imagen']) ? trim($data['usuario_imagen']) : null; // Imagen opcional
    
    if (empty($nombre) || empty($username) || empty($email) || empty($password) || empty($rol)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        exit();
    }

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
    
    // Si no se proporciona una imagen, se puede establecer como NULL
    if ($usuario_imagen) {
        $stmt->bindParam(':usuario_imagen', $usuario_imagen);
    } else {
        // Usar NULL si no hay imagen
        $nullValue = null;
        $stmt->bindParam(':usuario_imagen', $nullValue, PDO::PARAM_NULL);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuario creado exitosamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear el usuario.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>