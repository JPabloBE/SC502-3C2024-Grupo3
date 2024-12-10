<?php
function logError($message){
    error_log("[ERROR] " . $message);
}

function logDebug($message){
    error_log("[DEBUG] ". $message);
}