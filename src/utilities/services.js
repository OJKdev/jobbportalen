import DataClient from "./data-client.js";

export default class Services {
  constructor() {
    this.userId = localStorage.getItem("user");
    this.role = localStorage.getItem("role");
    this.quedBookmark = localStorage.getItem("quedBookmark");
    this.quedJobApplication = localStorage.getItem("quedJobApplication");

    this.handleLoginRedirection();
  }

  handleLoginRedirection() {
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
    const client = new DataClient("bookmarkedJobs");
    await client.add({
      userId: this.userId,
      jobId: jobId,
    });
  }

  async unBookmarkJob(jobId) {
    const client = new DataClient("bookmarkedJobs");
    const bookmarkedJobs = await client.listAll();
    const jobToUnBookmark = bookmarkedJobs.find((job) => job.jobId === jobId);
    await client.removeById(jobToUnBookmark.id);
  }

  async getBookmarkedJobs() {
    const bookmarkedJobsClient = new DataClient("bookmarkedJobs?userId=" + this.userId);

    const bookmarkedJobs = await bookmarkedJobsClient.listAll();
    const bookmarkedjobIds = bookmarkedJobs.map((item) => item.jobId);

    const jobsClient = new DataClient("jobs");
    const jobs = await jobsClient.listAll();

    return jobs.filter((job) => bookmarkedjobIds.includes(job.id));
  }

  async getBookmarkedJobIds() {
    const bookmarkedJobs = await this.getBookmarkedJobs();
    const jobIds = bookmarkedJobs.map((item) => item.id);
    return jobIds;
  }

  async getEmployersJobs(employerId) {
    const employersJobsClient = new DataClient("jobs?employerId=" + employerId);

    const employersJobs = await employersJobsClient.listAll();

    return employersJobs;
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

    return applications.map((app) => {
      const job = jobs.find((job) => job.id === app.jobId);

      const employer = employers.find((emp) => emp.id === job.employerId);
      if (!employer) {
        return null;
      }

      return {
        application: app,
        job: job,
        employer: employer,
      };
    });
  }

  async getEmployerJobs(user) {
    const jobsClient = new DataClient("jobs?employerId=" + user.id);
    const jobs = await jobsClient.listAll();

    const applicationsClient = new DataClient("jobApplications");
    const applications = await applicationsClient.listAll();

    const employeesClient = new DataClient("users");
    const employees = await employeesClient.listAll();

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

  getEmployersApplications(jobs) {
    const incomingApplications = jobs.flatMap((item) => {
      return item.applications.map((app) => {
        return {
          job: item.job,
          application: app.application,
          employee: app.employee,
        };
      });
    });
    return incomingApplications;
  }

  showMessage(message, type) {
    const msg = document.querySelector(".message");
    msg.innerHTML = "";
    msg.insertAdjacentHTML("afterbegin", message);
    msg.classList.add(type);
    msg.style.display = "block";
  }

  handleButtons() {
    const applyButton = document.querySelector(".apply");
    if (applyButton) {
      if (this.role === "employer") {
        applyButton.style.display = "none";
      } else {
        applyButton.addEventListener("click", async (e) => {
          this.applyJob(e.currentTarget.id);
        });
      }
    }

    const bookmarkButtons = document.querySelectorAll(".fa-bookmark");

    if (bookmarkButtons) {
      bookmarkButtons.forEach((icon) => {
        const button = icon.parentElement;
        if (this.role === "employer") {
          button.style.display = "none";
          return;
        }

        button.addEventListener("click", async () => {
          const id = button.id;

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
