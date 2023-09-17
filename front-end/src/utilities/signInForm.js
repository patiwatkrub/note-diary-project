import { body } from "./helper/body.js";
import { dropdownToggle } from "./dropdownControl.js";
import { InformationBox } from "../components/subcomponents/informationBox.js";
import { loadingBox } from "../components/subcomponents/loadingBox.js";
import { login } from "./logInForm.js";

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

    body.appendChild(loadingBox);
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

function showLoadingBox() {
    loadingBox.classList.remove('hidden');
    loadingBox.classList.add('flex', 'flex-row');
}

function hideLoadingBox() {
    loadingBox.classList.add('hidden');
    loadingBox.classList.remove('flex', 'flex-row');
}

function clearSignInForm() {
    resetBtn.click();
}

function signIn(e) {
    e.preventDefault();
    
    const formData = new FormData(signInForm);
    
    const xhr = new XMLHttpRequest();

    const logBox = new InformationBox();
    
    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) {
            
            body.classList.add('brightness-50');
            
            showLoadingBox();
            toggleSignInModalBox();

        } else if (xhr.readyState == 4) {
            let statusCode = xhr.status;

            if (statusCode == 201) {
                const username = formData.get("reg-username");
                const password = formData.get("reg-password");

                // Force log in.
                login(e, username, password);
            } else {
                let response = xhr.response;
                let keys = Object.keys(response)
                let info = keys[0]
                logBox.createBox("error", info, response[info])
            }
            

            body.classList.remove('brightness-50');
            hideLoadingBox();
            toggleSignInModalBox();
        }
    }

    xhr.onerror = () => {
        console.log('Request failed. Network error.');
    }

    // Fact: It is not setRequestHeader. the server is smart enough to specify request.
    xhr.open("POST", "http://notediary:8081/api/user/create", true);
    // Fact: FormData is not supported on `Content-Type`, `application/x-www-form-urlencoded`
    // xhr.setRequestHeader(`Content-Type`, `application/x-www-form-urlencoded`)
    xhr.setRequestHeader(`Multipart`, `multipart/form-data`);
    xhr.responseType = 'json';
    
    xhr.send(formData);
}

export { signInBtn, mobileSignInBtn, signInCloseBtn, signInForm, signIn, openSignInBox, closeSignInBox, initailizeSignInForm };