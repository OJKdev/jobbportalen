export default class SearchBar {
  constructor() {
    const searchbar = this.#createSearchBar();
    document.querySelector(".searchbar").insertAdjacentHTML("afterbegin", searchbar);

    const form = document.querySelector("form");
    form.addEventListener("submit", this.handleSearch.bind(this));
  }

  #createSearchBar() {
    const html = /*html*/ `<i class="fa-solid fa-magnifying-glass"></i>
          <form>
            <input type="text" name="search" id="search" />
            <label for="search">Sök jobb...</label>

            <button class="btn btn-rounded btn-search">Sök</button>
          </form>`;

    return html;
  }

  hasSearchParams() {
    const search = location.search.split("search=")[1];

    return search;
  }

  async handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    location.href = `/pages/jobs/jobs.html?search=${data.search}`;
  }
}
