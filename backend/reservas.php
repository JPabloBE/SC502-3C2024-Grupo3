<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'dbConection.php';
header('Content-Type: application/json');

session_start();

try {
    global $pdo;

    // Verificar si el usuario está logueado
    $user = isset($_SESSION['user']) ? $_SESSION['user'] : null;

    // Realiza la consulta para obtener los alojamientos
    $stmt = $pdo->query("SELECT 
            id_alojamiento,
            nombre AS alojamiento_nombre, 
            descripcion, 
            precio_noche, 
            alojamiento_imagen 
        FROM homeAwayDB.Alojamiento");
    $alojamientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve los resultados como JSON incluyendo datos del usuario logueado
    echo json_encode([
        'user' => $user,
        'alojamientos' => $alojamientos
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener los alojamientos']);
}
?>