<?php
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

include('db_connection.php');

// Check if match was successful
$matchSuccess = isset($_GET['match']) && $_GET['match'] === 'success';

// Query matches
$sql = "
    SELECT 
        m.id,
        m.similarity_score,
        m.created_at,
        l.item_name AS lost_item_name,
        l.category AS lost_item_category,
        f.item_name AS found_item_name,
        f.category AS found_item_category
    FROM matches m
    JOIN lost_items l ON m.lost_item_id = l.id
    JOIN found_items f ON m.found_item_id = f.id
    ORDER BY m.created_at DESC
";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>View Matches - Admin Dashboard</title>
  <link rel="stylesheet" href="style.css" />
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
      <a href="manage_users.php">Manage Users</a>
      <a href="logout.php">Logout</a>
    </div>
  </div>
</header>

<div class="dashboard" style="padding: 20px;">
  <h2>Matched Lost and Found Items</h2>

  <?php if ($matchSuccess): ?>
    <div style="color: green; font-weight: bold; margin-bottom: 20px;">
      Matching completed successfully!
    </div>
  <?php endif; ?>

  <a href="match_items.php" 
     style="display:inline-block; margin-bottom: 20px; padding: 10px 20px; background:#d32727; color:#fff; text-decoration:none; border-radius:4px;"
     onclick="return confirm('Are you sure you want to run the matching algorithm? This will overwrite previous matches.')">
     Run Match
  </a>

  <?php if ($result && $result->num_rows > 0): ?>
    <table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">
      <thead>
        <tr style="background:#d32727; color:#fff;">
          <th>ID</th>
          <th>Lost Item</th>
          <th>Lost Category</th>
          <th>Found Item</th>
          <th>Found Category</th>
          <th>Similarity Score (%)</th>
          <th>Date Matched</th>
        </tr>
      </thead>
      <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
          <tr>
            <td><?= htmlspecialchars($row['id']) ?></td>
            <td><?= htmlspecialchars($row['lost_item_name']) ?></td>
            <td><?= htmlspecialchars($row['lost_item_category']) ?></td>
            <td><?= htmlspecialchars($row['found_item_name']) ?></td>
            <td><?= htmlspecialchars($row['found_item_category']) ?></td>
            <td><?= number_format($row['similarity_score'], 2) ?></td>
            <td><?= htmlspecialchars($row['created_at']) ?></td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  <?php else: ?>
    <p>No matches found.</p>
  <?php endif; ?>
</div>

</body>
</html>

<?php $conn->close(); ?>
