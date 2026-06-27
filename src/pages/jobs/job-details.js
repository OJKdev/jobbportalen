import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import jobsServices from "../../utilities/jobServices.js";

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

  let companyName = "";
  if (job.companyId) {
    const client = new DataClient("users");
    const company = await client.findById(job.companyId);
    companyName = company.companyName;
    console.log(company);
  }

  const bookmarkedJobIds = await service.getBookmarkedJobIds();

  const html = /*html*/ `<h1>${job.title}</h1>
        <article>
          <section class="left-column">
            <p>
              ${job.description}
            </p>

          <p>${companyName}</p>
          </section>

          <aside>
            <ul>
            <li><img src="/assets/images/logos/${job.iamgeFileName}" alt="${companyName}" /></li>
            <ul>
             
             <li> <button id="${job.id}" class="btn btn-rounded">
                <i class="${bookmarkedJobIds.includes(id) ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
                ${bookmarkedJobIds.includes(id) ? "Jobb sparat" : "Spara jobb"} 
              </button></li>
              <li> <button id="${job.id}" class="btn btn-rounded">
                <i class="fa-regular fa-file-lines"></i>
                Ansök
              </button></li>
              <ul>
            </ul>
          </aside>
        </article>
  `;
  console.log(job.id);
  document.querySelector("#job-details").insertAdjacentHTML("afterbegin", html);
  service.handleSaveButton();
};

initApp();
