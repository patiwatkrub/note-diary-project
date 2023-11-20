import { body } from "../../src/utilities/helper/body.js";
import { dropdownToggle } from './dropdownControl.js';

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

function clearLogInForm() {
    username.value = '';
    password.value = '';
}

export { logInBtn, logOutBtnWins, logOutBtnMoblie, mobileLogInBtn, logInCloseBtn, loginForm, openLogInBox, toggleLogInModalBox, closeLogInBox, initializeLogInForm };