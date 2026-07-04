export default class Footer {
  constructor() {
    this.role = localStorage.getItem("role");
    const footer = this.#createFooter();
    document.querySelector("footer").insertAdjacentHTML("afterbegin", footer);
  }

  #createFooter() {
    return /*html*/ `
  <section class="footer-content">
     <section>
     <a href="/"> <img class="logotype" src="/assets/images/praktiseaLogo.png" alt="Jobbportalen logotyp" />
      <h5>Jobbportalen</h5></a>
    </section>
   

    <nav aria-label="Footer">
      <ul>
        <li><a href="/pages/info/about.html">Om oss</a></li>
        <li><a href="/pages/info/privacy.html">Integritetspolicy</a></li>
        <li><a href="/pages/info/terms.html">Användarvillkor</a></li>
        <li><a href="/pages/info/contact.html">Kontakt</a></li>
      </ul>
    </nav>
    
    <p>&copy; 2026 Jobbportalen</p>
  </section>`;
  }
}
