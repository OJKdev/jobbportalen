export default class JobList {
  constructor(element, selectedJobs, bookMarkedJobIds, emptyMessage) {
    this.jobs = selectedJobs;
    this.emptyMessage = emptyMessage;
    this.bookMarkedJobIds = bookMarkedJobIds;
    console.log(this.bookMarkedJobIds);

    const jobList = this.#createJobList();

    document.querySelector(element).insertAdjacentHTML("afterbegin", jobList);
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
