<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Register</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
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
      <h2>Register</h2>
      <br>
      <form action="register_action.php" method="POST">
        <div class="form-group">
          <label for="firstname">First Name:</label>
          <input type="text" id="firstname" name="firstname" required />
        </div>

        <div class="form-group">
          <label for="lastname">Last Name:</label>
          <input type="text" id="lastname" name="lastname" required />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <div class="password-wrapper">
            <input type="password" id="password" name="password" required />
            <i id="togglePassword" class="fa-solid fa-eye toggle-password"></i>
          </div>
        </div>

        <div class="form-group">
          <label for="role">Role:</label>
          <select id="role" name="role" required>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        <div class="form-group full-width">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  </main>
  <script src="script.js"></script>
</body>
</html>
