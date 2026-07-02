import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";

const form = document.querySelector("form");
const message = document.querySelector(".message");

const initApp = () => {
  new Navbar();
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.username = data.username.toLowerCase();
  const client = new DataClient("users");
  const result = await client.login(data);

  if (!result) {
    message.style.display = "block";
    message.innerHTML = /*html*/ `
      <p>Det gick inte att logga in med dessa uppgifterna.... Prova igen eller <a href="/pages/users/register.html">skapa ett konto.</a></p>`;
  } else {
    localStorage.setItem("user", result.id);
    location.href = "/pages/users/profile.html";
  }
};

initApp();

form.addEventListener("submit", handleSubmit);
