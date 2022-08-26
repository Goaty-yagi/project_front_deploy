import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import initialization, { removeSessionItem } from "../frontend/static/js/store";

let userData = {}
let userLogin = false;

async function createUser(user) {
  return new Promise(async (resolve, reject) => {
    const { username, email, password, score} = user;
    await createUserWithEmailAndPassword(auth, email, password)
    .then(async () => {
      await updateProfile(auth.currentUser, {
        displayName: username,
      },
      resolve())
      .catch((error) => {
        const FBError = {
          errorCode:error.code,
          errorMessage:error.message
        }
        reject(FBError)
      })
    })
    .catch((error) => {
      const FBError = {
        errorCode:error.code,
        errorMessage:error.message
      }
      reject(FBError)
    })
  })
}

function login(user) {
  return new Promise((resolve, reject) => {
    const { email, password } = user;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Signed in
      resolve()
    })
    .catch((error) => {
      const FBError = {
        errorCode:error.code,
        errorMessage:error.message
      }
      reject(FBError)
    });
  })
}

//   setPersistence(auth, browserSessionPersistence)
//  .then(() => {
//    // Existing and future Auth states are now persisted in the current
//    // session only. Closing the window would clear any existing state even
//    // if a user forgets to sign out.
//    // ...
//    // New sign-in will be persisted with session persistence.
//    return signInWithEmailAndPassword(auth, email, password);
//  })
//  .catch((error) => {
//    // Handle Errors here.
//    const errorCode = error.code;
//    const errorMessage = error.message;
//  });

function setUser(user) {
  if (user) {
    userData["UID"] = user.uid
    userData["name"] = user.displayName
    userLogin = true;
    console.log("LOGIN", userData);
    
  } else {
    userData = {}
    userLogin = false;
    console.log("LOGOUT");
  }
}
function getUserData() {
  return userData
}
function getUserLogin() {
  return userLogin
}


async function logout() {
  await signOut(auth);
  removeSessionItem("currentScore")
}

function authChange() {
  onAuthStateChanged(auth, async (user) => {
    setUser(user);
    if(user) {
      initialization(userLogin,user.uid)
    } else {
      initialization(userLogin)
    }
    });
}
authChange()

export { 
  login, 
  logout, 
  createUser,
  getUserData,
  getUserLogin,
  };
