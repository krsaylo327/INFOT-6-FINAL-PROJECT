<?php
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

$user_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($user_id === 0) {
    echo "Invalid user ID.";
    exit;
}

// Handle update form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name']);
    $role = $_POST['role'];

    // Split name into first and last
    $parts = explode(' ', $name, 2);
    $first_name = $parts[0];
    $last_name = isset($parts[1]) ? $parts[1] : '';

    $stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, role = ? WHERE id = ?");
    $stmt->bind_param("sssi", $first_name, $last_name, $role, $user_id);

    if ($stmt->execute()) {
        header("Location: manage_users.php?msg=updated");
        exit;
    } else {
        echo "Failed to update user.";
    }
}

// Fetch user data
$stmt = $conn->prepare("SELECT first_name, last_name, role FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    echo "User not found.";
    exit;
}

$user = $result->fetch_assoc();
$name = $user['first_name'] . ' ' . $user['last_name'];
$role = $user['role'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit User</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="edit-user-page">
    <header>
    <div class="navbar">
      <a href="admin_dashboard.php" class="logo">
        <img src="assets/ualogo.jpg" alt="ualogo" class="ualogo" />
        UA: Lost and Found (Admin)
      </a>
      <div class="nav-links">
        <a href="admin_dashboard.php">Dashboard</a>
        <a href="manage_lost_items.php">Manage Lost Items</a>
        <a href="manage_found_items.php">Manage Found Items</a>
        <a href="view_matches.php">View Matches</a>
        <a href="manage_users.php">Manage Users</a>
        <a href="logout.php">Logout</a>
      </div>
    </div>
  </header>
  
    <main class="dashboard">
        <h2>Edit User</h2>
        <form method="post" action="">
            <label for="name">Name:</label>
            <input type="text" name="name" value="<?= htmlspecialchars($name) ?>" required><br><br>

            <label for="role">Role:</label>
            <select name="role" required>
                <option value="user" <?= $role === 'user' ? 'selected' : '' ?>>User</option>
                <option value="admin" <?= $role === 'admin' ? 'selected' : '' ?>>Admin</option>
            </select><br><br>

            <button type="submit">Update</button>
        </form>
    </main>
</body>
</html>
