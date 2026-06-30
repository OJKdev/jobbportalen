import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import jobsServices from "../../utilities/jobServices.js";

const form = document.querySelector("form");
const userId = localStorage.getItem("user");
const message = document.querySelector(".message");

let jobId;

const initApp = async () => {
  new Navbar();

  jobId = location.search.split("=")[1];
  console.log(jobId);
  if (!jobId) return;

  await displayJob(jobId);
};

const displayJob = async (id) => {
  const service = new jobsServices();
  const job = await service.getJob(id);

  let employerName = "";
  if (job.employerId) {
    const client = new DataClient("users");
    const employer = await client.findById(job.employerId);
    employerName = employer.employerName;
    console.log(employer);
  }

  const bookmarkedJobIds = await service.getBookmarkedJobIds();

  const h1Html = /*html*/ `Ansök "${job.title}"`;

  const asideHtml = /*html*/ `      
            
            <ul>
              <li>
                <img src="/assets/images/logos/${job.iamgeFileName}" alt="${job.companyName}" />
              </li>
              
            </ul>      
             <ul>
                  <li> 
                    <button id="${job.id}" class="btn btn-rounded">
                      <i class="${bookmarkedJobIds.includes(id) ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
                      ${bookmarkedJobIds.includes(id) ? "Jobb sparat" : "Spara till senare"} 
                    </button>
                  </li>
                </ul>      
            

  `;
  console.log(job.id);
  document.querySelector("h1").insertAdjacentHTML("afterbegin", h1Html);
  document.querySelector("aside").insertAdjacentHTML("afterbegin", asideHtml);

  service.handleButtons();
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const client = new DataClient("jobApplications");
  const result = await client.add({
    userId: userId,
    jobId: jobId,
    letter: data.letter,
    createdAt: new Date().toISOString(),
  });
  console.log(result);
  if (result) {
    form.style.display = "none";
    message.style.display = "block";
    message.innerHTML = /*html*/ `
      <h3>Tack för din ansökan!</h3> <p><a href="/pages/jobs/job-applications.html">Mina Ansökningar</a></p>`;
  }
};

await initApp();

form.addEventListener("submit", handleSubmit);
