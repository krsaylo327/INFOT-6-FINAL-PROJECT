<?php
require("http://localhost/todo/db.php");

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
    echo "Account not exist.";
} else {
    foreach ($accounts as $account) {
        if ($password === $account["password"]) {
            setCookie("id", $account["id"], time() + 86400);
            setCookie("username", $account["username"], time() + 86400);
            setCookie("isLoggedIn", "yes", time() + 86400);

            header("location:http://localhost/todo");
        } else {
            echo "Wrong password.";
        }
    }
}
?>