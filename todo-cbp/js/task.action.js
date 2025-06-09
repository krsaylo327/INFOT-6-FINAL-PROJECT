const taskCollection = document.querySelector("#task-collection");
const taskItems = document.querySelectorAll(".task-item");
const taskDoneBtns = document.querySelectorAll(".task-done");
const taskDeleteBtns = document.querySelectorAll(".task-delete");
const taskLabel = document.querySelectorAll(".task-label");
const taskId = document.querySelectorAll(".task-id");
const taskIsDone = document.querySelectorAll(".task-is-done");
const taskIsDeleted = document.querySelectorAll(".task-is-deleted");

let taskDoneState = true;

for (let i = 0; i < taskItems.length; i++) {
    taskDoneBtns[i].addEventListener("click", () => {
        if (taskDoneBtns[i].textContent === "square") {
            taskDoneState = false;
            taskDoneBtns[i].textContent = "done";
            taskLabel[i].style.textDecoration = "line-through";
            fetch(`/system/action/?id=${taskId[i].textContent}&isdone=1&isdeleted=nofill`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return;
        }

        taskDoneState = true;
        taskDoneBtns[i].textContent = "square";
        fetch(`/system/action/?id=${taskId[i].textContent}&isdone=0&isdeleted=nofill`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        taskLabel[i].style.textDecoration = "none";
    });

    taskDeleteBtns[i].addEventListener("click", () => {
        taskCollection.removeChild(taskItems[i]);
        fetch(`/system/action/?id=${taskId[i].textContent}&isdone=nofill&isdeleted=1`, {
            method: "POST"
        });
    });
}
