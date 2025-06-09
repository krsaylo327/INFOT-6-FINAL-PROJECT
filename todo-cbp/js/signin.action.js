const signIn = document.querySelector("#signIn");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const message = document.querySelector("#message");

const showPassword = document.querySelector("#showPassword");
const showPasswordIcon = document.querySelector("#showPasswordIcon");

let showPasswordState = true;

signIn.addEventListener("submit", e => {
    if (username.value === "" && password.value === "") {
        message.textContent = "You must log in first.";
        return e.preventDefault();
    }

    if (username.value === "" && password.value !== "") {
        message.textContent = "You forgot to enter your username.";
        return e.preventDefault();
    }

    if (password.value === "" && username.value !== "") {
        message.textContent = "You forgot to enter your password";
        return e.preventDefault();
    }

    message.textContent = "";
});

showPassword.addEventListener("click", () => {
    if (showPasswordState === true) {
        showPasswordState = false;
        password.type = "text";
        password.value = password.value;
        showPasswordIcon.setAttribute("class", "material-icons-round");
    } else {
        showPasswordState = true;
        password.type = "password";
        password.value = password.value;
        showPasswordIcon.setAttribute("class", "material-icons-outlined");
    }
});
