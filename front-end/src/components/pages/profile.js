import { uploadImgBtn, uploadImgCloseBtn, OpenUploadImgBox, CloseUploadImgBox, InitailizeUploadImgForm} from "../../utilities/uploadImgForm.js";
import { updateUserData } from "../layouts/header.js";
import { profileSubmitter } from "../../utilities/profileSubmitter.js";
import { uploadImgProfileAPI, editProfileAPI, deleteUserAPI } from "../../utilities/helper/apiFetcher.js";
import { userSingleton } from "../../utilities/helper/user.js";

let userData;
const submitter = profileSubmitter.getInstead();
const user = userSingleton.getInstead();

InitailizeUploadImgForm();

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
uploadImgForm?.addEventListener('submit', uploadImgProfile);

async function editProfile(e) {
    e.preventDefault();
    try {
        // Replace response API into userData
        const response = await editProfileAPI();
        
        // Update UI in header and form
        user.setResponseData(response);

        userData = user.getUserObject();

        updateUserData(userData);

        setFormData(userData);
        // Reset toggle form
        resetToggleForm();
    } catch(err) {
        console.error(err);
    }
}

async function uploadImgProfile(e) {
    e.preventDefault();
    try {
        const response = await uploadImgProfileAPI();

        user.setResponseData(response);
        updateUserData(response);

        setFormData(response);

        CloseUploadImgBox();
    } catch (err) {
        console.error(err);
    }
    
}

editEmailBtn?.addEventListener('click', () => {
    submitter.enableChangeEmail();
    ToggleChangeEmail();
});

cancelEmailBtn?.addEventListener('click', () => {
    submitter.disableChangeEmail();
    ToggleChangeEmail();
});

let inputPasswordBox = document.querySelector('#user-password-box');
let inputConfirmPasswordBox = document.querySelector('#confirm-user-password-box');
let confirmPasswordBox = document.querySelector('#new-password-box');
let newPasswordInput = document.querySelector('#new-password')
let editPasswordBtn = document.querySelector('#user-password-box').children[2];
let cancelPasswordBtn = document.querySelector('#confirm-user-password-box').children[2];

let imgProfileSlot = document.querySelector('#profile-img');
let profileForm = document.querySelector('.profile-setting-form');

editPasswordBtn?.addEventListener('click', () => {
    submitter.enableChangePassword();
    ToggleChangePassword();
});

cancelPasswordBtn.addEventListener('click', () => {
    submitter.disableChangePassword();
    ToggleChangePassword();
});

if (user.authentication.isLogIn()) {

    userData = user.getUserObject();
    setFormData(userData);
} else {
    location.href = 'http://notediary:8080/public/homepage.html';
}

function setFormData(userData) {
    if (userData) {
        let email = userData.user ? userData.user.email : userData.success.email;
        let password = userData.user ? userData.user.password : userData.success.password;;
        let img_profile = userData.user ? userData.user.img_profile : userData.success.img_profile;

        imgProfileSlot.setAttribute('src', img_profile);
        userEmailInput.value = email;
        userPasswordInput.value = password;
    }
}

function resetToggleForm() {
    submitter.disableChangeEmail();
    submitter.disableChangePassword();
    ToggleChangeEmail();
    ToggleChangePassword();

    confirmToChangeEmailInput.value = '';
    userPasswordInput.setAttribute("value", "");
    inputConfirmPasswordBox.setAttribute("value", "");
    confirmPasswordBox.setAttribute("value", "");
}

function ToggleChangeEmail() {
    switch (submitter.wantToChangeEmail()) {
        case 0:
            cancelEmailBtn.classList.add('hidden');
            editEmailBtn.classList.remove('hidden');
            confirmPasswordToChangeEmailBox.classList.add('hidden');
            confirmToChangeEmailInput.required = false;
            userEmailInput.value = userData.user ? userData.user.email : userData.success.email;
            break;
        case 1:
            editEmailBtn.classList.add('hidden');
            cancelEmailBtn.classList.remove('hidden');
            confirmPasswordToChangeEmailBox.classList.remove('hidden');
            confirmToChangeEmailInput.required = true;
            break;
    }
}

function ToggleChangePassword() {
    switch (submitter.wantToChangePassword()) {
        case 0:
            inputPasswordBox.classList.remove('hidden');
            inputConfirmPasswordBox.classList.add('hidden');
            confirmPasswordBox.classList.replace('flex', 'hidden');

            userPasswordInput.setAttribute("value", userData.user ? userData.user.password : userData.success.password);

            confirmToChangePasswordInput.required = false;
            newPasswordInput.required = false;
            confirmNewPasswordInput.required = false;
        break;
        case 1:
            inputPasswordBox.classList.add('hidden');
            inputConfirmPasswordBox.classList.remove('hidden');
            confirmPasswordBox.classList.replace('hidden', 'flex');

            userPasswordInput.setAttribute("value", "");

            confirmToChangePasswordInput.required = true;
            newPasswordInput.required = true;
            confirmNewPasswordInput.required = true;
        break;
    }
}

profileForm?.addEventListener('submit', editProfile);

let deleteUserBtn = document.querySelector('#delete-user-btn');

deleteUserBtn?.addEventListener('click', deleteUser);

async function deleteUser(e) {
    e.preventDefault();
    try {
        const success = await deleteUserAPI();

        if (success == 0) {
            return;
        }

        setTimeout(() => {
            user.logout();

            location.reload();
        }, 2000);
    } catch (err) {
        console.error(err);
    }
}