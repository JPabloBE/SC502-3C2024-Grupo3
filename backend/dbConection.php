<?php
require "message_log.php";
// Datos de conexión obtenidos del enlace
$host = 'autorack.proxy.rlwy.net'; // Host del servidor MySQL
$port = '12503';                   // Puerto
$dbname = 'railway';               // Nombre de la base de datos (corrige aquí si es diferente)
$user = 'root';                    // Usuario de la base de datos
$password = 'KEPQMjcjOTBcroMikBskUdxPfFUklJMv'; // Contraseña de la base de datos
try {
    // Crear la conexión PDO con los datos proporcionados
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    logDebug("DB: Conexion Exitosa");
} catch (PDOException $e) {
    logError($e->getMessage());
    die("Error de conexion: " . $e->getMessage());
}
?>