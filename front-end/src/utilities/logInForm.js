import { body } from "../../src/utilities/helper/body.js";
import { dropdownToggle } from './dropdownControl.js';
import { InformationBox } from "../components/subcomponents/informationBox.js";
import { loadingBox } from "../components/subcomponents/loadingBox.js";
import { authentication, fetchUserData } from "../app.js"

let username;
let password;

let loginForm;
let logInBox;
let logInBtn;
let logOutBtnWins;
let logOutBtnMoblie;
let mobileLogInBtn;
let logInCloseBtn;

function initializeLogInForm() {
    loginForm = body.querySelector('#login');

    username = body.querySelector('#username');
    password = body.querySelector('#password');

    logInBox = body.querySelector('#log-in-box');
    logInBtn = body.querySelector('#log-in-btn');
    logOutBtnWins = document.querySelector('.wins-profile-layout').children[3].children[0];
    logOutBtnMoblie = document.querySelector('#dropdown-content').children[0].children[2];
    mobileLogInBtn = body.querySelector('#mobile-log-in-btn');
    logInCloseBtn = body.querySelector('#log-in-close-btn');
}

function openLogInBox() {
    logInBox.classList.remove('hidden');
    dropdownToggle();
}

function toggleLogInModalBox() {
    logInBox.classList.toggle(`hidden`);
}

function closeLogInBox() {
    logInBox.classList.add('hidden');
    clearLogInForm();
}

function showLoadingBox() {
    loadingBox.classList.remove('hidden');
    loadingBox.classList.add('flex', 'flex-row');
}

function hideLoadingBox() {
    loadingBox.classList.add('hidden');
    loadingBox.classList.remove('flex', 'flex-row');
}

function clearLogInForm() {
    username.value = '';
    password.value = '';
}

function login(e) {
    e.preventDefault();

    const formData = new FormData(loginForm);

    const xhr = new XMLHttpRequest();

    const logBox = new InformationBox();

    const setLogin = (username) => {
        sessionStorage.setItem("issuer", username);

        authentication((isLogIn) => {
            if (isLogIn) {
                fetchUserData(username);
            }
        });
    };

    if (arguments.length == 3) {
        const username = arguments[1];
        const password = arguments[2];

        formData.set("username", username);
        formData.set("password", password);
    } 

    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) {
            body.classList.add('brightness-50');
            showLoadingBox();
            toggleLogInModalBox();
        } else if (xhr.readyState == 4) {
            let statusCode = xhr.status;
            let response = xhr.response;

            body.classList.remove('brightness-50');
            hideLoadingBox();
            toggleLogInModalBox();

            let keys = Object.keys(response)
            let info = keys[0]

            switch(statusCode) {
                case 200:
                    logBox.createBox("warning", info, response[info]);
                    setLogin(response.user);
                    break;
                case 202:
                    logBox.createBox("success", "Success", `Welcome back, ${response.user}`);
                    setLogin(response.user);
                    break;
                default:
                    logBox.createBox("error", info, response[info]);
                    break;
            }
        }
    }

    xhr.onerror = () => {
        console.log('Can not use Log in System yet.');
    }

    xhr.open("POST", "http://notediary:8081/api/user", true);

    xhr.setRequestHeader('Multipart', 'multipart/form-date');
    xhr.responseType = 'json';

    xhr.withCredentials = true;

    xhr.send(formData);

    closeLogInBox();
}

export { logInBtn, logOutBtnWins, logOutBtnMoblie, mobileLogInBtn, logInCloseBtn, loginForm, login, openLogInBox, closeLogInBox, initializeLogInForm };