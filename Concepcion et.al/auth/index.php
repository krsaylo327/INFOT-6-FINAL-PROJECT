<?php
require("./../db.php");

//COOKIES
setCookie("id", 0, time() + 86400);
setCookie("username", "N/A", time() + 86400);
setCookie("isLoggedIn", "no", time() + 86400);

$username = $_POST["username"];
$password = $_POST["password"];

$auth = $pdo->prepare("SELECT id, username, password FROM (SELECT
*, AES_DECRYPT(passphrase, 'yanyan') as password FROM accounts WHERE
username=:username) as SUBQUERY;");
$auth->bindParam(":username", $username);
$auth->execute();

$accounts = $auth->fetchAll(PDO::FETCH_ASSOC);

if (count($accounts) === 0) {
    echo "<div class='card yellow'>";
    echo "<div class='card-content'>";
    echo "<div class='card-body'>";
    echo "<p>Account not exist</p>";
    echo "</div>";
    echo "</div>";
    echo "</div>";
} else {
    foreach ($accounts as $account) {
        if ($password === $account["password"]) {
            setCookie("id", $account["id"], time() + 86400);
            setCookie("username", $account["username"], time() + 86400);
            setCookie("isLoggedIn", "yes", time() + 86400);

            header("location:http://localhost:1024");
        } else {
            echo "<div class='card red'>";
            echo "<div class='card-content'>";
            echo "<div class='card-body'>";
            echo "<p>Wrong password.</p>";
            echo "</div>";
            echo "</div>";
            echo "</div>";
        }
    }
}
?>