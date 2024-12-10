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
            a.id_usuario AS anfitrion_id,
            a.nombre AS alojamiento_nombre, 
            a.descripcion, 
            a.precio_noche, 
            a.alojamiento_imagen, 
            a.ubicacion,
            u.nombre AS anfitrion_nombre,
            u.usuario_imagen AS anfitrion_imagen
        FROM homeAwayDB.Alojamiento a
        LEFT JOIN homeAwayDB.Usuario u
        ON a.id_usuario = u.id_usuario");
    $alojamientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($alojamientos); // Devuelve los resultados como JSON
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener los alojamientos php']);
}
