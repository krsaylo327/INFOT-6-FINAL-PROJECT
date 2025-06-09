<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

include('db_connection.php');

$user_id = $_SESSION['user_id'];

// Fetch Lost Items
$lostQuery = $conn->prepare("SELECT * FROM lost_items WHERE user_id = ? ORDER BY created_at DESC");
$lostQuery->bind_param("i", $user_id);
$lostQuery->execute();
$lostResult = $lostQuery->get_result();

// Fetch Found Items
$foundQuery = $conn->prepare("SELECT * FROM found_items WHERE user_id = ? ORDER BY created_at DESC");
$foundQuery->bind_param("i", $user_id);
$foundQuery->execute();
$foundResult = $foundQuery->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Reports</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
<header>
  <div class="navbar">
    <a href="dashboard.php" class="logo">University of Antique Lost and Found System</a>
    <div class="nav-links">
      <a href="dashboard.php">Dashboard</a>
      <a href="report_lost_item.php">Report Lost Item</a>
      <a href="report_found_item.php">Report Found Item</a>
      <a href="view_reports.php">View Reports</a>
      <a href="logout.php">Logout</a>
    </div>
  </div>
</header>

<main class="report-container">
  <h2>My Reported Items</h2>

  <section>
    <h3>Lost Items</h3>
    <?php if ($lostResult->num_rows > 0): ?>
      <div class="item-grid">
        <?php while ($row = $lostResult->fetch_assoc()): ?>
          <div class="report-card">
            <?php if ($row['photo']): ?>
              <img src="uploads/lost/<?php echo htmlspecialchars($row['photo']); ?>" alt="Item Photo" />
            <?php endif; ?>
            <h4><?php echo htmlspecialchars($row['item_name']); ?></h4>
            <p><strong>Category:</strong> <?php echo htmlspecialchars($row['category']); ?></p>
            <p><strong>Description:</strong> <?php echo htmlspecialchars($row['description']); ?></p>
            <p><strong>Date Lost:</strong> <?php echo htmlspecialchars($row['date_lost']); ?></p>
            <p><strong>Location:</strong> <?php echo htmlspecialchars($row['location_lost']); ?></p>
          </div>
        <?php endwhile; ?>
      </div>
    <?php else: ?>
      <p>No lost items reported yet.</p>
    <?php endif; ?>
  </section>

  <section>
    <h3>Found Items</h3>
    <?php if ($foundResult->num_rows > 0): ?>
      <div class="item-grid">
        <?php while ($row = $foundResult->fetch_assoc()): ?>
          <div class="report-card">
            <?php if ($row['photo']): ?>
              <img src="uploads/found/<?php echo htmlspecialchars($row['photo']); ?>" alt="Item Photo" />
            <?php endif; ?>
            <h4><?php echo htmlspecialchars($row['item_name']); ?></h4>
            <p><strong>Category:</strong> <?php echo htmlspecialchars($row['category']); ?></p>
            <p><strong>Description:</strong> <?php echo htmlspecialchars($row['description']); ?></p>
            <p><strong>Date Found:</strong> <?php echo htmlspecialchars($row['date_found']); ?></p>
            <p><strong>Location:</strong> <?php echo htmlspecialchars($row['location_found']); ?></p>
          </div>
        <?php endwhile; ?>
      </div>
    <?php else: ?>
      <p>No found items reported yet.</p>
    <?php endif; ?>
  </section>
</main>
</body>
</html>