<?php
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

// Get user ID from URL
if (isset($_GET['id'])) {
    $user_id = intval($_GET['id']);

    // Protect against deleting your own account
    if ($_SESSION['user_id'] == $user_id) {
        echo "<script>alert('You cannot delete your own account.'); window.location.href='manage_users.php';</script>";
        exit;
    }

    // Perform deletion
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        header("Location: manage_users.php?msg=deleted");
    } else {
        echo "<script>alert('Error deleting user.'); window.location.href='manage_users.php';</script>";
    }

    $stmt->close();
} else {
    header("Location: manage_users.php");
}
$conn->close();
?>
