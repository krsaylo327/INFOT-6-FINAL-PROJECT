<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

// Fetch all users
$result = $conn->query("SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Manage Users</title>
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
        <a href="manage_lost_items.php">Manage Lost Items</a>
        <a href="manage_found_items.php">Manage Found Items</a>
        <a href="view_matches.php">View Matches</a>
        <a href="manage_users.php" class="active">Manage Users</a>
        <a href="logout.php">Logout</a>
      </div>
    </div>
  </header>

  <main class="dashboard">
    <h2>Manage Users</h2>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #d32727; color: white;">
          <th style="padding: 10px;">ID</th>
          <th style="padding: 10px;">First Name</th>
          <th style="padding: 10px;">Last Name</th>
          <th style="padding: 10px;">Email</th>
          <th style="padding: 10px;">Role</th>
          <th style="padding: 10px;">Created At</th>
          <th style="padding: 10px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php if ($result->num_rows > 0): ?>
          <?php while($row = $result->fetch_assoc()): ?>
            <tr style="border-bottom: 1px solid #ccc;">
              <td style="padding: 10px;"><?php echo $row['id']; ?></td>
              <td style="padding: 10px;"><?php echo htmlspecialchars($row['first_name']); ?></td>
              <td style="padding: 10px;"><?php echo htmlspecialchars($row['last_name']); ?></td>
              <td style="padding: 10px;"><?php echo htmlspecialchars($row['email']); ?></td>
              <td style="padding: 10px;"><?php echo htmlspecialchars($row['role']); ?></td>
              <td style="padding: 10px;"><?php echo htmlspecialchars($row['created_at']); ?></td>
              <td style="padding: 10px;">
                <a href="edit_users.php?id=<?php echo $row['id']; ?>" title="Edit" style="color: #1e40af; margin-right: 12px;">
                  <i class="fas fa-edit"></i> Edit
                </a>
                <a href="delete_users.php?id=<?php echo $row['id']; ?>" title="Delete" style="color: #dc2626;" onclick="return confirm('Are you sure you want to delete this user?');">
                  <i class="fas fa-trash-alt"></i> Delete
                </a>
              </td>
            </tr>
          <?php endwhile; ?>
        <?php else: ?>
          <tr><td colspan="7" style="padding: 10px; text-align:center;">No users found.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </main>
</body>
</html>
