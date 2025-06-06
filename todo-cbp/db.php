<?php
$dsn = "mysql:host=127.0.0.1;dbname=todo";
$db_username = "root";
$db_password = "";

try {
    $pdo = new PDO($dsn, $db_username, $db_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(e) {
    echo "ERROR:".e->getMessage();
}
?>