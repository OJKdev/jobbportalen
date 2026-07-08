import Header from "../../utilities/header.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import Services from "../../utilities/services.js";
import Footer from "../../utilities/footer.js";

const userId = localStorage.getItem("user");
const logoutBtn = document.querySelector("#logout");

const services = new Services();

const initApp = async () => {
  if (!userId) {
    location.href = "/pages/users/login.html";
    return;
  }
  new Header();

  const user = await loadUser();
  renderAside(user);

  handleTabButtons();

  new Footer();
};

const loadUser = async () => {
  const client = new DataClient("users");
  const user = await client.findById(userId);
  if (!user) {
    services.showMessage("Kunde inte hitta användaren.", "error");
    return;
  }

  if (user.role === "employee") {
    await displayBoomarkedJobs();
    await displayEmployeeJobApplications(user);
  }

  if (user.role === "employer") {
    const jobs = await services.getEmployerJobs(user);
    const applications = await services.getEmployersApplications(jobs);

    await displayEmployersJobs(jobs);
    await displayAppliedJobs(applications);
  }
  return user;
};

const displayBoomarkedJobs = async () => {
  const bookmarkedJobs = await services.getBookmarkedJobs();
  const bookmarkedJobsIds = bookmarkedJobs.map((item) => item.id);
  new JobList("Sparade Jobb", ".content", bookmarkedJobs, bookmarkedJobsIds, "Du har inga sparade jobb...");

  services.handleButtons();
};

const displayEmployeeJobApplications = async (user) => {
  const jobApp = await services.getEmployeeApplications(user);

  let html = /*html*/ `<div id="applications" class="tab">
    <h2>Mina Ansökningar</h2>
  `;

  if (jobApp && jobApp.length > 0) {
    jobApp.map((jobApp) => {
      html += /*html*/ `
              <section class="data-entry">
              <h3> ${jobApp.job.title}</h3>
              <p>Företag: ${jobApp.job.companyName}</p>
              <p>Arbetsgivare: ${jobApp.employer.employerName}</p>
              <p>Du ansökte: ${new Date(jobApp.application.createdAt).toLocaleString("sv-SE")}</p>
              <p>Personligt Brev: ${jobApp.application.letter}</p>
            </section>

  `;
    });
  } else {
    html += /*html*/ `<p>Inga ansökningar än...</p>`;
  }
  html += `</div>`;

  document.querySelector(".content").insertAdjacentHTML("afterbegin", html);
};

const displayEmployersJobs = async (jobs) => {
  let html = /*html*/ `<div id="jobs" class="tab active">
    <h2>Våra annonser</h2>
  `;

  if (jobs && jobs.length > 0) {
    jobs.map((jobs) => {
      html += /*html*/ `
              <section class="data-entry">
              <h3> ${jobs.job.title}</h3>
              <p>Företag: ${jobs.job.companyName}</p>
              <p>Antal ansökningar: ${jobs.applications.length}</p>
              <p><a href="/pages/jobs/create-job-form.html?id=${jobs.job.id}">Redigera detta jobb</a></p>

            </section>

  `;
    });
  } else {
    html += /*html*/ `<p>Inga annonser än...</p>`;
  }
  html += `</div>`;

  document.querySelector(".content").insertAdjacentHTML("afterbegin", html);
};
const displayAppliedJobs = async (applications) => {
  let html = /*html*/ `<div id="applications" class="tab">
    <h2>Mottagna Ansökningar</h2>
  `;

  if (applications && applications.length > 0) {
    applications.forEach((jobApp) => {
      html += /*html*/ `
              <section class="data-entry">
              <h3> ${jobApp.job.title}</h3>
              <p>Sökande: ${jobApp.employee.firstName} ${jobApp.employee.lastName}</p>
              <p>Inkom : ${new Date(jobApp.application.createdAt).toLocaleString("sv-SE")}</p>
              <p>Personligt brev: ${jobApp.application.letter}</p>
            </section>

  `;
    });
  } else {
    html += /*html*/ `<p>Inga ansökningar än...</p>`;
  }
  html += `</div>`;

  document.querySelector(".content").insertAdjacentHTML("afterbegin", html);
};

const renderAside = (user) => {
  const name = user.role == "employee" ? `${user.firstName} ${user.lastName}` : `${user.employerName}`;
  const firstTabTxt = user.role == "employee" ? `Sparade jobb` : `Våra annsonser`;
  const secondTabTxt = user.role == "employee" ? `Mina ansökningar` : `Ansökningar`;

  const asideHtml = /*html*/ `
    <ul>
        <li>
            <p class="name">${name}</p>
            <p class="email">${user.email}</p>
        </li>
        ${
          user.role === "employer"
            ? /*html*/ `
          <li> 
           <button class="btn btn-rounded create">
            Skapa annons
            </button>
        </li>
        `
            : ``
        }
    </ul>
    <ul class="tabs">
       
        <li> 
            <button data-tab="jobs" class="btn btn-rounded tabBtn active">
            ${firstTabTxt}
            </button>
        </li>
        <li> 
            <button data-tab="applications" class="btn btn-rounded tabBtn">
            ${secondTabTxt}
            </button>
        </li>
       

        
    </ul>
  `;

  document.querySelector("aside").insertAdjacentHTML("afterbegin", asideHtml);
};

const handleTabButtons = () => {
  const createJobBtn = document.querySelector(".create");
  if (createJobBtn) {
    createJobBtn.addEventListener("click", handleCreateJob);
  }

  const tabs = document.querySelectorAll(".tab");

  const tabButtons = document.querySelectorAll(".tabBtn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTab = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabs.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      document.querySelector(`#${selectedTab}`).classList.add("active");
    });
  });
};
const handleCreateJob = () => {
  location.href = "/pages/jobs/create-job-form.html";
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("returnLocation");
  location.href = "/";
};

initApp();

logoutBtn.addEventListener("click", logout);
