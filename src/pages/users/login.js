import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";

const form = document.querySelector("form");
const alert = document.querySelector("#alert");

const initApp = () => {
  new Navbar();
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const client = new DataClient("users");
  const result = await client.login(data);

  if (!result) {
    alert.style.display = "block";
    alert.innerHTML = /*html*/ `
      <p>Det gick inte att logga in med dessa uppgifterna.... Prova igen eller <a href="/pages/users/register.html">skapa ett konto.</a></p>`;
  } else {
    localStorage.setItem("user", result.id);
    location.href = "/pages/users/profile.html";
  }
};

initApp();

form.addEventListener("submit", handleSubmit);
