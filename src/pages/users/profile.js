import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import jobsServices from "../../utilities/jobServices.js";

const userId = localStorage.getItem("user");
const logoutBtn = document.querySelector("#logout");
const jobs = undefined;

const initApp = () => {
  new Navbar();

  if (!userId) {
    console.log(" INTE inloggad");
    location.href = "/pages/users/login.html";
  } else {
    console.log("Inloggad");
    loadUser();
  }
};

const loadUser = async () => {
  const client = new DataClient("users");
  const user = await client.findById(userId);

  console.log(user);

  if (user.role === "individual") {
    await displayUserInfo(user);
    await displayBoomarkedJobs(user);
  }

  if (user.role === "company") {
    displayCompanyInfo(user);
  }
};

const displayUserInfo = async (user) => {
  const userDetailsHtml = /*html*/ `
    <p class="name">${user.firstName} ${user.lastName}</p>
    <p class="email">${user.email}</p>
  `;

  document.querySelector("#user-info").insertAdjacentHTML("afterbegin", userDetailsHtml);
};

const displayBoomarkedJobs = async () => {
  const service = new jobsServices();

  const bookmarkedJobs = await service.getBookmarkedJobs();
  const bookmarkedJobsIds = await service.getBookmarkedJobIds();

  new JobList("Sparade Jobb", ".content", bookmarkedJobs, bookmarkedJobsIds, "Du har inga sparade jobb...");
  service.handleSaveButton();
};

const logout = () => {
  localStorage.removeItem("user");
  location.href = "/";
};

initApp();

logoutBtn.addEventListener("click", logout);
