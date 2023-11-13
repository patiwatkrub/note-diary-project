import { linkExpandDescription, linkMinimizeDescription, expand, minimize, initializeDescriptionControl } from "../../utilities/descriptionControl.js";

let diaryForm = document.querySelector('#diary-form');

function NewDiary(e) {
    e.preventDefault()

    let topic = document.querySelector('#diary-topic');
    let noteType = document.querySelector('input[name="diary-type"]:checked');
    let detail = document.querySelector('#diary-detail');

    console.log("new diary work...");
    console.log("topic:", topic.value);
    // console.log("note type:", diaryNote, diaryNote.value);
    // console.log("todo type:", todoList, todoList.value);
    // console.log("note type:", diaryNote.value);
    // console.log("todo type:", todoList.value);
    console.log("diary-type:", noteType.value);
    console.log("detail:\n", detail.value);

} 
function toggleDiaryForm() {
    if (location.href === "http://notediary:8080/public/profile.html") {
        return;
    }

    let diaryForm = document.querySelector('#diary-form');
    let diaryFormBox = diaryForm.parentElement;
    let inputEl = diaryForm.querySelectorAll('input');
    let textAreaEl = diaryForm.querySelector('textarea');
    let submitBtn = diaryForm.querySelector('button');

    let check = diaryFormBox.classList.contains('is-login');
    if (check) {
        inputEl.forEach(el => {
            el.disabled = false;
        });
        textAreaEl.disabled = false;
        submitBtn.disabled = false;
    } else {
        inputEl.forEach(el => {
            el.disabled = true;
        });
        textAreaEl.disabled = true;
        submitBtn.disabled = true;
    }
}

initializeDescriptionControl();

linkExpandDescription?.addEventListener('click', expand);
linkMinimizeDescription?.addEventListener('click', minimize);

export { diaryForm, NewDiary, toggleDiaryForm };