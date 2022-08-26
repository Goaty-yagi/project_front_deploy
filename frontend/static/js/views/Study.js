import AbstractView from "./AbstractView.js";

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
    this.setTitle("Study");
  }

  async renderHTML() {
    return `
      <section class="study-section">
        <h1 class="study-title">Search And Study TECH Terms</h1>
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
    app.style.display = "initial";

    await this.fetchQuizData().then(() => {
      this.getClassOption();
      this.tags = this.getSelectOption();
      this.keysArray = "";
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
    this.showAppNode();
  }

  async beforeInitialRender() {
    this.hideAppNode();
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
      ckeckBoxContainer.innerHTML += `
        <div class='each-tag'>
          <input class="check" name="check" id=${elem} type="checkbox">
          <label for=${elem}>${elem}</label>
        </div>
      `;
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

    // First action start from here
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
          // Only-text exist

          if (e.target.value) {
            arrayForResult = textSearch(e.target.value);
          } else {
            this.remove(e.target);
          }
        } else {
          // Many exist
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
      this.num.innerHTML = `<div aria-live="polite" class="num">${results.length} terms found</div>`;
      results.forEach((result) => {
        this.currentDom.push(result);
        this.container.innerHTML +=
          '<div aria-live="polite" class="each-item"></div>';
        let each = document.querySelectorAll(".each-item");
        this.keysArray.forEach((e) => {
          if (e !== "tags") {
            each[
              each.length - 1
            ].innerHTML += `
              <div class="category">
                <p class="title">${e}:</p>
                <p class="value">${result[e]}</p>
              </div>
            `;
          } else {
            each[
              each.length - 1
            ].innerHTML += `
              <div class="category">
                <p class="title">${e}:</p>
                <div class="tags">
                </div>
              </div>
            `;
            this.tags = document.querySelectorAll(".tags");
            let tagsArray = this.tagsStringToArray(result);
            tagsArray.forEach((t) => {
              this.tags[this.tags.length - 1].innerHTML += `<tag>${t}</tag>`;
            });
          }
        });
      });
    } else {
      this.remove();
    }
    this.checkCurrentItem();
  }

  remove(target) {
    let allItems = document.querySelectorAll(".eachItem");
    const allRemove = () => {
      this.container.innerHTML = "";
      this.currentDom = [];
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
}
