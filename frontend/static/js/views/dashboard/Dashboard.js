import AbstractView from "../AbstractView.js";
import AllQuestions from "./AllQuestions.js";
import QuizCreate from "./QuizCreate.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.dashboardContainer;
    this.headerMenues;
    this.currentMenu = "";
    this.setTitle("Dashboard");
  }

  async renderHTML() {
    return `
          <div class="dashboard-header">
            <p class="dashboard-header-menu Create">Create</p>
            <p class="dashboard-header-menu AllQuestions">AllQuestions</p>
          </div>
          <main class="dashboard-container"></main>
        `;
  }

  async initialEvent() {
    app.style.display = "initial";
    this.dashboardContainer = document.querySelector(".dashboard-container");
    this.headerMenues = document.querySelectorAll(".dashboard-header-menu");
    for (let i = 0; i < this.headerMenues.length; i++) {
      this.headerMenues[i].addEventListener("click", (e) => {
        this.boardControle(e);
      });
    }
    this.createQuestions();
    this.handleCurrentMenu("Create");
  }

  boardControle(e) {
    const menuItem = e.target.innerHTML;
    this.currentMenu = menuItem;
    this.handleCurrentMenu(menuItem);
    switch (menuItem) {
      case "AllQuestions":
        this.allQuestions();
        break;
      case "Create":
        this.createQuestions();
        break;
    }
  }

  async allQuestions() {
    const instance = new AllQuestions();
    this.dashboardContainer.innerHTML = await instance.renderHTML();
    instance.initialEvent();
  }

  async createQuestions() {
    const instance = new QuizCreate();
    this.dashboardContainer.innerHTML = await instance.renderHTML();
    instance.initialEvent();
  }
  
  handleCurrentMenu(menuItem) {
    for (let i = 0; i < this.headerMenues.length; i++) {
      let eachTarget = this.headerMenues[i];
      eachTarget.classList.remove("selected-menu");
      eachTarget.style.pointerEvents = "";
    }
    const targetMenu = document.querySelector(`.${menuItem}`);
    targetMenu.classList.add("selected-menu");
    targetMenu.style.pointerEvents = "none";
  }
}
