<?php
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

$item_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($item_id === 0) {
    echo "Invalid item ID.";
    exit;
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $item_name = trim($_POST['item_name']);
    $description = trim($_POST['description']);
    $date_found = $_POST['date_found'];

    $stmt = $conn->prepare("UPDATE found_items SET item_name = ?, description = ?, date_found = ? WHERE id = ?");
    $stmt->bind_param("sssi", $item_name, $description, $date_found, $item_id);

    if ($stmt->execute()) {
        header("Location: manage_found_items.php?msg=updated");
        exit;
    } else {
        echo "Failed to update found item.";
    }
}

// Fetch item data
$stmt = $conn->prepare("SELECT item_name, description, date_found FROM found_items WHERE id = ?");
$stmt->bind_param("i", $item_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    echo "Item not found.";
    exit;
}

$item = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Found Item</title>
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
        <a href="manage_found_items.php" class="active">Manage Found Items</a>
        <a href="view_matches.php">View Matches</a>
        <a href="manage_users.php">Manage Users</a>
        <a href="logout.php">Logout</a>
      </div>
    </div>
  </header>

  <main class="dashboard">
    <h2>Edit Found Item</h2>
    <form method="post" action="">
      <label for="item_name">Item Name:</label>
      <input type="text" name="item_name" id="item_name" value="<?= htmlspecialchars($item['item_name']) ?>" required><br><br>

      <label for="description">Description:</label>
      <textarea name="description" id="description" required><?= htmlspecialchars($item['description']) ?></textarea><br><br>

      <label for="date_found">Date Found:</label>
      <input type="date" name="date_found" id="date_found" value="<?= htmlspecialchars($item['date_found']) ?>" required><br><br>

      <button type="submit">Update</button>
    </form>
  </main>
</body>
</html>
