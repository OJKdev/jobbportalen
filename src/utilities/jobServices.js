import DataClient from "./data-client.js";

export default class JobsServices {
  constructor() {
    this.userId = localStorage.getItem("user");
    this.quedBookmark = localStorage.getItem("quedBookmark");
    this.quedApplication = localStorage.getItem("quedApplication");

    if (this.userId && this.quedBookmark) {
      this.bookmarkJob(this.quedBookmark);
      localStorage.removeItem("quedBookmark");
      location.href = localStorage.getItem("returnLocation");

      return;
    }

    if (this.userId && this.quedApplication) {
      localStorage.removeItem("quedApplication");
      location.href = localStorage.getItem("returnLocation");

      return;
    }
  }

  async bookmarkJob(jobId) {
    if (!this.userId) {
      localStorage.setItem("quedBookmark", jobId);
      localStorage.setItem("returnLocation", location);
      location.href = "/pages/users/login.html";
      return;
    }
    console.log("sparar jobb", jobId);
    const client = new DataClient("bookmarkedJobs");
    console.log(this.userId);
    await client.add({
      userId: this.userId,
      jobId: jobId,
    });
  }

  async unBookmarkJob(jobId) {
    console.log("tar bort sparad jobb", jobId);
    const client = new DataClient("bookmarkedJobs");
    const bookMarkedJobs = await client.listAll();
    const jobToUnBookMark = bookMarkedJobs.find((job) => job.jobId === jobId);
    console.log(jobToUnBookMark);
    await client.removeById(jobToUnBookMark.id);
  }

  // TODO: bookmarked jobs kan itne va tillg'ngligt om mna inte 'r inloggad...
  async getBookmarkedJobs() {
    const bookMarkedJobsClient = new DataClient("bookmarkedJobs?userId=" + this.userId);

    const bookMarkedJobs = await bookMarkedJobsClient.listAll();
    console.log(bookMarkedJobs);
    const bookMarkedjobIds = bookMarkedJobs.map((item) => item.jobId);
    console.log(bookMarkedjobIds);

    const jobsClient = new DataClient("jobs");
    const jobs = await jobsClient.listAll();

    return jobs.filter((job) => bookMarkedjobIds.includes(job.id));
  }

  async getBookmarkedJobIds() {
    const bookMarkedJobs = await this.getBookmarkedJobs();
    console.log();
    const jobIds = bookMarkedJobs.map((item) => item.id);
    console.log(jobIds);
    return jobIds;
  }

  applyJob(id) {
    if (!this.userId) {
      localStorage.setItem("quedApplication", id);
      localStorage.setItem("returnLocation", "/pages/jobs/job-application.html?id=" + id);
      location.href = "/pages/users/login.html";
      return;
    }

    location.href = "/pages/jobs/job-application.html?id=" + id;
  }

  async listJobs() {
    const client = new DataClient("jobs");
    const jobs = await client.listAll();
    return jobs;
  }

  async getJob(id) {
    const client = new DataClient("jobs");
    const job = await client.findById(id);
    return job;
  }

  handleButtons() {
    const applyButton = document.querySelector(".apply");
    if (applyButton) {
      applyButton.addEventListener("click", async (e) => {
        this.applyJob(e.currentTarget.id);
      });
    }

    const buttons = document.querySelectorAll(".fa-bookmark");

    buttons.forEach((icon) => {
      const button = icon.parentElement;

      button.addEventListener("click", async () => {
        const id = button.id;
        console.log(id);

        if (icon.classList.contains("fa-regular")) {
          await this.bookmarkJob(id);

          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        } else {
          await this.unBookmarkJob(id);

          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
      });
    });
  }
}
