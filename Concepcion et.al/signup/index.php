<?php
require("./../db.php");

//COOKIES
if (count($_COOKIE) === 0) {
    setCookie("id", 0, time() + 86400);
    setCookie("username", "N/A", time() + 86400);
    setCookie("isLoggedIn", "no", time() + 86400);

    header("location:http://127.0.0.1:1024/signup");
}

$id = $_COOKIE["id"];
$username = $_COOKIE["username"];
$isLoggedIn = $_COOKIE["isLoggedIn"];

// REDIRECT TO LOGIN IF USER NOT YET LOGGED IN.
if ($isLoggedIn === "yes") {
    header("location:http://127.0.0.1:1024/");
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="author" content="Yerenzter">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TO-DO App | Sign up</title>
    <link rel="stylesheet" href="http://127.0.0.1:1024/material/css/materialize.css">
    <link rel="stylesheet" href="http://127.0.0.1:1024/material/iconfont/material-icons.css">
</head>

<body>
    <div class="row p-3">
        <div class="col s12 m4"></div>
        <div class="col s12 m4 p-6">
            <form action="/create/account" method="post" id="signUp" class="row g-3">
                <div class="input-field outlined col s12">
                    <span class="prefix"><i class="material-icons">person</i></span>
                    <input type="text" name="username" id="username"
                    maxlength="64" placeholder=" ">
                    <label for="username">Username</label>
                </div>

                <div class="input-field outlined col s12">
                    <span class="prefix"><i class="material-icons">lock</i></span>
                    <input type="password" name="password" id="password"
                    maxlength="64" placeholder=" "
                    >
                    <label for="password">Password</label>
                    <span class="suffix" id="showPassword"><i
                        id="showPasswordIcon"
                        class="material-icons-outlined">remove_red_eye</i></span>
                    <span class="helper-text" data-error="empty"></span>
                </div>

                <div class="input-field outlined col s12">
                    <span class="prefix"><i class="material-icons">lock</i></span>
                    <input type="password" name="confirm_password"
                    id="confirmPassword" maxlength="20" placeholder=" ">
                    <label for="confirmPassword">Confirm password</label>
                    <span class="suffix" id="showPasswordConfirm"><i
                        id="showPasswordConfirmIcon"
                        class="material-icons-outlined">remove_red_eye</i></span>
                </div>

                <span id="message" class="text-flow red-text col s12">&nbsp;</span>

                <button type="submit" class="btn blue waves-effect waves-light col
                    s12">Create account</button>
            </form>
            <div class="divider my-3"></div>
            <span class="text-flow">Already had account? <a href="/signin">Log
                in</a> here.</span>
        </div>
        <div class="col s12 m4"></div>
    </div>
    <script src="http://127.0.0.1:1024/material/js/materialize.js" type="text/javascript"></script>
    <script src="http://127.0.0.1:1024/js/signup.action.js" type="text/javascript"></script>
    <script src="http://127.0.0.1:1024/js/preference.js" type="text/javascript"></script>
</body>
</html>