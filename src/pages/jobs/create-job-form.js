import DataClient from "../../utilities/data-client.js";
import Navbar from "../../utilities/menu.js";

const form = document.querySelector("form");
const backBtn = document.querySelector("#backBtn");
const userId = localStorage.getItem("user");
const role = localStorage.getItem("role");

const message = document.querySelector(".message");

let jobId;

const initApp = async () => {
  if (role !== "employer") {
    location.href = "/pages/users/login.html";
    return;
  }
  new Navbar();
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const client = new DataClient("jobs");
  const result = await client.add({
    employerId: userId,
    title: data.title,
    companyName: data.company,
    description: data.description,
    iamgeFileName: "praktiseaLogo.png",
  });
  console.log(result);
  if (result) {
    form.style.display = "none";
    message.style.display = "block";
    message.innerHTML = /*html*/ `
      <h3>Din annons är nu tillgänglig!</h3> <p><a href="/pages/users/profile.html">Min Profil</a></p>`;
  }
};

const handleBackBtn = () => {
  history.go(-1);
};

await initApp();

form.addEventListener("submit", handleSubmit);
backBtn.addEventListener("click", handleBackBtn);
