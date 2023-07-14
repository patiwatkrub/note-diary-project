import { body } from "./utilities/helper/body.js"
import { UpdateUserData, header } from "./components/layouts/header.js";
import { footer } from "./components/layouts/footer.js";
import { signInModalBox } from "./components/subcomponents/signInModalBox.js";
import { logInModalBox } from "./components/subcomponents/logInModalBox.js";
import { uploadImgModalBox } from "./components/subcomponents/uploadImgModalBox.js";
import { dropdownBtn, dropdownToggle, initializeDropdownControl } from "./utilities/dropdownControl.js";
import { logInBtn, mobileLogInBtn, logInCloseBtn, loginForm, login, openLogInBox, closeLogInBox, initializeLogInForm, logOutBtnWins, logOutBtnMoblie, logout } from "./utilities/logInForm.js";
import { signInBtn, mobileSignInBtn, signInCloseBtn, signInForm, signIn,  openSignInBox, closeSignInBox,initailizeSignInForm } from "./utilities/signInForm.js";
import { UnicodeDecodeB64, base64ToArrayBuffer, decryptAES } from "./utilities/helper/generateSecureKey.js";
import { NewDiary, diaryForm, toggleDiaryForm } from "./components/pages/homepage.js";

body.insertBefore(header, body.firstChild);
body.appendChild(signInModalBox);
body.appendChild(logInModalBox);
body.appendChild(uploadImgModalBox);
body.insertBefore(footer, body.children[body.children.length]);

let userData;

const headerElement = body.querySelector('header');
const secretKey = await crypto.subtle.generateKey(
    {
        name: 'AES-GCM',
        length: 256
    },
    true,
    [ 'encrypt', 'decrypt']
);

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

let isLogIn = localStorage.getItem('user');

if (isLogIn) {
    headerElement.classList.add('is-login');

    /*let decodedToArray = base64ToArrayBuffer(isLogIn);
    console.log(decodedToArray);
    decryptAES(decodedToArray, secretKey)
    .then(result => {
        console.log("special")
        console.log(result)
        userData = JSON.parse(result)

        console.log(userData)
        console.log(userData.username)
        console.log(userData.password)
        console.log(userData.email)
        console.log(userData.imgProfile)
        console.log(UnicodeDecodeB64(userData.imgProfile))
    })
    .catch( error => {
        console.log(error);
    });*/

    userData = JSON.parse(UnicodeDecodeB64(isLogIn));
    UpdateUserData(userData);
    
    toggleDiaryForm();
} else {
    headerElement.classList.remove('is-login');
}

diaryForm?.addEventListener('submit', NewDiary);

export { userData, secretKey };