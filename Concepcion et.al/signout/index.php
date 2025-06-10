<?php
//COOKIES
setCookie("id", 0, time() + 0);
setCookie("username", "N/A", time() + 0);
setCookie("isLoggedIn", "no", time() + 0);

header("location:http://127.0.0.1:1024/signin");
?>