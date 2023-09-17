import { body } from "./utilities/helper/body.js"
import { updateUserData, clearUserData, header } from "./components/layouts/header.js";
import { footer } from "./components/layouts/footer.js";
import { signInModalBox } from "./components/subcomponents/signInModalBox.js";
import { logInModalBox } from "./components/subcomponents/logInModalBox.js";
import { uploadImgModalBox } from "./components/subcomponents/uploadImgModalBox.js";
import { dropdownBtn, dropdownToggle, initializeDropdownControl } from "./utilities/dropdownControl.js";
import { logInBtn, mobileLogInBtn, logInCloseBtn, loginForm, login, openLogInBox, closeLogInBox, initializeLogInForm, logOutBtnWins, logOutBtnMoblie } from "./utilities/logInForm.js";
import { signInBtn, mobileSignInBtn, signInCloseBtn, signInForm, signIn,  openSignInBox, closeSignInBox,initailizeSignInForm } from "./utilities/signInForm.js";
import { NewDiary, diaryForm, toggleDiaryForm } from "./components/pages/homepage.js";
import { InformationBox } from "./components/subcomponents/informationBox.js";

body.insertBefore(header, body.firstChild);
body.appendChild(signInModalBox);
body.appendChild(logInModalBox);
body.appendChild(uploadImgModalBox);
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

const authentication = (callback) => {
    const authenticate = sessionStorage.getItem('issuer');

    let logic = false;

    if (authenticate) {
        header.classList.add('is-login');

        logic = true;
        callback(logic);
    } else {
        header.classList.remove('is-login');
        clearUserData();
        callback(logic);
    }
}

authentication((isLogIn) => {
    const authenticate = sessionStorage.getItem('issuer');
    
    if (isLogIn) {
        fetchUserData(authenticate);
        
        if (location.href == "http://notediary:8080/public/profile.html") return

        getNoteData(authenticate, (noteData) => {
            console.log(noteData);
        })
    }
})

function fetchUserData(issuer) {
    getUserData(issuer, (userResponse) => {
        updateUserData(userResponse);

        toggleDiaryForm();
    })
}

function getUserData(issuer, callback) {

    const xhr = new XMLHttpRequest;
    const logBox = new InformationBox();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            let statusCode = xhr.status;
            let response = xhr.response;
            let keys = Object.keys(response);

            let info = keys[0];
            if (statusCode !== 200) {
                logBox.createBox("error", info, response[info])
            } else if (statusCode === 200) {
                callback(response);
            }
        }
    }

    xhr.onerror = () => {
        console.log("something went wrong");
    }

    xhr.open("GET", `http://notediary:8081/api/user/${issuer}`, true);
    xhr.responseType = "json";

    xhr.send();
}

function getNoteData(issuer, callback){
    const xhr = new XMLHttpRequest;

    xhr.onload = () => {
        const statusCode = xhr.status;
        const response = xhr.response;

        if (statusCode == 200) {
            callback(response);
        }
    }

    xhr.onerror = () => {
        console.log("can't get note data");
    }

    xhr.open("GET", `http://notediary:8081/api/user/${issuer}/note/`, true);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.send()
}

function logout(e) {
    e.preventDefault();
    
    const xhr = new XMLHttpRequest();

    const issuer = sessionStorage.getItem("issuer")

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            sessionStorage.removeItem('issuer');

            header.classList.remove('is-login');

            location = "http://notediary:8080/public/homepage.html"
        }
    }

    xhr.onerror = () => {
        console.log("something went wrong");
    }

    xhr.open("GET", `http://notediary:8081/api/user/${issuer}/logout`, true);

    xhr.withCredentials = true;
    xhr.send();
}

export { authentication, fetchUserData, getUserData };