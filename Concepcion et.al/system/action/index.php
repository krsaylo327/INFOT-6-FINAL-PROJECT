<?php
require("./../../db.php");

$id = $_GET["id"];
$isDone = $_GET["isdone"];
$isDeleted = $_GET["isdeleted"];

if ($isDone == "nofill") {
    $take_action = $pdo->prepare("UPDATE tasks SET isDeleted=:deleted WHERE
    id=:id");
    $take_action->bindParam(":id", $id);
    $take_action->bindParam(":deleted", $isDeleted);
    $take_action->execute();
    return;
}

if ($isDeleted == "nofill") {
    $take_action = $pdo->prepare("UPDATE tasks SET isDone=:done WHERE id=:id");
    $take_action->bindParam(":id", $id);
    $take_action->bindParam(":done", $isDone);
    $take_action->execute();
    return;
}

if ($isDone != "nofill" and $isDeleted != "nofill") {
    $take_action = $pdo->prepare("UPDATE tasks SET isDone=:done,
    isDeleted=:deleted WHERE id=:id");
    $take_action->bindParam(":id", $id); $take_action->bindParam(":done", $isDone);
    $take_action->bindParam(":deleted", $isDeleted);
    $take_action->execute();
    return;
}
?>