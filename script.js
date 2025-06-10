//Toggle Password Button
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

//Log in Error Message
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const errorBox = document.getElementById('errorBox');

  if (form) {
    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('error')) {
        e.target.classList.remove('error');
      }
      if (errorBox) {
        errorBox.style.display = 'none';
      }
    });
  }
});

