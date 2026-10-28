let login = document.querySelector(".login-section");
let register = document.querySelector(".register-section");

login.style.display = "block";
register.style.display = "none";

document.getElementById("show-register").addEventListener("click", (e) => {
  login.style.display = "none";
  register.style.display = "block";
});

document.getElementById("show-login").addEventListener("click", () => {
  register.style.display = "none";
  login.style.display = "block";
});

let loginForm = document.getElementById("login-form");
let registerForm = document.getElementById("register-form");

let rMessage = document.getElementById("r-message");
let lMessage = document.getElementById("l-message");

// !--- create Account
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("register-email").value.trim();
  let password = document.getElementById("register-password").value;
  let confPass = document.getElementById("conf-password").value;

  console.log(password);

  console.log(confPass);
  // console.log(name);

  let pass = validatePassword(password);

  if (pass !== "validate") {
    rMessage.innerText = pass;
    rMessage.style.color = "red";
    return;
  }
  // console.log(pass);
  // console.log(password);
  rMessage.innerText = pass;
  rMessage.style.color = "red";

  if (password !== confPass) {
    rMessage.innerText = "Password  not correct";
    rMessage.style.color = "red";
    return;
  }

  let account = {
    name: name,
    email: email,
    password: password,
  };

  localStorage.setItem("account", JSON.stringify(account));

  rMessage.innerText = "Account created successfully!";
  rMessage.style.color = "green";

  registerForm.reset();

  register.style.display = "none";
  login.style.display = "block";
});

// !---- login account
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("login-email").value.trim();
  let password = document.getElementById("login-password").value;

  let account = localStorage.getItem("account");
  // console.log(account);
  // console.log(typeof account);
  let data = JSON.parse(account);
  console.log(data);
  if (account === null) {
    lMessage.innerText = `first create Account `;
    lMessage.style.color = "red";
    return;
  }
  if (email == data.email && password == data.password) {
    lMessage.innerText = `Login Success ${data.name} `;
    lMessage.style.color = "green";
    return;
  }
});

// !----password validation
function validatePassword(password) {
  let uppercase = /[A-Z]/;
  let lowerCase = /[a-z]/;
  let number = /[0-9]/;
  let specialChar = /[!@#$%^&<>]/;

  if (password.length < 6) {
    return "password should at least 6 digit";
  }
  if (!uppercase.test(password)) {
    return "Password should contain uppercase";
  }
  if (!lowerCase.test(password)) {
    return "Password should contain lowercase";
  }
  if (!number.test(password)) {
    return "Password should contain number";
  }
  if (!specialChar.test(password)) {
    return "Password should contain special character";
  }
  return "validate";
}
