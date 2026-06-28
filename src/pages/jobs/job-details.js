import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import jobsServices from "../../utilities/jobServices.js";

const userId = localStorage.getItem("user");

const initApp = async () => {
  new Navbar();

  const id = location.search.split("=")[1];
  console.log(id);
  if (!id) return;

  await displayJob(id);
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

  const h1Html = /*html*/ `${job.title}`;

  const contentHtml = /*html*/ `
       
            <p>
              ${job.description}
            </p>

          <p>${companyName}</p>
          
        
  `;
  const asideHtml = /*html*/ `      
            <ul>
              <li>
                <img src="/assets/images/logos/${job.iamgeFileName}" alt="${companyName}" />
              </li>
              <li>
                <ul>
                  <li> 
                    <button id="${job.id}" class="btn btn-rounded">
                      <i class="${bookmarkedJobIds.includes(id) ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
                      ${bookmarkedJobIds.includes(id) ? "Jobb sparat" : "Spara jobb"} 
                    </button>
                  </li>
                  <li> 
                    <button id="${job.id}" class="apply btn btn-rounded">
                      <i class="fa-regular fa-file-lines"></i>
                      Ansök
                    </button>
                  </li>
                <ul>
              </li>
            </ul>
  `;
  console.log(job.id);
  document.querySelector("h1").insertAdjacentHTML("afterbegin", h1Html);
  document.querySelector(".content").insertAdjacentHTML("afterbegin", contentHtml);
  document.querySelector("aside").insertAdjacentHTML("afterbegin", asideHtml);
  service.handleButtons();
};

initApp();
