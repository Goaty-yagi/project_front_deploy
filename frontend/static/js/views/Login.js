import { login } from "../../../../firebase/authentication.js";
import AbstractView from "./AbstractView.js";
import PopupNotification from "./PopupNotification.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.app = document.querySelector("#app");
    this.formError = [];
    this.mainNode;
    this.setTitle("Login");
  }

  async renderHTML() {
    //async return HTML might be asynchronous
    const compoTitle = "Login";
    return `
      <div class="signup-wrapper">
        <div class="compo-title">${compoTitle}</div>
        <div class="user-notification">
          <div class="login-notify-container">
            <div class="login-notify-text">To access Dashboard,
            login as authenticated user who allowed
            to do CRUD methods. otherwise enjoy with your own account:)
            </div>
            <div class="login-notify-email">E-main: nokehaauth_user@f5.si</div>
            <div class="login-notify-pass">Password: kokokoko</div>
          </div>
        </div>
        <form onsubmit="return false" class="signup-form">
          <div class="signup-text">E-MAIL</div>
          <input class="form-input" type="mail" name="text" aria-label="mail" value="">
          <div class="signup-text">Password</div>
          <input class="form-input" type="password" name="text" aria-label="password" value="">
          <button class="signup-submit-button" aria-label="Signup">Signup</button>
        </form>
      </div>
        `;
  }

  initialEvent() {
    this.submitButton = document.querySelector(".signup-submit-button");
    this.submitButton.addEventListener("click", (e) => this.loginUser(e));
    this.mainNode = document.querySelector(".signup-wrapper");
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

  async loginUser(e) {
    const inputValues = document.querySelectorAll(".form-input");
    e.preventDefault();
    this.submitButton.setAttribute("disabled", true);
    const user = {
      email: inputValues[0].value,
      password: inputValues[1].value,
    };
    const formCheck = this._checkForm(inputValues);
    if (formCheck) {
      login(user)
        .then(() => {
          history.go();
        })
        .catch((e) => {
          this.formError.push(e.errorCode);
          this.errorHandler();
        });
    } else {
      this.errorHandler();
    }
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
}
