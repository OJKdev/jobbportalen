import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import jobsServices from "../../utilities/jobServices.js";
import SearchBar from "../../utilities/searchbar.js";

const userId = localStorage.getItem("user");
let search;
let headerTitle = "";
const jobs = undefined;

const initApp = () => {
  new Navbar();
  new SearchBar();

  search = location.search.split("=")[1];

  if (search) {
    headerTitle = `Sökresultat av "${search}"`;
  } else {
    headerTitle = `Alla jobb`;
  }

  displayJobs();
};

const displayJobs = async () => {
  const service = new jobsServices();
  let listJobs = await service.listJobs();

  if (search) {
    listJobs = listJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const bookmarkedJobsIds = await service.getBookmarkedJobIds();

  new JobList(headerTitle, ".content", listJobs, bookmarkedJobsIds, "Kunde inte hitta några jobb...");
  service.handleButtons();
};

initApp();
