import Header from "./utilities/header.js";
import JobList from "./utilities/jobList.js";
import DataClient from "./utilities/data-client.js";
import SearchBar from "./utilities/searchbar.js";
import Footer from "./utilities/footer.js";

const initApp = async () => {
  new Header();
  new SearchBar();
  new Footer();
};

initApp();
