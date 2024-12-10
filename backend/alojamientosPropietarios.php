<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
require 'dbConection.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        obtenerAlojamientos();
        break;

    case 'POST':
        agregarAlojamiento();
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

// Función para obtener alojamientos
function obtenerAlojamientos()
{
    global $pdo;

    try {
        $stmt = $pdo->query("SELECT * FROM homeAwayDB.Alojamiento");
        $alojamientos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($alojamientos);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener los alojamientos: ' . $e->getMessage()]);
    }
}

// Función para agregar alojamiento
function agregarAlojamiento()
{
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id_usuario']) || empty($data['id_usuario'])) {
        http_response_code(400);
        echo json_encode(['error' => 'El ID del usuario es requerido.']);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO homeAwayDB.Alojamiento (id_usuario, nombre, descripcion, tipo_alojamiento, num_habitaciones, num_banos, capacidad, precio_noche, ubicacion, calificacion, disponibilidad, alojamiento_imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $data['id_usuario'],
            $data['nombre'],
            $data['descripcion'],
            $data['alojamientoTipo'],
            $data['numHabitaciones'],
            $data['numBanos'],
            $data['capacidad'],
            $data['precioNoche'],
            $data['ubicacion'],
            $data['calificacion'],
            isset($data['activo']) ? 1 : 0,
            $data['imagenUrl']
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al agregar alojamiento: ' . $e->getMessage()]);
    }
}
