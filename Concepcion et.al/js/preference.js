let GET_ID = localStorage.getItem("id");
let GET_USERNAME = localStorage.getItem("username");
let GET_IS_LOGGED_IN = localStorage.getItem("isLoggedIn");

if (GET_ID === null || GET_USERNAME === null || GET_IS_LOGGED_IN === null) {
  localStorage.setItem("id", 0);
  localStorage.setItem("username", "N/A");
  localStorage.setItem("isLoggedIn", false);
}
