<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Report Lost Item</title>
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

  <main class="form-center">
    <div class="form-box">
      <h2>Report Lost Item</h2>
      <form action="submit_lost_item.php" method="POST" enctype="multipart/form-data">
        <div class="form-group">
          <label for="item_name">Item Name:</label>
          <input type="text" id="item_name" name="item_name" required />
        </div>

        <div class="form-group">
          <label for="category">Category:</label>
          <select id="category" name="category" required>
            <option value="">-- Select Category --</option>
            <option value="Electronics">Electronics</option>
            <option value="Bag">Bag</option>
            <option value="Clothing">Clothing</option>
            <option value="Documents">Documents</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" name="description" rows="3" required></textarea>
        </div>

        <div class="form-group">
          <label for="location_lost">Location Lost:</label>
          <input type="text" id="location_lost" name="location_lost" required />
        </div>

        <div class="form-group">
          <label for="date_lost">Date Lost:</label>
          <input type="date" id="date_lost" name="date_lost" required />
        </div>

        <div class="form-group">
          <label for="photo">Upload Photo (optional):</label>
          <input type="file" id="photo" name="photo" accept="image/*" />
        </div>

        <div class="form-group full-width">
          <button type="submit">Submit Report</button>
        </div>
      </form>
    </div>
  </main>
</body>
</html>