<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'dbConection.php'; // Este archivo debe estar configurado correctamente para homeAwayDB
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['alojamientoId'], $data['userId'], $data['fecha'], $data['noches'], $data['personas'])) {
        throw new Exception('Datos incompletos.');
    }

    $alojamientoId = $data['alojamientoId'];
    $userId = $data['userId'];
    $fecha = $data['fecha'];
    $noches = $data['noches'];
    $personas = $data['personas'];

    // Conexión a la base de datos
    global $pdo;

    // Verificar disponibilidad
    $stmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM Reservas 
        WHERE id_alojamiento = ? 
        AND fecha_inicio <= DATE_ADD(?, INTERVAL ? DAY) 
        AND DATE_ADD(fecha_inicio, INTERVAL noches DAY) >= ?
    ");
    $stmt->execute([$alojamientoId, $fecha, $noches, $fecha]);

    if ($stmt->fetchColumn() > 0) {
        throw new Exception('El alojamiento no está disponible en las fechas seleccionadas.');
    }

    // Insertar la reserva
    $stmt = $pdo->prepare("
        INSERT INTO Reservas (id_usuario, id_alojamiento, fecha_inicio, noches, personas) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$userId, $alojamientoId, $fecha, $noches, $personas]);

    echo json_encode(['success' => 'Reserva creada correctamente.']);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
