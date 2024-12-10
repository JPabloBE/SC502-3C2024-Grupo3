<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'dbConection.php';
header('Content-Type: application/json');

try {
    global $pdo;

    // Realiza la consulta para obtener los alojamientos
    $stmt = $pdo->query("SELECT 
            id_alojamiento,
            nombre AS alojamiento_nombre, 
            descripcion, 
            precio_noche, 
            alojamiento_imagen 
        FROM homeAwayDB.Alojamiento");
    $alojamientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($alojamientos); // Devuelve los resultados como JSON
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener los alojamientos']);
}
?>

