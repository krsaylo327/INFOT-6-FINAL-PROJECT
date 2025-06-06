<?php
//COOKIES
setCookie("id", 0, time() + 0);
setCookie("username", "N/A", time() + 0);
setCookie("isLoggedIn", "no", time() + 0);

header("location:http://todo/signin");
?>