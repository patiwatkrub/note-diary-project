import { body } from "../../src/utilities/helper/body.js";

let uploadIMGForm = body.querySelector('#upload-profile');
let imgFile = body.querySelector('#upload-img');

let uploadImgBox = body.querySelector('#upload-img-box');
let uploadImgBtn = body.querySelector('#upload-profile-img');
let uploadImgCloseBtn = body.querySelector('#upload-img-close-btn');

function InitailizeUploadImgForm() {
    uploadIMGForm = body.querySelector('#upload-profile');
    imgFile = body.querySelector('#upload-img');
    
    uploadImgBox = body.querySelector('#upload-img-box');
    uploadImgBtn = body.querySelector('#upload-profile-img');
    uploadImgCloseBtn = body.querySelector('#upload-img-close-btn');
}
function OpenUploadImgBox() {
    uploadImgBox.classList.remove('hidden');
}

function CloseUploadImgBox() {
    uploadImgBox.classList.add('hidden');
    clearUploadImgForm();
}

function clearUploadImgForm() {
    imgFile.value = '';
}

export { uploadIMGForm, imgFile, uploadImgBtn, uploadImgCloseBtn, OpenUploadImgBox, CloseUploadImgBox, InitailizeUploadImgForm };