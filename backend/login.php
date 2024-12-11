<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require 'dbConection.php';
session_start();

try {
    // Obtener los datos enviados en el cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"));
    $username = trim($data->username);
    $password = $data->password;

    // Verificar si los datos han sido enviados correctamente
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son requeridos']);
        exit();
    }

    // Consulta para obtener los datos del usuario
    $stmt = $pdo->prepare("
    SELECT id_usuario, rol, nombre, username, email, telefono, usuario_imagen, contrasena 
    FROM homeAwayDB.Usuario 
    WHERE username = :username
");
    $stmt->bindParam(':username', $username);

    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Error al ejecutar la consulta.']);
        exit();
    }

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($password, $usuario['contrasena'])) {
        // Guardar datos del usuario en la sesión
        $_SESSION['user'] = [
            'id_usuario' => $usuario['id_usuario'],
            'rol' => $usuario['rol'],
            'nombre' => $usuario['nombre'],
            'username' => $usuario['username'],
            'email' => $usuario['email'],
            'telefono' => $usuario['telefono'],
            'usuario_imagen' => $usuario['usuario_imagen']
        ];

        // Enviar datos del usuario al front-end
        echo json_encode([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'user' => $_SESSION['user']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    }
} catch (Exception $e) {
    // Manejo de errores
    http_response_code(500);
    error_log("Error en login: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
}
?>