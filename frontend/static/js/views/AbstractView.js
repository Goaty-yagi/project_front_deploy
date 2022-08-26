//............life-sycle-fook................

// page render order will be followed
// method execution order below.

// 1 beforeInitialRender()
// 2 renderHTML()
// 3 initialEvent()

// these three methods will be executed automatically

// after this, you can use mutationObserver() for page routing

export default class {
  constructor() {
    this.dualRing = document.createElement("div");
    this.dualRing.className = "lds-dual-ring";
    this.dualRing.style.position = "absolute";
    this.body = document.querySelector("body");
    this.app = document.querySelector("#app");
  }

  setTitle(title) {
    document.title = title;
  }

  async renderHTML() {
    return "";
  }

  initialEvent() {
    // this will be rendered after renderHTML rendered.
    // showAppNode() should be executed here.

    return "";
  }

  async beforeInitialRender() {
    // a layer to be executed before Dom element rendered.
    // hideAppNode() should be executed here.
    return "";
  }

  hideAppNode() {
    // this is for waiting async to be ready.

    this.app.style.visibility = "hidden";
    this.body.appendChild(this.dualRing);
    this.body.style.display = "flex";
    this.body.style.justifyContent = "center";
    this.body.style.alignItems = "center";
  }

  showAppNode() {
    // this is to show ready html element

    this.app.style.visibility = "";
    this.body.removeChild(this.dualRing);
    this.body.style.display = "";
    this.body.style.justifyContent = "";
    this.body.style.alignItems = "";
  }

  beforeunload(callback) {
    // for preventing reload for form page
    window.addEventListener("beforeunload", callback, true);
    this.mutationObserver(() => {
      window.removeEventListener("beforeunload", callback, true);
    });
  }

  mutationObserver(callback) {
    // happens when app dom child is changed.
    // this controls manual url change regarding to
    // target-url in HTML tab
    
    const observer = new MutationObserver((mutations) => {
      callback();
      observer.disconnect();
    });

    observer.observe(this.app, {
      childList: true,
    });
  }
}
