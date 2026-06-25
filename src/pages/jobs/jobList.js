export default class JobList {
  constructor(element, jobs, bookMarkedJobIds, emptyMessage, actions = {}) {
    this.jobs = jobs;
    this.emptyMessage = emptyMessage;
    this.actions = actions;
    this.bookMarkedJobIds = bookMarkedJobIds;
    console.log(this.bookMarkedJobIds);

    const jobList = this.#createJobList();

    document.querySelector(element).insertAdjacentHTML("afterbegin", jobList);

    // this.handleSaveButton();
  }

  handleSaveButton() {
    const buttons = document.querySelectorAll(".fa-bookmark");

    buttons.forEach((icon) => {
      const button = icon.parentElement;

      button.addEventListener("click", async (e) => {
        if (icon.classList.contains("fa-regular")) {
          await this.handleSaveJob(e);

          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        } else {
          await this.handleDiscardJob(e);

          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
      });
    });
  }

  handleSaveJob(e) {
    const id = e.target.parentElement.getAttribute("id");
    this.actions.onSave(id);
  }
  handleDiscardJob(e) {
    const id = e.target.parentElement.getAttribute("id");
    this.actions.onDiscard(id);
  }

  #createJobList() {
    let html = "";

    if (this.jobs && this.jobs.length > 0) {
      this.jobs.map(
        (job) =>
          (html += /*html*/ ` <section class="job">
              <a href="/pages/jobs/job-details.html?id=${job.id}">
                <img class="thumbnail" src="/assets/images/logos/${job.iamgeFileName}" alt="${job.title}" />
                <section>
                  <h3>${job.title}</h3>
                  <p class="description">
                    ${job.description}
                  </p>
                </section>
              </a>

             <button id="${job.id}"><i class="${this.bookMarkedJobIds.includes(job.id) ? "fa-solid" : "fa-regular"} fa-bookmark"></i></button>
 
            </section>
            
  `),
      );

      return html;
    } else {
      return /*html*/ `<p>${this.emptyMessage}</p>`;
      console.log(this.emptyMessage);
    }
  }

  #shortDescription(text) {
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  }
}
