import { getUserLogin } from "../../../firebase/authentication.js";
import initialization, { getIsAuth } from "./store/index.js";
import Dashboard from "./views/dashboard/Dashboard.js";
import Home from "./views/Home.js";
import Login from "./views/Login.js";
import Quiz from "./views/Quiz.js";
import Signup from "./views/Signup.js";
import Study from "./views/Study.js";

const app = document.querySelector("#app");
const routes = [
  { path: "/", view: Home },
  { path: "/quiz", view: Quiz },
  { path: "/dashboard", view: Dashboard, auth: { userLogin: true, isAuth: true } },
  { path: "/signup", view: Signup, auth: { userLogin: false } },
  { path: "/login", view: Login, auth: { userLogin: false } },
  { path: "/study", view: Study },
];

// let authKeyArray = getAuthKeyArray()

// function getAuthKeyArray() {
//     //automatically set authKeys
//     const tempArray  = routes.map(route => {
//         if("auth" in route) {
//             console.log(route.auth)
//             return Object.keys(route.auth)
//         }
//     })
//     const set = new Set
//     tempArray.forEach(each => {
//         if(Array.isArray(each)){
//             for(let i= 0; i < each.length; i++) {
//                 set.add(each[i])
//             }
//         }
//     })
//     return Array.from(set)
// }

function setDualRing() {
  app.style.height = "80%";
  app.style.display = "flex";
  app.style.justifyContents = "center";
  app.style.alignItems = "center";
  app.innerHTML = '<div class="lds-dual-ring"></div>';
}
function cancelAppStyle() {
  app.style.height = "100%";
  app.style.display = "";
  app.style.justifyContents = "";
  app.style.alignItems = "";
}

setDualRing();

function navigateTo(url) {
  // DOM won't change.
  // this is like set currentURL in the history then
  // go to the url

  history.pushState(null, null, url);
  router();
}

function setAuth(routeObj) {
  const isAuth = getIsAuth() ? true : false;// Because DB return 1 or 0
  const userLogin = getUserLogin();
  let returnVal;
  for (let i = 0; i < Object.keys(routeObj.auth).length; i++) {
    if (
      Object.keys(routeObj.auth)[i] === "userLogin" &&
      routeObj.auth.userLogin !== userLogin
    ) {
      returnVal = true;
    } else if (
      Object.keys(routeObj.auth)[i] === "isAuth" &&
      routeObj.auth.isAuth !== isAuth
    ) {
      returnVal = true;
    } else {
      returnVal = false;
    }
  }
  return returnVal;
}

// why async?? will be render page so takes time
const router = async () => {
  
  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    const auth =
      "auth" in route && location.pathname === route.path
        ? setAuth(route)
        : false;

    return {
      route: route,
      isMatch: location.pathname === route.path,
      auth: auth,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);
  if (!match || match.auth) {
    // This avoids browser reload.
    // If clicked, go to HOME.
    match = {
      route: routes[0],
      isMatch: true,
    };
    history.replaceState(null, null, "/");
  }
  // Routing is done

  // Start dom manipulation
  cancelAppStyle();
  const view = new match.route.view(); //make a new instance
  await view.beforeInitialRender();
  app.innerHTML = await view.renderHTML(); // renderHTML() is async so await here
  view.initialEvent();
};

function routingEvent() {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[target-url]")) {
      e.preventDefault(); // prevent reload but stop routing
      navigateTo(e.target.getAttribute("target-url"));
    }
  });
  router();
}

window.addEventListener("popstate", router);
// postate excute histrical data when browser back or forward
// the data could be the data created with histry.pushState

export { routingEvent, router };
