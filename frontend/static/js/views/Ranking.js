import {
  getUserData,
  getUserLogin,
} from "../../../../firebase/authentication.js";
import { getSessionItem } from "../store/index.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.scoreData;
    this.userData = getUserData();
    this.userLogin = getUserLogin();
    this.rankingContainer = document.createElement("div");
    this.rankingContainer.className = "rank-section";
    this.rankWrapper = document.createElement("div");
    this.rankWrapper.className = "rank-wrapper";
    this.rankingContainer.append(this.rankWrapper);
    // this.setTitle(" Ranking")
  }

  async renderHTML() {
    this.scoreData = await this.fetchData();
    this.rankWrapper.innerHTML += "<h1>RANKING</h1>";
    let userStyleClass;
    if (this.userLogin) {
      const username = this.userData.name;
      const currentScore = getSessionItem("currentScore");
      const welcome = `
        <div class="welcome-container">
          <div>WELCOME ${username}!</div>
            <div>Your Max Score is ${currentScore}</div>
          </div>
        </div>
      `;

      this.rankWrapper.innerHTML += welcome;
    }
    this.scoreData.forEach((elem, index) => {
      if (elem.UUID === this.userData.UID) {
        userStyleClass = "rank-name rank-user";
      } else {
        userStyleClass = "rank-name";
      }
      let awardFont;
      if (index + 1 === 1) {
        awardFont = `
          <i class="fas fa-crown rank-font">
            <div class="rank-order">${index + 1}
            </div>
          </i>
      `;
      } else if (index + 1 === 2) {
        awardFont = `
          <i class="fas fa-award second-award rank-font">
            <div class="rank-order second-third">${index + 1}
            </div>
          </i>
        `;
      } else if (index + 1 === 3) {
        awardFont = `
          <i class="fas fa-award third-award rank-font">
            <div class="rank-order second-third">${index + 1}
            </div>
          </i>
        `;
      } else {
        awardFont = `
          <div class="rank-font">
            <div class="rank-order">${index + 1}
          </div></div>
        `;
      }
      this.rankWrapper.innerHTML += `
        <section class="each-ranking-container">
          <div class="rank">${awardFont}</div>
          <div class="${userStyleClass}">${elem.username}</div>
          <div class="score">${elem.score}</div>
        </section>
        `;
    });
    return this.rankingContainer;
  }

  initialEvent() {
    this.showAppNode();
  }

  async beforeInitialRender() {
    this.hideAppNode();
  }

  async getScoreData() {
    return fetch(this.endpoint)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        return data;
      });
  }

  async fetchData() {
    const url = "http://localhost:5000";
    const path = "/api/score";
    const params = "/type=js";
    const endpoint = url + path + params;
    return fetch(endpoint)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        return data;
      });
  }
}
