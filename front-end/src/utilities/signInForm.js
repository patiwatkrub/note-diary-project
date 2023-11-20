import { body } from "./helper/body.js";
import { dropdownToggle } from "./dropdownControl.js";

let regUsername;
let regPassword;
let regEmail;
let resetBtn;

let signInForm;
let signInBox;
let signInBtn;
let mobileSignInBtn;
let signInCloseBtn;

function initailizeSignInForm() {
    signInForm = body.querySelector('#sign-in');
    
    // register form section
    regUsername = body.querySelector('#reg-username');
    regPassword = body.querySelector('#reg-password');
    regEmail = body.querySelector('#reg-email');
    resetBtn = body.querySelector('.reset-btn');

    // Sign in box variables
    signInBox = body.querySelector('#sign-in-box');
    signInBtn = body.querySelector('#sign-in-btn');
    mobileSignInBtn = body.querySelector('#mobile-sign-in-btn');
    signInCloseBtn = body.querySelector('#sign-in-close-btn');
}

function openSignInBox() {
    signInBox.classList.remove('hidden');
    dropdownToggle();
}

function toggleSignInModalBox() {
    signInBox.classList.toggle(`hidden`);
}

function closeSignInBox() {
    signInBox.classList.add('hidden');
    clearSignInForm();
}

function clearSignInForm() {
    resetBtn.click();
}

export { signInBtn, mobileSignInBtn, signInCloseBtn, signInForm, openSignInBox, toggleSignInModalBox, closeSignInBox, initailizeSignInForm };