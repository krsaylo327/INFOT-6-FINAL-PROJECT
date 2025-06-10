const signUp = document.querySelector("#signUp");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const passwordConfirm = document.querySelector("#confirmPassword");
const message = document.querySelector("#message");

const showPassword = document.querySelector("#showPassword");
const showPasswordConfirm = document.querySelector("#showPasswordConfirm");
const showPasswordIcon = document.querySelector("#showPasswordIcon");
const showPasswordConfirmIcon = document.querySelector(
    "#showPasswordConfirmIcon"
);
let showPasswordState = true;
let showPasswordConfirmState = true;

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

showPasswordConfirm.addEventListener("click", () => {
    if (showPasswordConfirmState === true) {
        showPasswordConfirmState = false;
        passwordConfirm.type = "text";
        passwordConfirm.value = passwordConfirm.value;
        showPasswordConfirmIcon.setAttribute("class", "material-icons-round");
    } else {
        showPasswordConfirmState = true;
        passwordConfirm.type = "password";
        passwordConfirm.value = passwordConfirm.value;
        showPasswordConfirmIcon.setAttribute(
            "class",
            "material-icons-outlined"
        );
    }
});

signUp.addEventListener("submit", e => {
    if (
        username.value === "" &&
        password.value === "" &&
        passwordConfirm.value === ""
    ) {
        message.textContent = "You need to create your account first.";
        return e.preventDefault();
    }

    if (
        username.value !== "" &&
        password.value === "" &&
        passwordConfirm.value === ""
    ) {
        message.textContent = "You forgot to create your password.";
        return e.preventDefault();
    }

    if (
        username.value === "" &&
        password.value !== "" &&
        passwordConfirm.value !== ""
    ) {
        message.textContent = "You forgot to create your username.";
        return e.preventDefault();
    }

    if (
        passwordConfirm.value !== password.value &&
        passwordConfirm.value !== ""
    ) {
        message.textContent = "Password doesn't match.";
        return e.preventDefault();
    }

    if (
        password.value === "" &&
        username.value !== "" &&
        passwordConfirm.value !== ""
    ) {
        message.textContent = "You forgot to create your password.";
        return e.preventDefault();
    }

    if (
        passwordConfirm.value === "" &&
        username.value !== "" &&
        password.value !== ""
    ) {
        message.textContent = "You must confirm your password.";
        return e.preventDefault();
    }

    message.textContent = "";
});
