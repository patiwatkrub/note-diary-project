import { body } from "./utilities/helper/body.js"
import { updateUserData, clearUserData, header, onLogIn, onLogOut } from "./components/layouts/header.js";
import { footer } from "./components/layouts/footer.js";
import { signInModalBox } from "./components/subcomponents/signInModalBox.js";
import { logInModalBox } from "./components/subcomponents/logInModalBox.js";
import { uploadImgModalBox } from "./components/subcomponents/uploadImgModalBox.js";
import { dropdownBtn, dropdownToggle, initializeDropdownControl } from "./utilities/dropdownControl.js";
import { logInBtn, mobileLogInBtn, logInCloseBtn, loginForm, openLogInBox, closeLogInBox, initializeLogInForm, logOutBtnWins, logOutBtnMoblie } from "./utilities/logInForm.js";
import { signInBtn, mobileSignInBtn, signInCloseBtn, signInForm, openSignInBox, closeSignInBox,initailizeSignInForm } from "./utilities/signInForm.js";
import { signIn, login, getUserData, getNoteData, extendTime, logout } from "./utilities/helper/apiFetcher.js";
import { NewDiary, diaryForm, toggleDiaryForm } from "./components/pages/homepage.js";
import { loadingBox } from "./components/subcomponents/loadingBox.js";
import { userSingleton } from "./utilities/helper/user.js";

body.insertBefore(header, body.firstChild);
body.appendChild(signInModalBox);
body.appendChild(logInModalBox);
body.appendChild(uploadImgModalBox);
body.appendChild(loadingBox);
body.insertBefore(footer, body.children[body.children.length]);

// Initialize element
initializeDropdownControl()
initializeLogInForm();
initailizeSignInForm();

// Add events
dropdownBtn?.addEventListener('click', dropdownToggle);

loginForm?.addEventListener('submit', login);
logInBtn?.addEventListener('click', openLogInBox);
logOutBtnWins?.addEventListener('click', logout);
logOutBtnMoblie?.addEventListener('click', logout);
mobileLogInBtn?.addEventListener('click', openLogInBox);
logInCloseBtn?.addEventListener('click', closeLogInBox);

signInForm?.addEventListener('submit', signIn);
signInBtn?.addEventListener('click', openSignInBox);
mobileSignInBtn?.addEventListener('click', openSignInBox);
signInCloseBtn?.addEventListener('click', closeSignInBox);

diaryForm?.addEventListener('submit', NewDiary);

const user = userSingleton.getInstead();

// Set up Log in events
user.logInEvent.addLogInEvent(onLogIn);
user.logInEvent.addLogInEvent(toggleDiaryForm);

// Set up Log out events
user.logOutEvent.addLogOutEvent(onLogOut);
user.logOutEvent.addLogOutEvent(clearUserData);

async function plugin() {
    // 1
    // if (sessionStorage.getItem("userData") == null) {
    //     getUserData(user.authentication.issuer(), (response) => {
    //         user.setResponseData(response.user.username, response.user.password, response.user.email, response.user.img_profile);
    //         updateUserData(response);

    //     });
    // } else {
    //     const userData = user.getUserObject();
    //     if (userData) {
    //         updateUserData(userData);
    //     }

    // }
    
    // user.logInEvent.call();

    // 2 (best performance i thing)
    let userData;

    try {
        if (sessionStorage.getItem("userData") == null) {
            userData = await getUserData(user.authentication.issuer());
            user.setResponseData(userData);
        } else {
            userData = user.getUserObject();
        }

        if (userData) {
            updateUserData(userData);
            user.logInEvent.call();
        }
    } catch (err) {
        console.log(err);
    }
    
}

function plugout() {
    user.logOutEvent.call();

    user.logout();
}

function timeoutChecker() {
    let now = Date.now();
    let expire = user.authentication.getTimeout();
    if ( (now > expire) && (now <= expire + (30 * 1000)) ) {
        extendTime();
    }
    else if ( (now > expire + (30 * 1000)) ){
        user.logout();
    }
}

if (user.authentication.isLogIn()) {
    timeoutChecker();
    
    plugin();
} else {
    plugout();
}

export { plugin };