import Header from "../../utilities/header.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../../utilities/jobList.js";
import Services from "../../utilities/services.js";
import SearchBar from "../../utilities/searchbar.js";
import Footer from "../../utilities/footer.js";

const userId = localStorage.getItem("user");
let search;
const services = new Services();

const initApp = () => {
  new Header();
  search = new SearchBar().hasSearchParams();

  displayJobs();
  new Footer();
};

const displayJobs = async () => {
  let listJobs = await services.listJobs();
  let headerTitle = `Alla jobb`;

  if (search) {
    headerTitle = `Sökresultat av "${search}"`;
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
