import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "./jobList.js";
import jobsServices from "./jobServices.js";

const userId = localStorage.getItem("user");

const initApp = () => {
  new Navbar();

  const id = location.search.split("=")[1];
  console.log(id);
  if (!id) return;

  displayJob(id);
};

const displayJob = async (id) => {
  const service = new jobsServices();
  const job = await service.getJob(id);
  console.log(job);

  const bookmarkedJobs = await service.getBookmarkedJobs();
  const bookmarkedJobsIds = await service.getBookmarkedJobIds(bookmarkedJobs);

  const html = /*html*/ `<h1>${job.title}</h1>
        <article>
          <section class="left-column">
            <p>
              ${job.description}
            </p>

            <p class="company-name">NordicTech AB</p>
          </section>

          <aside>
            <p class="company-name">NordicTech AB</p>
            <ul>
              <button class="btn btn-primary">
                <i class="fa-regular fa-file-lines"></i>
                Ansök
              </button>
              <button class="btn btn-secondary">
                <i class="fa-regular fa-bookmark"></i>
                Spara jobb
              </button>
            </ul>
          </aside>
        </article>
  `;

  document.querySelector("#job-details").insertAdjacentHTML("afterbegin", html);
};

initApp();
