<?php
require("./db.php"  );

//COOKIES
if (count($_COOKIE) === 0) {
    setCookie("id", 0, time() + 86400);
    setCookie("username", "N/A", time() + 86400);
    setCookie("isLoggedIn", "no", time() + 86400);

    header("location:http://127.0.0.1:1024/signin");
}

$id = $_COOKIE["id"];
$username = $_COOKIE["username"];
$isLoggedIn = $_COOKIE["isLoggedIn"];


// GET LIST OF TASKS.
$tasks = $pdo->prepare("SELECT id,taskX,isDone,isDeleted FROM (SELECT *, AES_DECRYPT(task, 'yanyan') as
taskX FROM tasks WHERE account_id=:id) AS SUBQUERY WHERE isDeleted=0");
$tasks->bindParam(":id", $id);
$tasks->execute();
$taskLists = $tasks->fetchAll(PDO::FETCH_ASSOC);

// REDIRECT TO LOGIN IF USER NOT YET LOGGED IN.
if ($isLoggedIn === "no") {
    header("location:http://127.0.0.1:1024/signin");
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="author" content="Yerenzter">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TO-DO App</title>
    <link rel="stylesheet" href="http://127.0.0.1:1024/material/css/materialize.css">
    <link rel="stylesheet" href="http://127.0.0.1:1024/material/iconfont/material-icons.css">
    <link rel="stylesheet" href="http://127.0.0.1:1024/css/task.css">
</head>

<body>
    <!-- ADD TASK BOTTOM SHEET -->
    <div id="addTask" class="modal bottom-sheet blue-300 lighten-4" popover>
        <div class="modal-header transparent">
            <h4>Add new task</h4>
        </div>

        <div class="modal-content">
            <form action="/create/task" method="post" id="addTask" class="row g3">
                <div class="input-field outlined col-' s12">
                    <input type="text" name="task" id="task" placeholder=" "
                    maxlength="16">
                    <label for="task">Task</label>
                </div>
                <button type="submit" class="btn waves-effect
                    waves-light col s12 text-center blue darken-4 white-text">Create task</button>
                <br>
            </form>
        </div>
    </div>

    <!-- FAB -->
    <div class="fixed-action-btn">
        <a class="btn-floating btn-large blue darken-4 rounded">
            <i class="large material-icons">edit</i>
        </a>

        <ul>
            <li class="btn-floating circle blue lighten-2" popovertarget="addTask"
                onclick="ShowModal('addTask')"><i class="material-icons">add</i></i>
            <li class="btn-floating circle red lighten-2" popovertarget="addTask"
                ><a href="/signout"><i
                    class="material-icons">logout</i></a>
            </ul>
        </div>

        <!--TO-DO APP-->
        <div class="row g-3">
            <div class="col s12 fixed m6 px-6">
                <h3>My TO-DO lists</h3>
            </div>
            <div class="col s12 divider mx-6"></div>
            <div class="col s12 m6 px-6">
                <ul id="task-collection" class="collection">
                    <?php
                    foreach ($taskLists as $myTask) {
                        echo "<li class='collection-item avatar task-item'>";
                        echo "<span class='material-icons-outlined circle p-1
                    task-done blue-text text-darken-4'>square</span>";
                        echo "<span
                    class='title task-label'>".$myTask["taskX"]."</span>";
                        echo "<p>Ends in</p>";
                        echo "<span class='task-info'>Task Info (ID: <span
                    class='task-id'>".$myTask["id"]."</span>&comma; Done:<span
                    class='task-is-done'>".$myTask["isDone"]."</span>&comma;
                    Deleted: <span
                    class='task-is-deleted'>".$myTask['isDeleted']."</span>)</span>";
                        echo "<a class='secondary-content task-delete'><i
                    class='material-icons-round red-text text-darken-4'>delete</i></a>";
                        echo "</li>";
                    }
                    ?>
                </ul>
            </div>
            <div class="col s12 m3"></div>
        </div>

        <script src="http://127.0.0.1:1024/material/js/materialize.js" type="text/javascript"></script>
        <script src="http://127.0.0.1:1024/js/m.init.js" type="text/javascript"></script>
        <script src="http://127.0.0.1:1024/js/modal.js" type="text/javascript"></script>
        <script src="http://127.0.0.1:1024/js/task.action.js" type="text/javascript"></script>
        <script src="http://127.0.0.1:1024/js/preference.js" type="text/javascript"></script>
    </body>