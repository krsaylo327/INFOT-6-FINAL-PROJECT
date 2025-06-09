<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

include('db_connection.php'); // make sure this connects to your DB

$user_id = $_SESSION['user_id'];

// Count lost items
$lostQuery = $conn->prepare("SELECT COUNT(*) FROM lost_items WHERE user_id = ?");
$lostQuery->bind_param("i", $user_id);
$lostQuery->execute();
$lostQuery->bind_result($lostCount);
$lostQuery->fetch();
$lostQuery->close();

// Count found items
$foundQuery = $conn->prepare("SELECT COUNT(*) FROM found_items WHERE user_id = ?");
$foundQuery->bind_param("i", $user_id);
$foundQuery->execute();
$foundQuery->bind_result($foundCount);
$foundQuery->fetch();
$foundQuery->close();

// Count matched items related to this user
$matchQuery = $conn->prepare("
  SELECT COUNT(*) 
  FROM matches 
  WHERE lost_item_id IN (SELECT id FROM lost_items WHERE user_id = ?) 
     OR found_item_id IN (SELECT id FROM found_items WHERE user_id = ?)
");
$matchQuery->bind_param("ii", $user_id, $user_id);
$matchQuery->execute();
$matchQuery->bind_result($matchCount);
$matchQuery->fetch();
$matchQuery->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <div class="navbar">
      <a href="dashboard.php" class="logo" ><img src="assets/ualogo.jpg" alt="ualogo" class="ualogo">UA: Lost and Found</a>
      <div class="nav-links">
        <a href="dashboard.php">Dashboard</a>
        <a href="report_lost_item.php">Report Lost Item</a>
        <a href="report_found_item.php">Report Found Item</a>
        <a href="view_reports.php">View Reports</a>
        <a href="logout.php">Logout</a>
      </div>
    </div>
  </header>

  <main class="dashboard">
    <section class="welcome-box">
      <h1>Welcome, <?php echo htmlspecialchars($_SESSION['first_name']); ?>!</h1>
      <p>Your role: <strong><?php echo htmlspecialchars($_SESSION['role']); ?></strong></p>
    </section>

    <section class="dashboard-cards">
      <div class="card">
        <h3>Lost Items Reported</h3>
        <p><?php echo $lostCount; ?></p> <!-- for lost items -->
      </div>
      <div class="card">
        <h3>Found Items</h3>
        <p><?php echo $foundCount; ?></p> <!-- for found items -->
      </div>
      <div class="card">
        <h3>Matches</h3>
        <p><?php echo $matchCount; ?></p> <!-- for matches -->
      </div>
    </section>
  </main>
</body>
</html>