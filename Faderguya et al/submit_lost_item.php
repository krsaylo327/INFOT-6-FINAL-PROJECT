<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['user_id'];
    $itemName = $_POST['item_name'];
    $category = $_POST['category'];
    $description = $_POST['description'];
    // Remove $reported_by from POST, use session user id if needed
    // $reported_by = $_POST['reported_by'];
    $location = $_POST['location_lost'];
    $dateLost = $_POST['date_lost'];

    // Handle file upload
    $photoPath = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $photoName = time() . '_' . basename($_FILES['photo']['name']);
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $targetPath = $uploadDir . $photoName;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetPath)) {
            $photoPath = $targetPath;
        }
    }

    // Prepare statement with correct placeholders (7 columns, 7 ?)
    $stmt = $conn->prepare("INSERT INTO lost_items (user_id, item_name, category, description, location_lost, date_lost, photo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Bind 7 params: i = integer, s = string
    $stmt->bind_param("issssss", $userId, $itemName, $category, $description, $location, $dateLost, $photoPath);
    
    if ($stmt->execute()) {
        header("Location: dashboard.php?report=success");
        exit;
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
