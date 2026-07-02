import DataClient from "./data-client.js";

export default class Services {
  constructor() {
    this.userId = localStorage.getItem("user");
    this.quedBookmark = localStorage.getItem("quedBookmark");
    this.quedJobApplication = localStorage.getItem("quedJobApplication");
    this.role = localStorage.getItem("role");

    if (this.userId && this.quedBookmark) {
      this.bookmarkJob(this.quedBookmark);
      localStorage.removeItem("quedBookmark");
      location.href = localStorage.getItem("returnLocation");
      return;
    }

    if (this.userId && this.quedJobApplication) {
      localStorage.removeItem("quedJobApplication");
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

  async getEmployersJobs(employerId) {
    let employersJobsClient;
    if (employer) {
      employersJobsClient = new DataClient("jobs?employerId=" + employerId);
    } else {
      employersJobsClient = new DataClient("jobs?employerId=" + this.userId);
    }

    const employersJobs = await employersJobsClient.listAll();

    return employersJobs;
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
      localStorage.setItem("quedJobApplication", id);
      localStorage.setItem("returnLocation", "/pages/jobs/job-application-form.html?id=" + id);
      location.href = "/pages/users/login.html";
      return;
    }

    location.href = "/pages/jobs/job-application-form.html?id=" + id;
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

  async getEmployeeApplications(user) {
    const applicationsClient = new DataClient("jobApplications?employeeId=" + user.id);
    const applications = await applicationsClient.listAll();

    const jobsClient = new DataClient("jobs");
    const jobs = await jobsClient.listAll();

    const employersClient = new DataClient("users");
    const employers = await employersClient.listAll();

    let employeeApplications;
    return applications.map((app) => {
      const job = jobs.find((job) => job.id === app.jobId);

      const employer = employers.find((emp) => emp.id === job.employerId);
      console.log(employer);

      return {
        application: app,
        job: job,
        employer: employer,
      };
    });
  }

  async getEmployerApplications(user) {
    const jobsClient = new DataClient("jobs?employerId=" + user.id);
    const jobs = await jobsClient.listAll();
    console.log(jobs);

    const applicationsClient = new DataClient("jobApplications");
    const applications = await applicationsClient.listAll();
    console.log(applications);

    const employeesClient = new DataClient("users");
    const employees = await employeesClient.listAll();
    console.log(employees);

    return jobs.map((job) => {
      const jobApplications = applications
        .filter((app) => app.jobId === job.id)
        .map((app) => {
          const employee = employees.find((emp) => emp.id === app.employeeId);

          return {
            application: app,
            employee: employee,
          };
        });

      return {
        job: job,
        applications: jobApplications,
      };
    });
  }

  handleButtons() {
    const applyButton = document.querySelector(".apply");
    if (applyButton) {
      applyButton.addEventListener("click", async (e) => {
        this.applyJob(e.currentTarget.id);
      });
    }

    const bookmarkButtons = document.querySelectorAll(".fa-bookmark");

    if (bookmarkButtons) {
      bookmarkButtons.forEach((icon) => {
        const button = icon.parentElement;
        if (this.role === "employer") {
          button.style.display = "none";
        }

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
}
