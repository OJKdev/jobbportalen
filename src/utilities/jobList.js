export default class JobList {
  constructor(header, element, selectedJobs, bookMarkedJobIds, emptyMessage) {
    this.header = header;
    this.jobs = selectedJobs;
    this.emptyMessage = emptyMessage;
    this.bookMarkedJobIds = bookMarkedJobIds;

    const jobList = this.#createJobList();

    document.querySelector(element).insertAdjacentHTML("afterbegin", jobList);
  }

  #createJobList() {
    let html = /*html*/ `<div id="jobs" class="tab active">
      <h2>${this.header}</h2>
    `;

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
      html += `</div>`;
      return html;
    } else {
      return (html += /*html*/ `<p>${this.emptyMessage}</p></div>`);
    }
  }

  #shortDescription(text) {
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  }
}
