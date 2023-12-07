import { toggleLogInModalBox } from "./logInForm.js";

let forgotPWDBtn;

let forgetPWDBox;
let forgetPWDCloseBtn;

let forgetPWDForm;
let checkEmailInputBox;
let checkEmailBtn;
let resetPWD;
let resetPWDBtn;

let logParagraph;

function initializeForgetPasswordForm() {
    forgotPWDBtn = document.querySelector(".forgot-password-btn");
    forgetPWDBox = document.querySelector("#forget-pwd-box");
    forgetPWDCloseBtn = document.querySelector("#forget-pwd-close-btn");
    forgetPWDForm = document.querySelector("#forget-password-form");

    checkEmailInputBox = document.querySelector("#check-email");
    checkEmailBtn = document.querySelector("#check-email-btn");
    resetPWD = document.querySelector("#reset-password");
    resetPWDBtn = document.querySelector("#reset-password-btn");

    logParagraph = document.querySelector("#log-paragraph");
}

function toggleForgetPWDBox() {
    toggleLogInModalBox();

    forgetPWDBox.classList.remove('hidden');
}

function closeForgetPWDBox() {
    forgetPWDBox.classList.add('hidden');

    clearForgetPWDForm();
}

function clearForgetPWDForm() {
    logParagraph.innerHTML = '';

    checkEmailInputBox.value = '';
    resetPWD.value = '';
}

export { forgotPWDBtn, 
    forgetPWDBox, 
    forgetPWDCloseBtn, 
    forgetPWDForm, 
    checkEmailInputBox, 
    checkEmailBtn, 
    resetPWD, 
    resetPWDBtn, 
    logParagraph, 
    initializeForgetPasswordForm, 
    toggleForgetPWDBox,
    closeForgetPWDBox,
    clearForgetPWDForm
};