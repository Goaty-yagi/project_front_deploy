import { routingEvent } from "../index.js";
import Nav from "../views/Nav.js";

let initialized = false;
let is_auth = false;

export default async function initialization(userLogin, uid) {
  if (uid) {
    await fetchScoreData(uid);
    await getUserData(uid);
  }
  if (!initialized) {
    routingEvent();
    const nav = new Nav();
    nav.initialEvent(userLogin);

    initialized = true;
  }
}
async function fetchScoreData(uid) {
  const url = "http://localhost:5000";
  const scorePath = `/api/score-id/:id=${uid}`;
  const scoreEndpoint = url + scorePath;
  await fetch(scoreEndpoint, {})
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      setSessionStorage("currentScore", data.score);
    });
}

async function getUserData(uid) {
  const url = "http://localhost:5000";
  const userPath = `/api/user-id/:id=${uid}`;
  const userEndpoint = url + userPath;
  await fetch(userEndpoint, {})
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      is_auth = data.is_authenticated;
    });
}

function getIsAuth() {
  return is_auth;
}
function setSessionStorage(key, val) {
  sessionStorage.setItem(key, val);
}
function getSessionItem(key) {
  return sessionStorage.getItem(key);
}
function removeSessionItem(key) {
  sessionStorage.removeItem(key);
}

export {
  setSessionStorage,
  getSessionItem,
  removeSessionItem,
  fetchScoreData,
  getIsAuth,
};
