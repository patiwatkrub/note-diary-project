import { linkExpandDescription, linkMinimizeDescription, expand, minimize, initializeDescriptionControl } from "../../utilities/descriptionControl.js";
import { diaryForm,  getDiaryTopic, getDiaryType, getDiaryDetailContent } from "../../utilities/diaryForm.js";

const taskListBox = document.querySelector('#diaries');

if (taskListBox.children.length == 0) {
    taskListBox.classList.remove("overflow-y-scroll");
    taskListBox.parentElement.classList.replace("opacity-100", "opacity-70");
//     taskListBox.innerHTML = `No Content`;
} else {
    taskListBox.classList.add("overflow-y-scroll");
    taskListBox.parentElement.classList.replace("opacity-70", "opacaty-100");
}

function NewDiary(e) {
    e.preventDefault()

    let noteType = getDiaryType();

    console.log("New diary...");
    console.log("Topic:", getDiaryTopic());
    console.log("Diary Type:", noteType);
    console.log("detail:\n", getDiaryDetailContent(noteType));

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