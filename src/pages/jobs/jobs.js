import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import JobList from "../jobs/jobList.js";
import jobsServices from "../jobs/jobServices.js";

const userId = localStorage.getItem("user");
const jobs = undefined;

const initApp = () => {
  new Navbar();

  displayJobs();
};

const displayJobs = async () => {
  const service = new jobsServices();

  const listJobs = await service.listJobs();

  const bookmarkedJobs = await service.getBookmarkedJobs();
  const bookmarkedJobsIds = await service.getBookmarkedJobIds(bookmarkedJobs);

  new JobList("#jobs", listJobs, bookmarkedJobsIds, "Kunde inte hitta några jobb...", {
    onSave: (jobId) => service.bookmarkJob(jobId),
    onDiscard: (jobId) => service.unBookmarkJob(jobId),
  });
};

initApp();
