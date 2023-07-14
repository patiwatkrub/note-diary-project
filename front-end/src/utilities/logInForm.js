import { body } from "../../src/utilities/helper/body.js";
import { FindUserByValidation } from './helper/user.js';
import { alertMsg } from './helper/alertMsg.js';
import { dropdownToggle } from './dropdownControl.js';
import { b64EncodeUnicode, UnicodeDecodeB64, arrayBufferToBase64, base64ToArrayBuffer, encryptAES, decryptAES } from "./helper/generateSecureKey.js";
import { secretKey } from "../app.js";

let userData;

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

function closeLogInBox() {
    logInBox.classList.add('hidden');
    clearLogInForm();
}

function clearLogInForm() {
    username.value = '';
    password.value = '';
}

function login(e) {
    e.preventDefault();
    
    let submitUsername = e.target.elements.username.value;
    let submitPassword = e.target.elements.password.value;

    userData = FindUserByValidation(submitUsername.toLowerCase(), submitPassword.toLowerCase());

    if (userData) {
        // Covert object to string0
        let userString = JSON.stringify(userData);

        // Encoding to secure 
        // Use Base64
        // Storing data to localStorage
        localStorage.setItem('user', b64EncodeUnicode(userString));

        // User AES Algorithm
        // encryptAES(userString, secretKey)
        // .then(key => {
        //     let encodedBase64 = arrayBufferToBase64(key);
        //     console.log(key);
        //     decryptAES(key, secretKey)
        //     .then(result => {
        //         console.log("normal");
        //         console.log(result);
        //         userData = JSON.parse(result);
        //     })
        //     .catch(error => console.log(error) );
            
        //     let decodedToArray = base64ToArrayBuffer(encodedBase64);
        //     decryptAES(decodedToArray, secretKey)
        //     .then(result => {
        //         console.log("special");
        //         console.log(result);
        //         userData = JSON.parse(result);
        //     })
        //     .catch(error => console.log(error) );
            
        //     localStorage.setItem('user', encodedBase64);
        // })
        // .catch(error => console.log(error, "417 Expectation Failed") );

        //Notice user
        
        alertMsg(`Login Successfully.`);

        //Reload a page
        location.reload();
    } else {
        alertMsg(`Username or Password isn't exist`);
    }

    closeLogInBox();
}

function logout(e) {
    e.preventDefault();
    
    localStorage.removeItem('user');

    location.reload();
}

export { logInBtn, logOutBtnWins, logOutBtnMoblie, mobileLogInBtn, logInCloseBtn, loginForm, login, logout, openLogInBox, closeLogInBox, initializeLogInForm };