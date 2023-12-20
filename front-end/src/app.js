import { body } from "./utilities/helper/body.js"
import { updateUserData, clearUserData, header, onLogIn, onLogOut } from "./components/layouts/header.js";
import { footer } from "./components/layouts/footer.js";
import { signInModalBox } from "./components/subcomponents/signInModalBox.js";
import { logInModalBox } from "./components/subcomponents/logInModalBox.js";
import { uploadImgModalBox } from "./components/subcomponents/uploadImgModalBox.js";
import { disableForgetPWDForm, enableForgetPWDForm, forgetPWDFormLogAPI, forgetPWDFormLogProcess, forgetPWDModalBox } from "./components/subcomponents/ForgetPWDModalBox.js";
import { dropdownBtn, dropdownToggle, initializeDropdownControl } from "./utilities/dropdownControl.js";
import { logInBtn, mobileLogInBtn, logInCloseBtn, loginForm, openLogInBox, closeLogInBox, initializeLogInForm, logOutBtnWins, logOutBtnMoblie } from "./utilities/logInForm.js";
import { signInBtn, mobileSignInBtn, signInCloseBtn, signInForm, openSignInBox, closeSignInBox,initailizeSignInForm } from "./utilities/signInForm.js";
import { forgotPWDBtn, forgetPWDCloseBtn, forgetPWDForm, checkEmailInputBox, checkEmailBtn, initializeForgetPasswordForm, toggleForgetPWDBox, closeForgetPWDBox} from "./utilities/forgetPWDForm.js";
import { signIn, login, getUserData, getNoteData, extendTime, logout } from "./utilities/helper/apiFetcher.js";
import { NewDiary, diaryForm, toggleDiaryForm } from "./components/pages/homepage.js";
import { loadingBox } from "./components/subcomponents/loadingBox.js";
import { userSingleton } from "./utilities/helper/user.js";
import { emailPatternChecker } from "./utilities/helper/emailChecker.js";
import { checkEmailAPI, requestResetPWDAPI } from "./utilities/helper/apiFetcher.js";
import { createDiaryBox } from "./components/pages/homepage.js";
import { DiaryBox } from "./components/subcomponents/diaryBox.js";
import { clearDiaryContextBtn, clearDiaryForm } from "./utilities/diaryForm.js";

body.insertBefore(header, body.firstChild);
body.appendChild(signInModalBox);
body.appendChild(logInModalBox);
body.appendChild(uploadImgModalBox);
body.appendChild(forgetPWDModalBox);
body.appendChild(loadingBox);
body.insertBefore(footer, body.children[body.children.length]);

// Initialize element
initializeDropdownControl()
initializeLogInForm();
initailizeSignInForm();
initializeForgetPasswordForm();

checkEmailInputBox?.addEventListener('input', (e) => {
    let emailInput = e.target.value;

    let isEmail = emailPatternChecker(emailInput);

    if (isEmail) {
        forgetPWDFormLogProcess("isEmail");
    } else {
        forgetPWDFormLogProcess("isNotEmail");
        disableForgetPWDForm();
    }
})

checkEmailBtn?.addEventListener('click', checkEmail);

// addEventListener with restPWDBtn is not work
// resetPWDBtn?.addEventListener('submit', requestResetPWD);

// The ChatGPT 3.5 is solve problem with change addEventListener on resetPWDBtn to forgetPWDForm
forgetPWDForm?.addEventListener('submit', requestResetPWD);

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

forgotPWDBtn?.addEventListener('click', toggleForgetPWDBox);
forgetPWDCloseBtn?.addEventListener('click', closeForgetPWDBox);

clearDiaryContextBtn?.addEventListener('click', clearDiaryForm);
diaryForm?.addEventListener('submit', NewDiary);

const user = userSingleton.getInstead();

// Set up Log in events
user.logInEvent.addLogInEvent(onLogIn);
user.logInEvent.addLogInEvent(toggleDiaryForm);

// Set up Log out events
user.logOutEvent.addLogOutEvent(onLogOut);
user.logOutEvent.addLogOutEvent(clearUserData);

async function plugin() {
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

            getNoteData(user.authentication.issuer(), (resp) => {
                if (resp["Notes"] != null) {
                    resp["Notes"].forEach(task => {
                        createDiaryBox(task);
                    })
                }
            })
        }
    } catch (err) {
        console.error(err);
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

async function checkEmail(e) {
    e.preventDefault();
    
    try {
        let responseCode = await checkEmailAPI();
        
        if (responseCode == 200) {
            enableForgetPWDForm();
        }

        forgetPWDFormLogAPI(responseCode);
    } 
    catch (err) {

        console.log(err);
    }
}
async function requestResetPWD(e) {
    e.preventDefault();

    try {
        await requestResetPWDAPI();

    } catch (err) {
        console.log(err);
    }
}

if (user.authentication.isLogIn()) {
    timeoutChecker();
    
    plugin();
} else {
    plugout();
}

export { plugin };