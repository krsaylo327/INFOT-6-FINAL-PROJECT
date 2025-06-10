<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

// Fetch lost items with reporter's full name
$sql = "SELECT lost_items.*, CONCAT(users.first_name, ' ', users.last_name) AS reporter_name 
        FROM lost_items 
        LEFT JOIN users ON lost_items.user_id = users.id 
        ORDER BY lost_items.created_at DESC";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Manage Lost Items</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>
  <header>
    <div class="navbar">
      <a href="admin_dashboard.php" class="logo">
        <img src="assets/ualogo.jpg" alt="ualogo" class="ualogo" />
        UA: Lost and Found (Admin)
      </a>
      <div class="nav-links">
        <a href="admin_dashboard.php">Dashboard</a>
        <a href="manage_lost_items.php" class="active">Manage Lost Items</a>
        <a href="manage_found_items.php">Manage Found Items</a>
        <a href="view_matches.php">View Matches</a>
        <a href="manage_users.php">Manage Users</a>
        <a href="logout.php">Logout</a>
      </div>
    </div>
  </header>

  <main class="dashboard">
    <h2>Manage Lost Items</h2>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #d32727; color: white;">
          <th style="padding: 10px; text-align: left;">ID</th>
          <th style="padding: 10px; text-align: left;">Item Name</th>
          <th style="padding: 10px; text-align: left;">Description</th>
          <th style="padding: 10px; text-align: left;">Date Reported</th>
          <th style="padding: 10px; text-align: left;">Reported By</th>
          <th style="padding: 10px; text-align: left;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php while($row = $result->fetch_assoc()): ?>
          <tr style="border-bottom: 1px solid #ccc;">
            <td style="padding: 10px;"><?php echo $row['id']; ?></td>
            <td style="padding: 10px;"><?php echo htmlspecialchars($row['item_name']); ?></td>
            <td style="padding: 10px;"><?php echo htmlspecialchars($row['description']); ?></td>
            <td style="padding: 10px;"><?php echo htmlspecialchars($row['created_at']); ?></td>
            <td style="padding: 10px;"><?php echo htmlspecialchars($row['reporter_name'] ?? 'Unknown'); ?></td>
            <td style="padding: 10px;">
              <a href="edit_lost_item.php?id=<?php echo $row['id']; ?>" title="Edit" style="color: #1e40af; margin-right: 12px;">
                <i class="fas fa-edit"></i> Edit
              </a>
              <a href="delete_lost_item.php?id=<?php echo $row['id']; ?>" title="Delete" style="color: #dc2626;" onclick="return confirm('Are you sure you want to delete this item?');">
                <i class="fas fa-trash-alt"></i> Delete
              </a>
            </td>
          </tr>
        <?php endwhile; ?>
        <?php if ($result->num_rows == 0): ?>
          <tr><td colspan="6" style="padding: 10px; text-align:center;">No lost items found.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </main>
</body>
</html>
