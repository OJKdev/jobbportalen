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
    location.href = "/pages/users/login.html";
    return;
  }

  loadUser();
};

const loadUser = async () => {
  const client = new DataClient("users");
  const user = await client.findById(userId);

  console.log(user);

  if (user.role === "individual") {
    await displayUserInfo(user);
    await displayBoomarkedJobs();
    await displayJobApplications();
  }

  if (user.role === "employer") {
    displayemployerInfo(user);
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
  //TODO: Hitta en bättre lösning på detta?
  const bookmarkedJobsIds = await service.getBookmarkedJobIds();

  new JobList("Sparade Jobb", ".content", bookmarkedJobs, bookmarkedJobsIds, "Du har inga sparade jobb...");
  service.handleButtons();
};

const displayJobApplications = async () => {
  const service = new jobsServices();
  const applicationClient = new DataClient("jobApplications?userId=" + userId);
  const applications = await applicationClient.listAll();
  //TODO: Hitta en bättre lösning på detta? skapa services för att hämta DTOer med all info typ
  const appliedJobs = [];
  for (const jobApp of applications) {
    const job = await service.getJob(jobApp.jobId);

    appliedJobs.push({
      ...job,
      jobApp,
    });
  }
  console.log(appliedJobs);

  const userClient = new DataClient("users");
  const users = await userClient.listAll();

  console.log(applications);
  let html = "<h2>Mina Ansökningar</h2>";

  if (applications && applications.length > 0) {
    applications.map((jobApp) => {
      const job = appliedJobs.find((job) => job.id === jobApp.jobId);

      let employerName = "";
      const employer = users.find((user) => user.id === job.employerId);
      if (employer) employerName = employer.employerName;

      html += /*html*/ `
              <section class="job-applicaiton">
              <h3> ${job.title}</h3>
              <p>Företag: ${job.companyName}</p>
              <p>Arbetsgivare: ${employerName}</p>
              <p>Du ansökte: ${new Date(jobApp.createdAt).toLocaleString("sv-SE")}</p>
              <p>Personligt Brev: ${jobApp.letter}</p>
            </section>

  `;
    });
  } else {
    html = /*html*/ `<p>Inga ansökningar än...</p>`;
  }

  document.querySelector(".content").insertAdjacentHTML("afterbegin", html);
};

const logout = () => {
  localStorage.removeItem("user");
  location.href = "/";
};

initApp();

logoutBtn.addEventListener("click", logout);
