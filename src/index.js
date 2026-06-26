import Navbar from "./utilities/menu.js";
import JobList from "./utilities/jobList.js";
import DataClient from "./utilities/data-client.js";
import SearchBar from "./utilities/searchbar.js";

const initApp = async () => {
  new Navbar();
  new SearchBar();
};

initApp();
