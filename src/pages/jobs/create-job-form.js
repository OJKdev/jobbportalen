import DataClient from "../../utilities/data-client.js";
import Services from "../../utilities/services.js";
import Navbar from "../../utilities/menu.js";

const form = document.querySelector("form");
const backBtn = document.querySelector("#backBtn");
const userId = localStorage.getItem("user");
const role = localStorage.getItem("role");
const services = new Services();
let job;
let editJobId;

const initApp = async () => {
  if (!userId || role === "employee") {
    location.href = "/pages/users/profile.html";
    return;
  }

  const editJobId = location.search.split("=")[1];
  if (editJobId) {
    job = await services.getJob(editJobId);
    if (job.employerId === userId) {
      populateForm();
      document.querySelector("h1").innerHTML = "Redigera annons";
    } else {
      job = undefined;
    }
  }

  new Navbar();
};

const populateForm = async () => {
  document.querySelector("#title").value = job.title;
  document.querySelector("#companyName").value = job.companyName;
  document.querySelector("#description").value = job.description;
  const btn = document.querySelector("#submit");
  btn.textContent = "Uppdatera annons";
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const client = new DataClient("jobs");

  let result;
  if (job) {
    result = await client.update(job.id, data);
  } else {
    result = await client.add({
      employerId: userId,
      title: data.title,
      companyName: data.companyName,
      description: data.description,
      iamgeFileName: "praktiseaLogo.png",
    });
  }

  if (result) {
    form.style.display = "none";
    services.showMessage(
      `
      <h3>Din annons är nu tillgänglig!</h3> <p><a href="/pages/users/profile.html">Min Profil</a></p>`,
      "success",
    );
  }
};

const handleBackBtn = () => {
  history.go(-1);
};

await initApp();

form.addEventListener("submit", handleSubmit);
backBtn.addEventListener("click", handleBackBtn);
