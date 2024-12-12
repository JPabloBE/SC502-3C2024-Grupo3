<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'dbConection.php';

try {
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->id_usuario) || empty($data->nombre) || empty($data->username) || empty($data->email) || empty($data->telefono)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        exit();
    }

    $stmt = $pdo->prepare("
    UPDATE homeAwayDB.Usuario 
    SET nombre = :nombre, username = :username, email = :email, telefono = :telefono 
    WHERE id_usuario = :id_usuario
    ");
    
    $stmt->bindParam(':nombre', $data->nombre);
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':telefono', $data->telefono);
    $stmt->bindParam(':id_usuario', $data->id_usuario);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Perfil actualizado con éxito']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el perfil']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
}

