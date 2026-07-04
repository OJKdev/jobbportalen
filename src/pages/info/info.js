import Header from "../../utilities/header.js";
import Footer from "../../utilities/footer.js";

const initApp = () => {
  new Header();
  new Footer();
  renderAside();
};

const renderAside = () => {
  const asideHtml = /*html*/ `
    <ul>
         <li><a href="/pages/info/about.html">Om oss</a></li>
        <li><a href="/pages/info/privacy.html">Integritetspolicy</a></li>
        <li><a href="/pages/info/terms.html">Användarvillkor</a></li>
         <li><a href="/pages/info/contact.html">Kontakt</a></li>
    </ul>
  `;

  document.querySelector("aside").insertAdjacentHTML("afterbegin", asideHtml);
};

initApp();
