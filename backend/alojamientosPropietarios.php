<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
require 'dbConection.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id_alojamiento'])) {
            obtenerAlojamientoPorId($_GET['id_alojamiento']);
        } else {
            obtenerAlojamientos();
        }
        break;

    case 'POST':
        agregarAlojamiento();
        break;

    case 'PUT':
        actualizarAlojamiento();
        break;

    case 'DELETE':
        eliminarAlojamiento();
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

// Función para obtener alojamientos
function obtenerAlojamientos()
{
    global $pdo;

    // Verificar si se recibió un id_usuario en la solicitud
    if (isset($_GET['id_usuario'])) {
        $id_usuario = $_GET['id_usuario'];
        try {
            // Modificar la consulta SQL para filtrar por el id_usuario
            $stmt = $pdo->prepare("SELECT * FROM homeAwayDB.Alojamiento WHERE id_usuario = ?");
            $stmt->execute([$id_usuario]);
            $alojamientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Devolver los alojamientos correspondientes al usuario
            echo json_encode($alojamientos);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener los alojamientos: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'El ID de usuario es requerido.']);
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

// Función para eliminar alojamiento
function eliminarAlojamiento()
{
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id_alojamiento']) || empty($data['id_alojamiento'])) {
        http_response_code(400);
        echo json_encode(['error' => 'El ID del alojamiento es requerido.']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM homeAwayDB.Alojamiento WHERE id_alojamiento = ?");
        $stmt->execute([$data['id_alojamiento']]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Alojamiento eliminado exitosamente.']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Alojamiento no encontrado.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar alojamiento: ' . $e->getMessage()]);
    }
}

// Función para obtener un solo alojamiento por ID
function obtenerAlojamientoPorId($id)
{
    global $pdo;

    try {
        $stmt = $pdo->prepare("SELECT * FROM homeAwayDB.Alojamiento WHERE id_alojamiento = ?");
        $stmt->execute([$id]);
        $alojamiento = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($alojamiento) {
            echo json_encode($alojamiento);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Alojamiento no encontrado.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener el alojamiento: ' . $e->getMessage()]);
    }
}

function actualizarAlojamiento()
{
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id_alojamiento']) || empty($data['id_alojamiento'])) {
        http_response_code(400);
        echo json_encode(['error' => 'El ID del alojamiento es requerido.']);
        return;
    }

    try {
        // Obtener el alojamiento actual para mantener la imagen si no se proporciona una nueva
        $stmt = $pdo->prepare("SELECT alojamiento_imagen FROM homeAwayDB.Alojamiento WHERE id_alojamiento = ?");
        $stmt->execute([$data['id_alojamiento']]);
        $alojamientoActual = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si no se proporciona una nueva imagen, usar la existente
        $imagenUrl = !empty($data['imagenUrl']) ? $data['imagenUrl'] : $alojamientoActual['alojamiento_imagen'];

        // Actualizar los campos del alojamiento
        $stmt = $pdo->prepare("UPDATE homeAwayDB.Alojamiento SET nombre=?, descripcion=?, tipo_alojamiento=?, num_habitaciones=?, num_banos=?, capacidad=?, precio_noche=?, ubicacion=?, calificacion=?, disponibilidad=?, alojamiento_imagen=? WHERE id_alojamiento=?");

        $stmt->execute([
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
            $imagenUrl,
            $data['id_alojamiento']
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar alojamiento: ' . $e->getMessage()]);
    }
}