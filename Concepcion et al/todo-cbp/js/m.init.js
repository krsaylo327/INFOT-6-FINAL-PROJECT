document.addEventListener("DOMContentLoaded", function () {
    const fab = document.querySelectorAll(".fixed-action-btn");
    const modal = document.querySelectorAll(".modal");

    const fabInit = M.FloatingActionButton.init(fab, {});
    const modalInit = M.Modal.init(modal, {});
});
