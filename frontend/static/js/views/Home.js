import AbstractView from "./AbstractView.js";
import Footer from "./Footer.js";
import Ranking from "./Ranking.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.app = document.querySelector("#app");
    this.ranking;
    this.footer;
    this.setTitle("Home");
  }

  async renderHTML() {
    const title = "Quiz Ranking Dojo";
    const quizType = "Java script";
    const description = "Test your knowledge and Beat your rivals!";
    return `
      <main id="main">
        <div class="main-container">
          <div class="home-each-section">
            <h1 class="home-title">${title}</h1>
            <h2 class="quiz-type">${quizType}</h2>
            <p>${description}</p>
            <button class="start-button" target-url="/quiz">START</button>
          </div>
          <div class="home-each-section-fa-cog">
            <i class="fas fa-cog big-cog"></i>
            <div class="small-cogs">
              <i class="fas fa-cog small-cog"></i>
              <i class="fas fa-cog small-cog"></i>
            </div
          </div>
        </div>
        </div>
        <div class="second-hero">
          <div class="second-hero-flex">
            <i class="fas fa-pencil-alt"></i>
            <div class="second-hero-flex-right">
              <p class="study-home"> Study To Get More Score?</p>
              <p class="go-study" target-url="/study"> Go STUDY =></p>
            </div>
          </div>
          <div class="rank-in-home"></div>
        </div>
      </main>
        `;
  }

  async beforeInitialRender() {
    this.footer = new Footer();
    this.ranking = new Ranking();
    this.hideAppNode();
  }

  async initialEvent() {
    document
      .querySelector(".start-button")
      .addEventListener("click", this.event);
    document
      .querySelector(".rank-in-home")
      .append(await this.ranking.renderHTML());
    this.app.innerHTML += await this.footer.renderHTML();
    this.footer.initialEvent();
    this.showAppNode();
  }
}
