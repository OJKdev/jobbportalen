import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import Services from "../../utilities/services.js";

const form = document.querySelector("form");
const userId = localStorage.getItem("user");
const message = document.querySelector(".message");
const services = new Services();
const role = localStorage.getItem("role");

let jobId;

const initApp = async () => {
  new Navbar();
  if (role !== "employee") {
    document.querySelector(".message").insertAdjacentHTML("afterbegin", "<p>Du m[ste vara inloggad med rätt roll</p>");
    message.style.display = "block";
    return;
  }

  jobId = location.search.split("=")[1];
  console.log(jobId);
  if (!jobId) return;

  await displayJob(jobId);
};

const displayJob = async (id) => {
  const job = await services.getJob(id);

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
  console.log(data);
  const client = new DataClient("jobApplications");
  const result = await client.add({
    employeeId: userId,
    jobId: jobId,
    letter: data.letter,
    createdAt: new Date().toISOString(),
  });
  console.log(result);
  if (result) {
    form.style.display = "none";
    message.style.display = "block";
    message.innerHTML = /*html*/ `
      <h3>Tack för din ansökan!</h3> <p><a href="/pages/users/profile.html">Min Profil</a></p>`;
  }
};

await initApp();

const handleBackBtn = () => {
  history.go(-1);
};
const backBtn = document.querySelector("#backBtn");
backBtn.addEventListener("click", handleBackBtn);

form.addEventListener("submit", handleSubmit);
