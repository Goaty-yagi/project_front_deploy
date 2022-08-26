import {
  createUser,
  getUserData,
} from "../../../../firebase/authentication.js";
import { setSessionStorage } from "../store/index.js";
import AbstractView from "./AbstractView.js";
import PopupNotification from "./PopupNotification.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Signup");
    this.score = document.location.search.substring(1).split("=")[1];
    this.app = document.querySelector("#app");
    this.url = "http://localhost:5000";
    this.userPath = "/api/user";
    this.scorePath = "/api/score";
    this.userEndpoint = this.url + this.userPath;
    this.scoreEndpoint = this.url + this.scorePath;
    this.formError = [];
    this.inputValues;
    this.mainNode;
    this.submitButton;
    this.callback = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return e;
    };
  }
  async renderHTML() {
    //async return HTML might be asynchronous
    const compoTitle = "Signup";
    return `
      <div class="signup-wrapper">
        <div class="compo-title">${compoTitle}
        </div>
        <form onsubmit="return false" class="signup-form">
          <div class="signup-text">Username</div>
          <input class="form-input" required type="text" name="text" aria-label="username" value="">
          <div class="signup-text">E-MAIL</div>
          <input class="form-input" required type="mail" name="text" aria-label="mail" value="">
          <div class="signup-text">Password</div>
          <input class="form-input" required type="password" name="text" aria-label="password" value="">
          <button class="signup-submit-button" aria-label="Signup">Signup</button>
        </form>
      </div>
    `;
  }

  initialEvent() {
    this.submitButton = document.querySelector(".signup-submit-button");
    this.submitButton.addEventListener("click", (e) =>
      this.signupUser(e, this.scoreEndpoint)
    );
    this.mainNode = document.querySelector(".signup-wrapper");
    this.app.style.display = "initial";
    this.beforeunload(this.callback);
  }

  _checkForm(inputValues) {
    for (let i = 0; i < inputValues.length; i++) {
      if (!inputValues[i].value) {
        this.formError.push(`${inputValues[i].ariaLabel} is empty.`);
      }
    }
    if (this.formError.length) {
      return false;
    } else {
      return true;
    }
  }

  async signupUser(e) {
    e.preventDefault();
    this.submitButton.setAttribute("disabled", true);
    this.inputValues = document.querySelectorAll(".form-input");
    const formCheck = this._checkForm(this.inputValues);
    const user = {
      username: this.inputValues[0].value,
      email: this.inputValues[1].value,
      password: this.inputValues[2].value,
    };
    if (formCheck) {
      createUser(user)
        .then((e) => {
          const userData = getUserData();
          user["uid"] = userData.UID;
          fetch(this.scoreEndpoint, {
            method: "POST",
            body: JSON.stringify({
              UUID: user.uid,
              username: user.username,
              quiz_type: "js",
              score: this.score,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        })
        .then(async () => {
          await fetch(this.userEndpoint, {
            method: "POST",
            body: JSON.stringify({
              UUID: user.uid,
              user: user.username,
              mail: user.email,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          setSessionStorage("currentScore", this.score);
          window.removeEventListener("beforeunload", this.callback, true);
        })
        .then(() => history.go())
        .catch((e) => {
          this.formError.push(e.errorCode);
          this.errorHandler();
        });
    } else {
      const title = "ERROR OCCURRED";
      const color = "error";
      const notify = new PopupNotification(
        this.formError,
        title,
        this.mainNode,
        color
      );
      await notify.initialEvent();
      this.submitButton.disabled = false;
    }
    this.formError = [];
  }
  async errorHandler() {
    const title = "ERROR OCCURRED";
    const color = "error";
    const notify = new PopupNotification(
      this.formError,
      title,
      this.mainNode,
      color
    );
    await notify.initialEvent();
    this.submitButton.disabled = false;
    this.formError = [];
  }

  confirmAlert() {
    window.confirm(`
        Do you really want to leave?
        Your data will be brocken.`);
  }
}
