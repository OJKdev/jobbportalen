import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import Services from "../../utilities/services.js";

const form = document.querySelector("form");
const userId = localStorage.getItem("user");
const services = new Services();
const role = localStorage.getItem("role");

let jobId;

const initApp = async () => {
  new Navbar();
  if (!userId || role === "employer") {
    location.href = "/pages/users/profile.html";
    return;
  }

  jobId = location.search.split("=")[1];

  if (!jobId) return;

  const displayJobs = await displayJob(jobId);
  if (displayJobs) {
    const backBtn = document.querySelector("#backBtn");
    backBtn.addEventListener("click", handleBackBtn);
  }
};

const displayJob = async (id) => {
  const job = await services.getJob(id);
  if (!job) {
    services.showMessage("Kunde inte hitta detta jobb...", "error");
    form.style.display = "none";
    return;
  }

  let employerName = "";
  if (job.employerId) {
    const client = new DataClient("users");
    const employer = await client.findById(job.employerId);
    employerName = employer.employerName;
  }

  const bookmarkedJobIds = await services.getBookmarkedJobIds();

  const h1Html = /*html*/ `Ansök "${job.title}"`;

  const asideHtml = /*html*/ `      
            <ul>
              <li>
                <img src="/assets/images/logos/${job.iamgeFileName}" alt="${job.companyName}" />
              </li>
              
            </ul>      
            <ul>
              <li> 
                <li> 
                    <button id="backBtn" class="btn btn-rounded">
                      <i class="fa-regular fa-arrow-left"></i> 
                      Tillbaka
                    </button>
                  </li>
                <button id="${job.id}" class="btn btn-rounded">
                  <i class="${bookmarkedJobIds.includes(id) ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
                            ${bookmarkedJobIds.includes(id) ? "Jobb sparat" : "Spara till senare"} 
                </button>
              </li>
            </ul>      
  `;
  document.querySelector("h1").insertAdjacentHTML("afterbegin", h1Html);
  document.querySelector("aside").insertAdjacentHTML("afterbegin", asideHtml);

  services.handleButtons();
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const client = new DataClient("jobApplications");
  const result = await client.add({
    employeeId: userId,
    jobId: jobId,
    letter: data.letter,
    createdAt: new Date().toISOString(),
  });
  if (result) {
    form.style.display = "none";
    services.showMessage(
      `
      <h3>Tack för din ansökan!</h3> <p><a href="/pages/users/profile.html">Min Profil</a></p>`,
      "success",
    );
  }
};

await initApp();

const handleBackBtn = () => {
  history.go(-1);
};
const backBtn = document.querySelector("#backBtn");
backBtn.addEventListener("click", handleBackBtn);

form.addEventListener("submit", handleSubmit);
