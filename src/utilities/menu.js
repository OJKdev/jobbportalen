export default class Navbar {
  constructor() {
    const navbar = this.#createNavbar();
    document.querySelector("header").insertAdjacentHTML("afterbegin", navbar);
  }

  #createNavbar() {
    return /*html*/ `
        <nav>
            <ul>
            <li class="logo">
                
                <a href="/">
                <img src="/assets/images/praktiseaLogo.png" alt="logotype" />
            
            <span id="logo-text">JobbPortalen</span></a>
          
            </li>
            <li class="toggle">
                <input type="checkbox" id="menu-btn" class="menu-btn" />
                <label for="menu-btn" class="menu-icon">
                <span class="nav-icon"></span>
                </label>
            </li>
            
            <li class="menu-item">
                <a href="/pages/jobs/jobs.html">Lediga jobb</a>
            </li>
            <li class="menu-item">
                <a href="/pages/about/about.html">Om oss</a>
            </li>
            <li class="menu-item">
                <a href="/pages/about/about.html">Kontakt</a>
            </li>
            
            <li class="menu-item">
                <a href="/pages/users/profile.html"><i class="fa-light fa-circle-user"></i></a>
            </li>
            </ul>
        </nav>`;
  }
}
