<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'dbConection.php';
header('Content-Type: application/json');

try {
    global $pdo;

    // Inicializa los parámetros con valores predeterminados o vacíos
    $ubicacion = isset($_POST['ubicacion']) ? $_POST['ubicacion'] : '';
    $precioInf = isset($_POST['precioInf']) && $_POST['precioInf'] !== '' ? $_POST['precioInf'] : 0;
    $precioSup = isset($_POST['precioSup']) && $_POST['precioSup'] !== '' ? $_POST['precioSup'] : PHP_INT_MAX;
    $capacidad = isset($_POST['capacidad']) && $_POST['capacidad'] !== '' ? $_POST['capacidad'] : 0;

    // Comienza la consulta base
    $query = "SELECT 
                a.id_usuario AS anfitrion_id,
                a.nombre AS alojamiento_nombre, 
                a.descripcion, 
                a.precio_noche, 
                a.alojamiento_imagen, 
                a.ubicacion,
                u.nombre AS anfitrion_nombre,
                u.usuario_imagen AS anfitrion_imagen
              FROM homeAwayDB.Alojamiento a
              LEFT JOIN homeAwayDB.Usuario u ON a.id_usuario = u.id_usuario
              WHERE 1"; // La condición 1 siempre es verdadera y nos permite añadir filtros dinámicamente

    // Arreglo de parámetros
    $params = [];

    // Agregar filtros dinámicamente si existen
    if ($ubicacion !== '') {
        $query .= " AND a.ubicacion LIKE :ubicacion";
        $params[':ubicacion'] = '%' . $ubicacion . '%';
    }
    
    if ($precioInf !== 0) {
        $query .= " AND a.precio_noche >= :precioInf";
        $params[':precioInf'] = $precioInf;
    }

    if ($precioSup !== PHP_INT_MAX) {
        $query .= " AND a.precio_noche <= :precioSup";
        $params[':precioSup'] = $precioSup;
    }

    if ($capacidad !== 0) {
        $query .= " AND a.capacidad >= :capacidad";
        $params[':capacidad'] = $capacidad;
    }

    // Prepara la consulta
    $stmt = $pdo->prepare($query);
    
    // Vincula los parámetros dinámicos
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    // Ejecuta la consulta
    $stmt->execute();
    
    // Obtiene los resultados
    $alojamientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($alojamientos); // Devuelve los resultados como JSON
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener los alojamientos']);
}
?>
