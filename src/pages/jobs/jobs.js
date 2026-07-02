import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import Services from "../../utilities/services.js";
import SearchBar from "../../utilities/searchbar.js";

const userId = localStorage.getItem("user");
let search;
let headerTitle = "";
const services = new Services();

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
  let listJobs = await services.listJobs();

  if (search) {
    listJobs = listJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const bookmarkedJobsIds = await services.getBookmarkedJobIds();

  new JobList(headerTitle, ".content", listJobs, bookmarkedJobsIds, "Kunde inte hitta några jobb...");
  services.handleButtons();
};

initApp();
