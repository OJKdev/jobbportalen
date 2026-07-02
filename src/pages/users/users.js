import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";

const form = document.querySelector("form");

const initApp = () => {
  new Navbar();
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.username = data.username.toLowerCase();
    const client = new DataClient("users");
    const result = await client.add(userData);

    if (result) {
      location.href = "/pages/users/login.html";
      form.reset();
    }
  } catch (error) {
    console.log(error.message);
  }
};

initApp();

form.addEventListener("submit", handleSubmit);
