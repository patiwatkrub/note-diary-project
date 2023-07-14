import { body } from "./helper/body.js";
import { alertMsg } from "./helper/alertMsg.js";
import { User, AddUser } from "./helper/user.js";
import { dropdownToggle } from "./dropdownControl.js";
import { b64EncodeUnicode } from "./helper/generateSecureKey.js";

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
    signInForm = body.querySelector('#signin');
    
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

function closeSignInBox() {
    signInBox.classList.add('hidden');
    clearSignInForm();
}

function clearSignInForm() {
    resetBtn.click();
}

function signIn(e) {
    e.preventDefault();

    let submitUsername = regUsername.value;
    let submitPassword = regPassword.value;
    let submitEmail = regEmail.value;

    let user = new User(submitUsername, submitPassword, submitEmail, b64EncodeUnicode("../../src/assets/images/profile-photo-default.png"));
    
    AddUser(user);

    closeSignInBox();
    alertMsg('Register success.');
}



export { signInBtn, mobileSignInBtn, signInCloseBtn, signInForm, signIn, openSignInBox, closeSignInBox, initailizeSignInForm };