import { body } from "../../src/utilities/helper/body.js";

let selected;

let imgFile;

let uploadImgBox;
let uploadImgBtn;
let uploadImgCloseBtn;

function InitailizeUploadImgForm() {
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

function SelectProfile(e) {
    if (e.target.files[0]) {
        selected = e.target.files[0].name;
    }
}

function UploadProfile(e) {
    e.preventDefault();
    
    console.log(selected);
    console.log("Upload success...");

    // location.reload();
}

function clearUploadImgForm() {
    imgFile.value = '';
}

export { uploadImgBtn, uploadImgCloseBtn, OpenUploadImgBox, CloseUploadImgBox, SelectProfile, UploadProfile, InitailizeUploadImgForm };