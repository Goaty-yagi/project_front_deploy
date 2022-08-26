import AbstractView from "../AbstractView.js";
import PopupNotification from "../PopupNotification.js";

AbstractView;
export default class extends AbstractView {
  constructor() {
    super();
    this.apiData;
    this.tags;
    this.currentDataExist = false;
    this.currentDom = [];
    this.currentData = {
      text: "",
      class: "",
      tags: [],
    };
    this.keysArray;
    this.container;
    this.num;
    this.text;
    this.options;
    this.mainNode;
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
    this.chosenTags = [];
    this.selecterWindowContainer;
    this.selectChosen;
    this.editButton;
    this.formError = [];
    this.patchElement;
    this.questionId;
    this.inputValues;
    this.id;
  }
  async renderHTML() {
    return `
        <section class="study-section">
        <h1 class="dashboard-title">All Questions</h1>
        <form class="study-form" onsubmit="return false" name="form">
          <main class="study-main">
            <div aria-label="select tags" class="checkbox-container">
            </div>
            <div class="search-container">
              <div class="study-font-container">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="select-text">
                <select  name="select" >
                  <option class="select-class" value="">select class</option>
                </select>
                  <input class="text-input" type="text" name="text" aria-label="search" value="" placeholder="type for searching">
              </div>
            </div>
          </main>
        </form>
        <div class="num-items-container"></div>
        <div class="result-container"></div>
        </section>       
        `;
  }
  async initialEvent() {
    const app = document.querySelector("#app");
    this.mainNode = document.querySelector(".study-section");
    app.style.display = "initial";

    await this.fetchQuizData().then(() => {
      this.getClassOption();
      this.tags = this.getSelectOption();
      this.keysArray = Object.keys(this.apiData[0]);
      delete this.keysArray[0]; //delete UUID
      this.container = document.querySelector(".result-container");
      this.num = document.querySelector(".num-items-container");
      this.text = document.querySelector(".text-input");
      this.text.addEventListener("change", (e) => this.firstSearch(e));
      this.options = document.querySelector("select");
      this.options.addEventListener("change", (e) => this.firstSearch(e));
      this.allChecks = document.querySelectorAll(".check");
      for (let i = 0; i < this.allChecks.length; i++) {
        this.allChecks[i].addEventListener("change", (e) =>
          this.firstSearch(e)
        );
      }
    });
  }
  async fetchQuizData() {
    const url = "http://localhost:5000";
    const path = "/api/quiz/js";
    const endpoint = url + path;
    await fetch(endpoint)
      .then((result) => {
        return result.json();
      })
      .then((data) => (this.apiData = data))
      .catch((e) => {
        console.log("ERR", e);
      });
  }

  getSelectOption() {
    let set = new Set();
    for (let i = 0; i <= this.apiData.length - 1; i++) {
      let tagsArray = this.tagsStringToArray(this.apiData[i]);
      tagsArray.forEach((elem) => {
        set.add(elem);
      });
    }
    let ckeckBoxContainer = document.querySelector(".checkbox-container");
    set.forEach((elem) => {
      ckeckBoxContainer.innerHTML += `<div class='each-tag'>
            <input class="check" name="check" id=${elem} type="checkbox">
            <label for=${elem}>${elem}</label>
            </div>`;
    });
    return Array.from(set);
  }

  getClassOption() {
    let set = new Set();
    for (let i = 0; i <= this.apiData.length - 1; i++) {
      set.add(this.apiData[i].class);
    }
    let select = document.querySelector("select");
    set.forEach((elem) => {
      select.innerHTML += `<option class="option" id=${elem} value=${elem}>${elem}</option>`;
    });
  }

  firstSearch(e) {
    let arrayForResult = [];
    let set = new Set();
    let gs = this.apiData;

    const textSearch = (value, array = []) => {
      if (array.length) {
        gs = array;
      }
      for (let i = 0; i <= gs.length - 1; i++) {
        Object.values(gs[i]).forEach((elem) => {
          if (Array.isArray(elem)) {
            elem.forEach((e) => {
              if (e.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                set.add(gs[i]);
              }
            });
          } else if (typeof elem != "number") {
            if (elem.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
              set.add(gs[i]);
            }
          } else {
            if (elem == value) {
              set.add(gs[i]);
            }
          }
        });
      }
      this.currentData.text = value;
      return Array.from(set);
    };

    const classSearch = (value, array = []) => {
      if (value) {
        if (array.length) {
          gs = array;
        }
        for (let i = 0; i <= gs.length - 1; i++) {
          if (gs[i].class == value) {
            set.add(gs[i]);
          }
        }
        this.currentData.class = value;
        return Array.from(set);
      } else {
        this.checkCurrentItem();
        return [];
      }
    };

    const tagSearch = () => {
      for (let i = 0; i <= gs.length - 1; i++) {
        Object.keys(gs[i]).forEach((elem) => {
          if (elem === "tags") {
            let tagArray = this.tagsStringToArray(gs[i]);
            tagArray.forEach((e) => {
              this.currentData.tags.forEach((t) => {
                if (e.indexOf(t) !== -1) {
                  set.add(gs[i]);
                }
              });
            });
          }
        });
      }
      return Array.from(set);
    };

    const centerSearch = (event) => {
      let baseArrayForSearch = [];
      let textEmpty = false; //for bag solution

      if (event.target.type == "text") {
        this.currentData.text = event.target.value;
      } else if (event.target.type == "select-one") {
        this.currentData.class = event.target.value;
      } else if (event.target.type == "checkbox") {
        if (event.target.checked) {
          this.currentData.tags.push(event.target.id);
        } else {
          this.currentData.tags.forEach((e) => {
            if (e == event.target.id) {
              this.currentData.tags = this.currentData.tags.filter(
                (t) => t != e
              );
            }
          });
        }
      }
      if (this.currentData.tags.length) {
        baseArrayForSearch = tagSearch();
      } else if (this.currentData.class) {
        baseArrayForSearch = classSearch(this.currentData.class);
      }
      if (this.currentData.tags.length) {
        Object.keys(this.currentData).forEach((key) => {
          set = new Set();
          if (key == "class") {
            if (this.currentData.class) {
              baseArrayForSearch = classSearch(
                this.currentData.class,
                baseArrayForSearch
              );
            }
          } else if (key == "text") {
            if (this.currentData.text) {
              baseArrayForSearch = textSearch(
                this.currentData.text,
                baseArrayForSearch
              );
              // bag occur here
              // whenever class and tags selected, then put text.
              // when textSearch return empty array, baseArrayForSearch will have objects
              // before set
              // below is solution
              if (!baseArrayForSearch.length) {
                textEmpty = true;
              }
            }
          }
        });
      } else {
        if (!baseArrayForSearch.length) {
          baseArrayForSearch = this.apiData;
        }
        set = new Set();
        baseArrayForSearch = textSearch(
          this.currentData.text,
          baseArrayForSearch
        );
      }
      if (textEmpty) {
        baseArrayForSearch = [];
      }
      set = new Set(baseArrayForSearch);
      return Array.from(set);
    };

    // @ First Search Event Start From Here

    if (e.target.type == "checkbox") {
      let index = this.currentData.tags.indexOf(e.target.id);
      if (this.currentDataExist) {
        if (
          this.currentData.tags.length &&
          !this.currentData.text &&
          !this.currentData.class
        ) {
          if (e.target.checked) {
            this.currentData.tags.push(e.target.id);
            arrayForResult = tagSearch(e);
          } else {
            if (this.currentData.tags.length == 1) {
              this.currentData.tags = [];
              this.remove(e.target);
            } else {
              this.currentData.tags.splice(index, 1);
              arrayForResult = tagSearch(e);
            }
          }
        } else {
          arrayForResult = centerSearch(e);
        }
      } else {
        this.currentData.tags.push(e.target.id);
        arrayForResult = tagSearch(e);
      }
    } else if (e.target.type == "select-one") {
      if (this.currentDataExist) {
        if (
          this.currentData.class &&
          !this.currentData.text &&
          !this.currentData.tags.length
        ) {
          if (e.target.value) {
            arrayForResult = classSearch(e.target.value);
          } else {
            this.remove(e.target);
          }
        } else {
          arrayForResult = centerSearch(e);
        }
      } else {
        arrayForResult = classSearch(e.target.value);
      }
    } else if (e.target.type == "text") {
      if (this.currentDataExist) {
        if (
          this.currentData.text &&
          !this.currentData.class &&
          !this.currentData.tags.length
        ) {
          if (e.target.value) {
            arrayForResult = textSearch(e.target.value);
          } else {
            this.remove(e.target);
          }
        } else {
          arrayForResult = centerSearch(e);
        }
      } else {
        arrayForResult = textSearch(e.target.value);
      }
    }
    this.result(arrayForResult);
  }

  checkCurrentItem = () => {
    let counter = 0;
    Object.values(this.currentData).forEach((elem) => {
      if (Array.isArray(elem)) {
        if (elem.length) {
          this.currentDataExist = true;
          counter += 1;
        }
      } else {
        if (elem) {
          this.currentDataExist = true;
          counter += 1;
        }
      }
    });
    if (counter == 0) {
      this.currentDataExist = false;
      this.num.innerHTML = "";
    } else {
      if (!this.currentDom.length) {
        this.num.innerHTML = `<div aria-live="polite" class="no-num">no terms found</div>`;
      }
    }
    counter = 0;
  };

  result(results) {
    this.container.innerHTML = "";
    this.currentDom = [];
    if (results.length) {
      this.num.innerHTML = this.setResultNum(results.length);
      const patchButton = `<button class="edit-question">EDIT</button>`;
      results.forEach((result, index) => {
        this.currentDom.push(result);
        this.container.innerHTML += `
          <div aria-live="polite" class="each-item">
            <div id=${result.UUID} class="delete-question-container">
              <i class="fas fa-times delete-question"></i>
            </div>
          </div>`;
        let each = document.querySelectorAll(".each-item");
        this.keysArray.forEach((e) => {
          if (e !== "tags") {
            each[each.length - 1].innerHTML += `
                <div class="category">
                  <p class="title">${e}:</p>
                  <p class="value">${result[e]}</p>
                </div>`;
          } else {
            each[
              each.length - 1
            ].innerHTML += `<div class="category">
                              <p class="title">${e}:</p>
                              <div class="tags"></div>
                            </div>`;
            this.tags = document.querySelectorAll(".tags");
            let tagsArray = this.tagsStringToArray(result);
            tagsArray.forEach((t) => {
              this.tags[this.tags.length - 1].innerHTML += `<tag>${t}</tag>`;
            });
          }
        });
        each[index].innerHTML += patchButton;
        const patchDoms = document.querySelectorAll(".edit-question");
        for (let i = 0; i < patchDoms.length; i++) {
          patchDoms[i].addEventListener("click", (e) => this.patchHandler(e));
        }
      });
    } else {
      this.remove();
    }
    this.checkCurrentItem();
    this.deleteQuestion();
  }

  remove(target) {
    let allItems = document.querySelectorAll(".eachItem");
    const allRemove = () => {
      this.container.innerHTML = "";
      this.currentDom = [];
      this.num.innerHTML = "";
      console.log("ALL removed");
    };
    if (!target) {
      allRemove();
    } else {
      if (target.type == "text") {
        if (!target.value) {
          allRemove();
        } else {
          for (let i = 0; i < allItems.length; i++) {
            for (let k = 0; k < allItems[i].children.length; k++) {
              if (
                allItems[i].children[k].textContent
                  .toLowerCase()
                  .includes(currentData.text)
              ) {
                allItems[i].remove();
                this.currentDom.splice(i);
              }
            }
          }
        }
        this.currentData.text = "";
      } else if (target.type == "select-one") {
        if (!target.value) {
          allRemove();
        } else {
          for (let i = 0; i < allItems.length; i++) {
            if (allItems[i].children[1].textContent == this.currentData.class) {
              allItems[i].remove();
              this.currentDom.splice(i);
            }
          }
        }
        this.currentData.class = "";
      } else if (target.type == "checkbox") {
        for (let i = 0; i < allItems.length; i++) {
          if (allItems[i].children[3].innerHTML.includes(target.id)) {
            allItems[i].remove();
            this.currentDom.splice(i);
          }
        }
      }
      this.checkCurrentItem();
    }
  }

  tagsStringToArray(stringTag) {
    return stringTag.tags.split(",");
  }

  setResultNum(length) {
    return `
      <div aria-live="polite" class="num">${length} terms found</div>`;
  }

  // @Patch Start
  patchHandler(e) {
    this.disableScroll()
    this.id = e.target.offsetParent.firstElementChild.id; //from delete
    const question = this.apiData.find((data) => {
      return data.UUID === this.id;
    });
    this.patchElement = document.createElement("div");
    this.patchElement.className = "patch-wrapper";
    this.questionId = question.UUID;
    const term = question.term;
    const definition = question.definition;
    const classNum = question.class;
    this.chosenTags = question.tags.split(",");
    const tagselectedHTML = this.chosenTags.map((t) => {
      return `<div class="chosen-tag ${t}">${t}</div>`;
    });

    this.patchElement.innerHTML = `
      <div class="patch-container">
        <div aria-live="polite" class="edit-item">
          <div class="delete-question-container">
              <i class="fas fa-times delete-question"></i>
          </div>
        </div>
        <h1 class="title">EDIT QUESTION</h1>
        <form class="create-form" onsubmit="return false" id="form">
          <div>TERM</div>
          <input class="patch-input" type="text" name="term" aria-label="term" value=${term}>
          <div>Description</div>
          <input class="patch-input" type="text" name="description" aria-label="description" value="${definition}">
          <div>CLASS</div>
          <input class="patch-input" type="number" min="1" max="8" name="class" aria-label="class" value="${classNum}">
          <div class="create-select-text">
            <div>TAGS</div>
            <div class="selecter-box">Choose tags <i class="fas fa-angle-down"></i></div>
            <div class="selecter-window-container"></div>
            <div class="select-chosen">
            </div>
          </div>
          <div class="create-button-container">
            <button class="create-submit-button"  aria-label="submit">EDIT</button>
          </div>
        </form>
      </div>
    `;
    this.mainNode.append(this.patchElement);
    document
      .querySelector(".edit-item")
      .addEventListener("click", () => this.closeEditModal());
    this.selectChosen = document.querySelector(".select-chosen");
    tagselectedHTML.forEach((e) => {
      this.selectChosen.innerHTML += e;
    });
    this.selectChosen = document.querySelector(".select-chosen");
    this.editButton = document.querySelector(".create-submit-button");
    this.editButton.addEventListener("click", () => this.patchQuestion());
    this._selectorEvent();
  }

  _selectorEvent() {
    this.selecterWindowContainer = document.querySelector(
      ".selecter-window-container"
    );
    const selecterBox = document.querySelector(".selecter-box");
    const selecterWindow = document.createElement("div");
    selecterWindow.className = "select-window";
    selecterBox.addEventListener("click", () => {
      if (!this.windowIsOpen) {
        for (let i = 0; i < this.tagsArray.length; i++) {
          let tagChild = document.createElement("div");
          tagChild.className = "each-tag-in-window"
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
      const chosenTag = e.target.innerHTML;
      if (this.chosenTags.includes(chosenTag)) {
        //delete
        this.chosenTags = this.chosenTags.filter((tag) => {
          // tag.match(`/${chosenTag}/`) === null
          return tag !== chosenTag;
        });
        for (let i = 0; i < this.selectChosen.children.length; i++) {
          if (this.selectChosen.children[i].innerHTML === chosenTag) {
            const child = document.querySelector(`.${chosenTag}`);
            this.selectChosen.removeChild(child);
          }
          this.windowIsOpen = false;
          this.selecterWindowContainer.innerHTML = "";
        }
      } else {
        this.chosenTags.push(chosenTag);
        this.selectChosen.innerHTML += `<div class="chosen-tag ${chosenTag}">${chosenTag}</div>`;
        this.windowIsOpen = false;
        this.selecterWindowContainer.innerHTML = "";
      }
    };
  }
  
  _checkForm(inputValues) {
    for (let i = 0; i < inputValues.length; i++) {
      if (!inputValues[i].value) {
        this.formError.push(`${inputValues[i].name} is empty.`);
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

  closeEditModal() {
    this.mainNode.removeChild(this.patchElement);
    this.enableScroll()
  }

  async patchQuestion() {
    this.inputValues = document.querySelectorAll(".patch-input");
    const formCheck = this._checkForm(this.inputValues);
    const url = "http://localhost:5000";
    const path = "/api/quiz/js";
    const endpoint = url + path;
    if (formCheck) {
      this.editButton.setAttribute("disabled", true);

      const term = this.inputValues[0].value;
      const description = this.inputValues[1].value;
      const classNum = this.inputValues[2].value;
      const tags = this.chosenTags.join();
      await fetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify({
          UUID: this.questionId,
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
          this.allReset();
          const notify = new PopupNotification(
            [],
            "UPLOADED",
            this.mainNode,
            "success"
          );
          this.closeEditModal();
          notify.initialEvent();
          this.editButton.disabled = false;
          for (let i = 0; i < this.inputValues.length; i++) {
            this.inputValues[i].value = "";
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
        this.mainNode,
        color
      );
      notify.initialEvent();
      this.editButton.disabled = false;
    }
    this.formError = [];
  }

  allReset() {
    for (let i = 0; i < this.allChecks.length; i++) {
      this.allChecks[i].checked = false;
    }
    this.options.value = "select class";
    this.text.value = "";
    this.remove();
    this.currentData = {
      text: "",
      class: "",
      tags: [],
    };
    this.fetchQuizData();
  }

  deleteQuestion() {
    const url = "http://localhost:5000";
    const path = "/api/quiz/js:id=";
    const endpoint = url + path;

    const deleteQuestionContainer = document.querySelectorAll(
      ".delete-question-container"
    );
    for (let i = 0; i < deleteQuestionContainer.length; i++) {
      deleteQuestionContainer[i].addEventListener("click", async (e) => {
        const uuid = e.target.id;
        this.apiData = this.apiData.filter((data) => {
          return data.UUID !== uuid;
        });
        const removeItemFromBrowser = deleteQuestionContainer[i].parentElement;
        this.container.removeChild(removeItemFromBrowser);
        this.num.innerHTML = this.setResultNum(
          this.container.children.length
        );
        await fetch(endpoint + uuid, {
          method: "DELETE",
        });
      });
    }
  }

  disableScroll() {
    // Get the current page scroll position.

    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;

    // if any scroll is attempted,
    // set this to the previous value.
    window.onscroll = function() {
        window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
      window.onscroll = function() {};
  }
}
