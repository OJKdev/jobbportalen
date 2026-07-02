import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import Services from "../../utilities/services.js";

const userId = localStorage.getItem("user");
const services = new Services();

const initApp = async () => {
  new Navbar();

  const id = location.search.split("=")[1];
  console.log(id);
  if (!id) return;

  await displayJob(id);
  const backBtn = document.querySelector("#backBtn");
  backBtn.addEventListener("click", handleBackBtn);
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

  const h1Html = /*html*/ `${job.title}`;

  const contentHtml = /*html*/ `
            <p>${job.companyName}</p>
            <p>
              ${job.description}
            </p>

          <p>Arbetsgivare: ${employerName}</p>
          
        
  `;
  const asideHtml = /*html*/ `      
            <ul>
              <li>
                <img src="/assets/images/logos/${job.iamgeFileName}" alt="${job.companyName}" /> </li>
              
            </ul>
              <ul class="tabs">
                <li> 
                    <button id="backBtn" class="btn btn-rounded">
                      <i class="fa-regular fa-arrow-left"></i> 
                      Tillbaka
                    </button>
                  </li>
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
  `;
  console.log(job.id);
  document.querySelector("h1").insertAdjacentHTML("afterbegin", h1Html);
  document.querySelector(".content").insertAdjacentHTML("afterbegin", contentHtml);
  document.querySelector("aside").insertAdjacentHTML("afterbegin", asideHtml);

  services.handleButtons();
};

initApp();

const handleBackBtn = () => {
  history.go(-1);
};
