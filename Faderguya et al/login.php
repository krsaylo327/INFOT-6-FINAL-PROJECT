<?php
session_start();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include('db_connection.php');

    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        $error = "Please fill in both fields.";
    } else {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['first_name'] = $user['first_name'];
                $_SESSION['role'] = $user['role'];

                // ===== ADD THIS ADMIN REDIRECTION =====
                if ($user['role'] === 'admin') {
                    header('Location: admin_dashboard.php'); // redirect admin to admin dashboard
                } else {
                    header('Location: dashboard.php'); // regular user
                }
                exit;
                // ===== END ADMIN REDIRECTION =====

            } else {
                $error = "Incorrect email or password. Try again.";
            }
        } else {
            $error = "Incorrect email or password. Try again.";
        }

        $stmt->close();
        $conn->close();
    }
}
?>

<!-- Your existing HTML below unchanged -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>
  <header>
    <div class="navbar">
      <a href="index.php" class="logo" ><img src="assets/ualogo.jpg" alt="ualogo" class="ualogo">UA: Lost and Found</a>
      <div class="nav-links">
        <a href="index.php">Home</a>
        <a href="login.php">Login</a>
        <a href="register.php">Register</a>
      </div>
    </div>
  </header>

  <main class="form-center">
    <div class="form-box">
      <h2>Login</h2>

      <?php if ($error): ?>
        <div class="error-box" id="errorBox">
          <i class="fa-solid fa-circle-exclamation"></i>
          <?php echo htmlspecialchars($error); ?>
        </div>
      <?php endif; ?>

      <form action="login.php" method="POST" id="loginForm">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" 
            class="<?php echo $error ? 'error' : ''; ?>"
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <div class="password-wrapper">
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              class="<?php echo $error ? 'error' : ''; ?>"
            />
            <i id="togglePassword" class="fa-solid fa-eye toggle-password"></i>
          </div>
        </div>

        <div class="form-group full-width">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  </main>

  <script src="script.js"></script>
</body>
</html>