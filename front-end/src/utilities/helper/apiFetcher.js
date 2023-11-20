import { body } from "./body.js";
import { InformationBox } from "../../components/subcomponents/informationBox.js";
import { loadingBox } from "../../components/subcomponents/loadingBox.js";
import { signInForm, toggleSignInModalBox } from "../signInForm.js";
import { loginForm, toggleLogInModalBox, closeLogInBox } from "../logInForm.js";
import { uploadIMGForm } from "../uploadImgForm.js";
import { profileSubmitter } from "../profileSubmitter.js";
import { userSingleton } from "./user.js";
import { escapeHtml } from "./escapeHTML.js";
import { plugin } from "../../app.js";

// let selected;

const user = userSingleton.getInstead();

function signIn(e) {
    e.preventDefault();
    
    const formData = new FormData(signInForm);

    formData.set('reg-username', escapeHtml(formData.get('reg-username')));
    formData.set('reg-password', escapeHtml(formData.get('reg-password')));
    formData.set('reg-email', escapeHtml(formData.get('reg-email')));
    
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

function login(e) {
    e.preventDefault();

    const formData = new FormData(loginForm);

    formData.set('username', escapeHtml(formData.get('username')));
    formData.set('password', escapeHtml(formData.get('password')));

    const xhr = new XMLHttpRequest();

    const logBox = new InformationBox();

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

            const username = formData.get("username");
            const password = formData.get("password");

            switch(statusCode) {
                case 200:
                    logBox.createBox("warning", info, response[info]);
                    user.login(username, password);
                    closeLogInBox();
                    setTimeout(() => {
                        plugin();
                    }, 500);
                    break;
                case 202:
                    logBox.createBox("success", "Success", `Welcome back, ${response.user}`);
                    user.login(username, password);
                    user.confirmation = 1;
                    closeLogInBox();
                    setTimeout(() => {
                        plugin();
                    }, 500);
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

// function getUserData(issuer, callback) {

//     const xhr = new XMLHttpRequest;
//     const logBox = new InformationBox();
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState == 4) {
//             let statusCode = xhr.status;
//             let response = xhr.response;
//             let keys = Object.keys(response);

//             let info = keys[0];
//             if (statusCode !== 200) {
//                 logBox.createBox("error", info, response[info])
//                 callback(null);
//             } else if (statusCode === 200) {
//                 callback(response);
//             }
//         }
//     }

//     xhr.onerror = () => {
//         console.log("something went wrong");
//     }

//     xhr.open("GET", `http://notediary:8081/api/user/${issuer}`, true);
//     xhr.responseType = "json";

//     xhr.send();
// }

function getUserData(issuer) {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest;
        const logBox = new InformationBox();

        xhr.onload = () => {
            let statusCode = xhr.status;
            let response = xhr.response;
            let keys = Object.keys(response);

            let info = keys[0];
            if (statusCode !== 200) {
                reject(logBox.createBox("error", info, response[info]));
            } else if (statusCode === 200) {
                resolve(response);
            }
        }

        xhr.onerror = () => {
            reject(logBox.createBox("error", "Unsuccess", "something went wrong"));
        }

        xhr.open("GET", `http://notediary:8081/api/user/${issuer}`, true);
        xhr.responseType = "json";

        xhr.send();
    });
}

function extendTime() {
    const xhr = new XMLHttpRequest();
    const issuer = user.authentication.issuer();
    xhr.onreadystatechange = () => {

        if (xhr.readyState == 4) {
            const statusCode = xhr.status;
            if (statusCode == 200) {
                // Set time out
                user.extendTime();
            } else {
                // Force logout
                user.logout();
            }
        }
    }

    xhr.onerror = () => {
        console.log("something went wrong... extended time fail!");
    }

    xhr.open("GET", `http://notediary:8081/api/user/${issuer}/`, true);
    xhr.withCredentials = true;

    xhr.send();
}

function getNoteData(issuer, callback){
    if (location.href == "http://notediary:8080/public/profile.html") return

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

function editProfileAPI() {
    return new Promise((resolve, reject) => {
        let profileForm = body.querySelector('.profile-setting-form');

        const xhr = new XMLHttpRequest();
        const logBox = new InformationBox();
        const formData = new FormData(profileForm);
        const submitter = profileSubmitter.getInstead();

        let issuer = user.authentication.issuer()
        
        const prepURL = submitter.submit(issuer);
        
        xhr.onload = () => {
            let statusCode = xhr.status;
            let response = xhr.response;
            let keys = Object.keys(response);

            let info = keys[0];
            if (statusCode == 202) {
                resolve(response);
            } else {
                reject(logBox.createBox("error", info, response[info]));
            }
        }

        xhr.onerror = () => {
            reject(logBox.createBox("error", "Unsuccess", "something went wrong"));
        }

        xhr.open('POST', prepURL, true);

        xhr.withCredentials = true;
        xhr.responseType = 'json';

        xhr.send(formData);
    });
    

    // const notEmptyEmail = confirmToChangeEmailInput.value !== "";
    // const hasChangeEmail = confirmToChangeEmailInput.value !== userData.email;

    // if (GetChangeEmailValue() && ( notEmptyEmail && hasChangeEmail)) {
    //     if (ValidationPassword(userData.username, confirmToChangeEmailInput.value)) {
    //         let newEmail = userEmailInput.value;
    //         UpdateEmail(userData.username, newEmail);
    //     }
    // }

    // const notEmptyPassword = confirmToChangePasswordInput.value !== "";
    
    // if (GetChangePasswordValue() && notEmptyPassword) {
    //     if (ValidationPassword(userData.username, confirmToChangePasswordInput.value) && 
    //         ValidationNewPassword(newPasswordInput.value, confirmNewPasswordInput.value)) {
    //         let newPassword = newPasswordInput.value;
    //         UpdatePassword(userData.username, newPassword);
    //     }
    // }

    // let user;
    // if (GetChangePasswordValue()) {
    //     user = FindUserByValidation(userData.username.toLowerCase(), newPasswordInput.value.toLowerCase());
    // } else {
    //     user = FindUserByValidation(userData.username.toLowerCase(), userData.password.toLowerCase());
    // }

    // let userString = JSON.stringify(user);

    // localStorage.setItem('user', b64EncodeUnicode(userString));
    // location.reload()
}

// function selectProfile(e) {

//     if (e.target.files[0]) {
//         selected = e.target.files[0];
//     }
// }

function uploadImgProfileAPI() {
    // back-end handler this method
    // const filepath = "http://notediary:8081/public/" + selected;
    // console.log(selected);
    
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const logBox = new InformationBox();
        const issuer = user.authentication.issuer();

        // const formDataA = new FormData();
        // use already form is working
        const formData = new FormData(uploadIMGForm);

        xhr.onload = () => {
            let statusCode = xhr.status;
            let response = xhr.response;
            let keys = Object.keys(response);

            let info = keys[0];
            if (statusCode == 200) {
                resolve(response);
                
                // console.log("Upload success...");
            } else {
                reject(logBox.createBox("error", info, response[info]));
            }
        }

        xhr.onerror = () => {
            reject(logBox.createBox("error", "Unsuccess", "something went wrong"));
        }

        xhr.open('POST', `http://notediary:8081/api/user/${issuer}/edit/img-profile`, true);

        xhr.withCredentials = true;
        xhr.responseType = 'json'

        // formDataA.append("file", selected);
        // console.log(formDataA);
        // console.log(formData);
        xhr.send(formData);
        
    })


}

function logout(e) {
    e.preventDefault();
    
    const xhr = new XMLHttpRequest();

    const issuer = user.authentication.issuer();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 401 || xhr.status == 406)) {
            sessionStorage.removeItem('user');

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

function showLoadingBox() {
    loadingBox.classList.remove('hidden');
    loadingBox.classList.add('flex', 'flex-row');
}

function hideLoadingBox() {
    loadingBox.classList.add('hidden');
    loadingBox.classList.remove('flex', 'flex-row');
}

export { signIn, login, getUserData, getNoteData, uploadImgProfileAPI, editProfileAPI, extendTime, logout };