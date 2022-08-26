import AbstractView from "../AbstractView.js";
import PopupNotification from "../PopupNotification.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.createSection;
    this.questions;
    this.selecterWindowContainer;
    this.createButton;
    this.chosenTags = [];
    this.formError = [];
    this.windowIsOpen = false;
    this.selectChosen;
    this.tagsArray = [
      "General",
      "Git",
      "GitHub",
      "Internet",
      "Node",
      "Protocol",
      "HTTP",
      "Front-End",
      "Programming",
      "JavaScript",
      "Browser",
      "DOM",
      "Higher-Order Functions",
      "Events",
      "Functional",
    ];
  }

  async renderHTML() {
    
    return `
      <h1 class="dashboard-title">CREATE QUESTION</h1>
      <section class="create-section">
        <form class="create-form" onsubmit="return false" id="form">
          <div>TERM</div>
          <input class="text-input" type="text" name="text" aria-label="term" value="">
          <div>Description</div>
          <input class="text-input" type="text" name="text" aria-label="description" value="">
          <div>CLASS</div>
          <input class="text-input" type="number" min="1" max="8" name="number" aria-label="class" value="">
          <div class="create-select-text">
            <div>TAGS</div>
            <div class="selecter-box">Choose tags <i class="fas fa-angle-down"></i></div>
            <div class="selecter-window-container"></div>
            <div class="select-chosen"></div>
          </div>
          <div class="create-button-container">
          <button class="create-submit-button"  aria-label="submit">CREATE</button>
          </div>
        </form>
      </section>
      `;
  }

  initialEvent() {
    app.style.display = "initial";
    this.selecterWindowContainer = document.querySelector(
      ".selecter-window-container"
    );
    this.createSection = document.querySelector(".create-section");
    this.createButton = document.querySelector(".create-submit-button");
    this.createButton.addEventListener("click", () => {
      this.createQuestion();
    });
    this._selectorEvent();
  }

  _selectorEvent() {
    const selecterBox = document.querySelector(".selecter-box");
    const selecterWindow = document.createElement("div");
    selecterWindow.className = "select-window";
    selecterBox.addEventListener("click", () => {
      if (!this.windowIsOpen) {
        selecterWindow.innerHTML = "";
        for (let i = 0; i < this.tagsArray.length; i++) {
          let tagChild = document.createElement("div");
          tagChild.className = `${this.tagsArray[i]} each-tag-in-window`
          tagChild.innerHTML = `${this.tagsArray[i]}`;
          selecterWindow.appendChild(tagChild);
          tagChild.addEventListener("click", chosenEvent);
          this.selecterWindowContainer.append(selecterWindow);
          this.windowIsOpen = true;
        }
      } else {
        this.selecterWindowContainer.innerHTML = "";
        this.windowIsOpen = false;
      }
    });

    const chosenEvent = (e) => {
      const chosenTag = e.target.classList[0];
      this.selectChosen = document.querySelector(".select-chosen");
      if (this.chosenTags.includes(chosenTag)) {
        //delete
        this.chosenTags = this.chosenTags.filter((tag) => {
          // tag.match(`/${chosenTag}/`) === null
          return tag !== chosenTag;
        });
        for (let i = 0; i < this.selectChosen.children.length; i++) {
          if (this.selectChosen.children[i].getAttribute("name") === chosenTag) {
            const child = document.querySelector(`[name = ${chosenTag}]`);
            this.selectChosen.removeChild(child);
          }
          this.windowIsOpen = false;
          this.selecterWindowContainer.innerHTML = "";
        }
      } else {
        this.chosenTags.push(chosenTag);
        this.selectChosen.innerHTML += `
          <div class="chosen-tag ${chosenTag}" name="${chosenTag}">
            <div class="tag-name">${chosenTag}</div>
            <div class="delete-tag-container">
              <i class="${chosenTag} fas fa-times delete-tag"></i>
            </div>
          </div>`;
        this.windowIsOpen = false;
        this.selecterWindowContainer.innerHTML = "";
        const deleteElemens = document.querySelectorAll(".delete-tag")
        for (let i = 0; i < deleteElemens.length; i ++) {
          deleteElemens[i].addEventListener("click", (e) => chosenEvent(e))
        }
      }
    };
  }

  _checkForm(inputValues) {
    for (let i = 0; i < inputValues.length; i++) {
      if (!inputValues[i].value) {
        this.formError.push(`${inputValues[i].ariaLabel} is empty.`);
      }
    }
    if (!this.chosenTags.length) {
      this.formError.push(`tag is empty.`);
    }
    if (this.formError.length) {
      return false;
    } else {
      return true;
    }
  }

  async createQuestion() {
    const inputValues = document.querySelectorAll(".text-input");
    const formCheck = this._checkForm(inputValues);
    const url = "http://localhost:5000";
    const path = "/api/quiz/js";
    const endpoint = url + path;
    if (formCheck) {
      this.createButton.setAttribute("disabled", true);
      const term = inputValues[0].value;
      const description = inputValues[1].value;
      const classNum = inputValues[2].value;
      const tags = this.chosenTags.join();
      await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          term: term,
          class: classNum,
          description: description,
          tags: tags,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          const notify = new PopupNotification(
            [],
            "CREAED",
            this.createSection,
            "success"
          );
          notify.initialEvent();
          this.createButton.disabled = false;
          for (let i = 0; i < inputValues.length; i++) {
            inputValues[i].value = "";
          }
          this.chosenTags = [];
          this.selectChosen.innerHTML = "";
        })
        .catch((e) => console.log(e));
    } else {
      const title = "ERROR OCCURRED";
      const color = "error";
      const notify = new PopupNotification(
        this.formError,
        title,
        this.createSection,
        color
      );
      notify.initialEvent();
      this.createButton.disabled = false;
    }
    this.formError = [];
  }

  async deleteEvent(id) {
    await fetch(`http://localhost:5000/api/${id}`, {
      method: "DELETE",
    });
  }
}
