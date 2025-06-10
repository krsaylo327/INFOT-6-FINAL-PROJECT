<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

// Get stats
$totalLost = $conn->query("SELECT COUNT(*) as total FROM lost_items")->fetch_assoc()['total'];
$totalFound = $conn->query("SELECT COUNT(*) as total FROM found_items")->fetch_assoc()['total'];
$totalMatches = $conn->query("SELECT COUNT(*) as total FROM matches")->fetch_assoc()['total'];
$totalUsers = $conn->query("SELECT COUNT(*) as total FROM users")->fetch_assoc()['total'];

$adminName = $_SESSION['first_name'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Admin Dashboard - Lost and Found System</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>
  <header>
    <div class="navbar">
      <a href="#" class="logo">
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
    <div class="welcome-box">
      <h2>Welcome, <?php echo htmlspecialchars($adminName); ?>!</h2>
      <p>Here’s an overview of your Lost and Found system.</p>
    </div>

    <div class="dashboard-cards">
      <div class="card">
        <h3>Lost Items</h3>
        <p><?php echo $totalLost; ?></p>
      </div>

      <div class="card">
        <h3>Found Items</h3>
        <p><?php echo $totalFound; ?></p>
      </div>

      <div class="card">
        <h3>Matches</h3>
        <p><?php echo $totalMatches; ?></p>
      </div>

      <div class="card">
        <h3>Registered Users</h3>
        <p><?php echo $totalUsers; ?></p>
      </div>
    </div>
  </main>
</body>
</html>