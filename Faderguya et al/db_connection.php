<?php

$servername = "localhost"; // Database server
$username = "root";        // Default MySQL username
$password = "";            // Default MySQL password
$dbname = "lost_and_found_db"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
