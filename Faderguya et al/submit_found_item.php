<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id']; // use session user id as reporter
    $item_name = trim($_POST['item_name']);
    $category = trim($_POST['category']);
    $description = trim($_POST['description']);
    $location_found = trim($_POST['location_found']);
    $date_found = $_POST['date_found'];
    
    if (empty($item_name) || empty($location_found) || empty($date_found)) {
        $error = "Please fill in all required fields.";
    } else {
        $photo_path = null;
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['photo']['tmp_name'];
            $fileName = $_FILES['photo']['name'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            
            $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
            
            if (in_array($fileExtension, $allowedExts)) {
                $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
                $uploadFileDir = './uploads/';
                if (!is_dir($uploadFileDir)) {
                    mkdir($uploadFileDir, 0755, true);
                }
                $dest_path = $uploadFileDir . $newFileName;
                if (move_uploaded_file($fileTmpPath, $dest_path)) {
                    $photo_path = $dest_path;
                } else {
                    $error = "Error uploading the photo.";
                }
            } else {
                $error = "Invalid file type. Allowed: " . implode(', ', $allowedExts);
            }
        }

        if (!$error) {
            // Fix SQL - remove reported_by (already have user_id)
            $stmt = $conn->prepare("INSERT INTO found_items (user_id, item_name, category, description, location_found, date_found, photo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
            
            // bind_param types: i = integer, s = string
            // user_id (int), item_name (string), category (string), description (string), location_found (string), date_found (string), photo (string or NULL)
            $stmt->bind_param("issssss", $user_id, $item_name, $category, $description, $location_found, $date_found, $photo_path);

            if ($stmt->execute()) {
                header("Location: dashboard.php?msg=found_item_reported");
                exit;
            } else {
                $error = "Database error: Unable to save report.";
            }

            $stmt->close();
        }
    }
}

$conn->close();

if ($error) {
    echo "<p style='color:red;'>$error</p>";
    echo "<a href='found_item_report.php'>Go back</a>";
}
?>
