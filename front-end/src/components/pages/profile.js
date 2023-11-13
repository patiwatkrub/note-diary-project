import { uploadImgBtn, uploadImgCloseBtn, OpenUploadImgBox, CloseUploadImgBox, InitailizeUploadImgForm} from "../../utilities/uploadImgForm.js";
import { profileSubmitter } from "../../utilities/profileSubmitter.js";
import { selected, editProfile, selectProfile, uploadImgProfile } from "../../utilities/helper/apiFetcher.js";
import { userSingleton } from "../../utilities/helper/user.js";

const submitter = profileSubmitter.getInstead();

// User input form setting
let userEmailInput = document.querySelector('#user-email');
let confirmToChangeEmailInput = document.querySelector('#confirm-password-to-change-email');
let userPasswordInput = document.querySelector('#user-password');
let confirmToChangePasswordInput = document.querySelector('#confirm-password-to-change-password');
let confirmNewPasswordInput = document.querySelector('#confirm-new-password');

let uploadImgForm = document.querySelector('#upload-profile');
let emailBox = document.querySelector('#user-email-box');
let confirmPasswordToChangeEmailBox = document.querySelector('#confirm-password-to-change-email-box');
let editEmailBtn = emailBox.children[emailBox.childElementCount - 2];
let cancelEmailBtn = emailBox.children[emailBox.childElementCount - 1];

uploadImgBtn?.addEventListener('click', OpenUploadImgBox);
uploadImgCloseBtn?.addEventListener('click', CloseUploadImgBox);
uploadImgForm?.addEventListener('change', selectProfile);
uploadImgForm?.addEventListener('submit', uploadImgProfile);

editEmailBtn?.addEventListener('click', () => {
    editEmailBtn.classList.add('hidden');
    cancelEmailBtn.classList.remove('hidden');
    confirmPasswordToChangeEmailBox.classList.remove('hidden');
    submitter.enableChangeEmail();
    console.log(submitter);
    ToggleChangeEmail();
});

cancelEmailBtn?.addEventListener('click', () => {
    cancelEmailBtn.classList.add('hidden');
    editEmailBtn.classList.remove('hidden');
    confirmPasswordToChangeEmailBox.classList.add('hidden');
    submitter.disableChangeEmail();
    console.log(submitter);
    ToggleChangeEmail();
});

let inputPasswordBox = document.querySelector('#user-password-box');
let inputConfirmPasswordBox = document.querySelector('#confirm-user-password-box');
let confirmPasswordBox = document.querySelector('#new-password-box');
let newPasswordInput = document.querySelector('#new-password')
let editPasswordBtn = document.querySelector('#user-password-box').children[2];
let cancelPasswordBtn = document.querySelector('#confirm-user-password-box').children[2];

let imgProfileSlot = document.querySelector('#profile-img');
let profileForm= document.querySelector('.profile-setting-form');

editPasswordBtn?.addEventListener('click', () => {
    inputPasswordBox.classList.add('hidden');
    inputConfirmPasswordBox.classList.remove('hidden');
    confirmPasswordBox.classList.replace('hidden', 'flex');
    submitter.enableChangePassword();
    console.log(submitter);
    ToggleChangePassword();
});

cancelPasswordBtn.addEventListener('click', () => {
    inputPasswordBox.classList.remove('hidden');
    inputConfirmPasswordBox.classList.add('hidden');
    confirmPasswordBox.classList.replace('flex', 'hidden');
    submitter.disableChangePassword();
    console.log(submitter);
    ToggleChangePassword();
});

InitailizeUploadImgForm();

const user = userSingleton.getInstead();
let userData;

if (user.authentication.isLogIn()) {

    userData = user.getUserObject();
    if (userData) {
        imgProfileSlot.setAttribute('src', userData.user.img_profile);
        userEmailInput.value = userData.user.email;
        userPasswordInput.value = userData.user.password;
    }
}

function ToggleChangeEmail() {
    switch (submitter.wantToChangeEmail()) {
        case 0:
            confirmToChangeEmailInput.required = false;
            userEmailInput.value = userData.user.email;
            break;
        case 1:
            confirmToChangeEmailInput.required = true;
            break;
    }
}

function ToggleChangePassword() {
    switch (submitter.wantToChangePassword()) {
        case 0:
            userPasswordInput.setAttribute("value", userData.user.password);

            confirmToChangePasswordInput.required = false;
            newPasswordInput.required = false;
            confirmNewPasswordInput.required = false;
        break;
        case 1:
            userPasswordInput.setAttribute("value", "");

            confirmToChangePasswordInput.required = true;
            newPasswordInput.required = true;
            confirmNewPasswordInput.required = true;
        break;
    }
}

profileForm?.addEventListener('submit', editProfile);

let deleteUserBtn = document.querySelector('#delete-user-btn');

deleteUserBtn?.addEventListener('click', () => {

    localStorage.removeItem('user');

    location.reload();
});