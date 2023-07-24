import { uploadImgBtn, uploadImgCloseBtn, OpenUploadImgBox, CloseUploadImgBox, InitailizeUploadImgForm, UploadProfile, SelectProfile } from "../../utilities/uploadImgForm.js";
import { UnicodeDecodeB64, b64EncodeUnicode } from "../../../src/utilities/helper/generateSecureKey.js";
import { userData } from "../../app.js";
import { DeleteUser, FindUserByValidation, UpdateEmail, UpdatePassword, ValidationPassword } from "../../utilities/helper/user.js";

InitailizeUploadImgForm();

let isLogic = localStorage.getItem('user');
if (isLogic) {
    let username = document.querySelector('#profile-user-box');
    let password = document.querySelector('#user-password');
    let email = document.querySelector('#user-email');
    let userProfileImg = document.querySelector('#profile-img');

    username.innerHTML = `<div>
        <span>
            ${userData.username}
        </span>
        <span class="absolute -translate-y-3">
            <button id='delete-user-btn' class="w-6 h-6 bg-red-600 rounded-lg hover:opacity-75">
                <img src="../src/assets/icons/icons8-delete-32.png" alt="delete-user"/>
            </button>
        </span>
    </div>`;
    password.value = userData.password;
    email.value = userData.email;
    userProfileImg.src = UnicodeDecodeB64(userData.imgProfile);
} else {
    location.href = "../../../public/homepage.html";
}

let uploadImgForm = document.querySelector('#upload-profile');

uploadImgBtn?.addEventListener('click', OpenUploadImgBox);
uploadImgCloseBtn?.addEventListener('click', CloseUploadImgBox);
uploadImgForm?.addEventListener('change', SelectProfile);
uploadImgForm?.addEventListener('submit', UploadProfile);

let emailBox = document.querySelector('#user-email-box');
let confirmPasswordToChangeEmailBox = document.querySelector('#confirm-password-to-change-email-box');
let editEmailBtn = emailBox.children[emailBox.childElementCount - 2];
let cancelEmailBtn = emailBox.children[emailBox.childElementCount - 1];

editEmailBtn?.addEventListener('click', () => {
    editEmailBtn.classList.add('hidden');
    cancelEmailBtn.classList.remove('hidden');
    confirmPasswordToChangeEmailBox.classList.remove('hidden');

    ToggleChangeEmail();
});

cancelEmailBtn?.addEventListener('click', () => {
    cancelEmailBtn.classList.add('hidden');
    editEmailBtn.classList.remove('hidden');
    confirmPasswordToChangeEmailBox.classList.add('hidden');

    ToggleChangeEmail();
});

let inputPasswordBox = document.querySelector('#user-password-box');
let inputConfirmPasswordBox = document.querySelector('#confirm-user-password-box');
let confirmPasswordBox = document.querySelector('#new-password-box');
let editPasswordBtn = document.querySelector('#user-password-box').children[2];
let cancelPasswordBtn = document.querySelector('#confirm-user-password-box').children[2];

editPasswordBtn?.addEventListener('click', () => {
    inputPasswordBox.classList.add('hidden');
    inputConfirmPasswordBox.classList.remove('hidden');
    confirmPasswordBox.classList.replace('hidden', 'flex');

    ToggleChangePassword();
});

cancelPasswordBtn.addEventListener('click', () => {
    inputPasswordBox.classList.remove('hidden');
    inputConfirmPasswordBox.classList.add('hidden');
    confirmPasswordBox.classList.replace('flex', 'hidden');

    ToggleChangePassword();
});

let profileForm = document.querySelector('.profile-setting-form');

// User input form setting
let userEmailInput = document.querySelector('#user-email');
let confirmToChangeEmailInput = document.querySelector('#confirm-password-to-change-email');
let userPasswordInput = document.querySelector('#user-password');
let confirmToChangePasswordInput = document.querySelector('#confirm-password-to-change-password');
let newPasswordInput = document.querySelector('#new-password');
let confirmNewPasswordInput = document.querySelector('#confirm-new-password');

let _wantToChangeEmail = false;
let _wantToChangePassword = false;

function GetChangeEmailValue() {
    return _wantToChangeEmail;
}

function GetChangePasswordValue() {
    return _wantToChangePassword;
}

function ToggleChangeEmail() {
    _wantToChangeEmail = !_wantToChangeEmail;

    if (_wantToChangeEmail) {
        confirmToChangeEmailInput.required = true;
    } else {
        userEmailInput.value = userData.email;
        confirmToChangeEmailInput.value = '';;

        confirmToChangeEmailInput.required = false;
    }
}

function ToggleChangePassword() {
    _wantToChangePassword = !_wantToChangePassword;

    if (_wantToChangePassword) {
        confirmToChangePasswordInput.required = true;
        newPasswordInput.required = true;
        confirmNewPasswordInput.required = true;
    } else {
        userPasswordInput.value = userData.password;
        confirmToChangePasswordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';

        confirmToChangePasswordInput.required = false;
        newPasswordInput.required = false;
        confirmNewPasswordInput.required = false;
    }
}

function ValidationNewPassword(newPassword, confirmNewPassword) {
    return newPassword === confirmNewPassword;
}

profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const notEmptyEmail = confirmToChangeEmailInput.value !== "";
    const hasChangeEmail = confirmToChangeEmailInput.value !== userData.email;

    if (GetChangeEmailValue() && ( notEmptyEmail && hasChangeEmail)) {
        if (ValidationPassword(userData.username, confirmToChangeEmailInput.value)) {
            let newEmail = userEmailInput.value;
            UpdateEmail(userData.username, newEmail);
        }
    }

    const notEmptyPassword = confirmToChangePasswordInput.value !== "";
    
    if (GetChangePasswordValue() && notEmptyPassword) {
        if (ValidationPassword(userData.username, confirmToChangePasswordInput.value) && 
            ValidationNewPassword(newPasswordInput.value, confirmNewPasswordInput.value)) {
            let newPassword = newPasswordInput.value;
            UpdatePassword(userData.username, newPassword);
        }
    }

    let user;
    if (GetChangePasswordValue()) {
        user = FindUserByValidation(userData.username.toLowerCase(), newPasswordInput.value.toLowerCase());
    } else {
        user = FindUserByValidation(userData.username.toLowerCase(), userData.password.toLowerCase());
    }

    let userString = JSON.stringify(user);

    localStorage.setItem('user', b64EncodeUnicode(userString));
    location.reload()
});

let deleteUserBtn = document.querySelector('#delete-user-btn');

deleteUserBtn?.addEventListener('click', () => {
    DeleteUser(userData);

    localStorage.removeItem('user');

    location.reload();
});