

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.forms["form"]["email"].value;
  const password = document.forms["form"]["password"].value;

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((result) => {
      if (result.status === 200) {
        result.json().then((data) => {
          const token = data.token;
          localStorage.setItem("token", token);
          window.location.replace("index.html");
        });
      } else {
        alert("L'email ou le mot de passe que vous avez entré est incorrect.!");
      }
    });
});
