import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.gitUrl = "https://github.com/Goaty-yagi";
    this.linkedinUrl =
      "https://www.linkedin.com/in/nobuhiro-funahashi-1b725322b/";
  }

  async renderHTML() {
    return `
      <footer>
        <div class="creater-section">
          <div class="creater-title-container">
            <div class="creater-title">Who Built App?</div>
          </div>
          <div class="footer-font-container">
            <i class="fab fa-github-square font-hover"></i>
            <i class="fab fa-linkedin font-hover"></i>
          </div>
        </div>
      </footer>
    `;
  }

  async beforeInitialRender() {}
  async initialEvent() {
    document
      .querySelector(".fa-github-square")
      .addEventListener("click", () => {
        window.open(this.gitUrl);
      });
    document.querySelector(".fa-linkedin").addEventListener("click", () => {
      window.open(this.linkedinUrl);
    });
  }
}
