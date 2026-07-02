import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import Services from "../../utilities/services.js";

const form = document.querySelector("form");
const employeeRadio = document.querySelector("#employee");
const employerRadio = document.querySelector("#employer");
const employerInput = document.querySelector("#employerName");
const firstNameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const services = new Services();

const initApp = () => {
  new Navbar();
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.email = data.email.toLowerCase();
    if (!data.email.includes("@")) {
      services.showMessage("Email adressen är inte korrekt skriven....", "error");
      return;
    }
    const emailCheckCilent = new DataClient("users?email=" + data.email);
    const emailCheck = await emailCheckCilent.listAll();
    if (emailCheck.length > 0) {
      services.showMessage("Ett konto med emailadressen finns redan...", "error");
      return;
    }

    const client = new DataClient("users");
    const result = await client.add(data);

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

employeeRadio.addEventListener("change", () => {
  firstNameInput.required = true;
  lastNameInput.required = true;
  employerInput.required = false;
});

employerRadio.addEventListener("change", () => {
  firstNameInput.required = false;
  lastNameInput.required = false;
  employerInput.required = true;
});
