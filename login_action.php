<?php
// Include the database connection file
include('db_connection.php');

// Start the session
session_start();

// Check if the form is submitted via POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form data
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Prepare the SQL query to fetch the user by email
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $sql);

    // Check if the user exists
    if (mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        
        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Password is correct, start the session and redirect to the dashboard
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['first_name'] = $user['first_name'];
            $_SESSION['last_name'] = $user['last_name'];
            $_SESSION['role'] = $user['role'];

            // Redirect to the dashboard
            header("Location: dashboard.php");
            exit;  // <<<<<< Add this line here to stop further script execution
        } else {
            // Password is incorrect
            echo "Invalid password!";
        }
    } else {
        // User not found
        echo "User not found!";
    }
}
?>
