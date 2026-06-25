import DataClient from "../../utilities/data-client.js";

export default class JobsServices {
  constructor() {
    this.userId = localStorage.getItem("user");
  }

  async bookmarkJob(jobId) {
    //TODO: skicka till inloggning om man 'r utloggad
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

  async getBookmarkedJobIds(jobs) {
    console.log(jobs);
    const jobIds = jobs.map((item) => item.id);
    console.log(jobIds);
    return jobIds;
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
}
