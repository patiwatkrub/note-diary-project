import { linkExpandDescription, linkMinimizeDescription, expand, minimize, initializeDescriptionControl } from "../../utilities/descriptionControl.js";
import { diaryForm,  getDiaryTopic, getDiaryType, getDiaryDetailContent, clearDiaryForm, clearDiaryContextBtn, diaries } from "../../utilities/diaryForm.js";
import { editNote, makeNote } from "../../utilities/helper/apiFetcher.js";

function taskListBoxHasChild() {
    if (diaries.children.length == 0) {
        diaries.classList.remove("overflow-y-scroll");
        diaries.parentElement.classList.replace("opacity-100", "opacity-70");
    } else {
        diaries.classList.add("overflow-y-scroll");
        diaries.parentElement.classList.replace("opacity-70", "opacaty-100");
    }
}

function createDiaryBox(response) {
    let diaryBox = document.createElement('diary-box');
    let topic = document.createElement('span');
    let diaryID = response["NoteID"];
    let diaryTopic = response["Title"];
    let diaryType = response["DiaryType"];
    let detail = '';

    switch (diaryType) {
        case 0 :
            detail = document.createElement('p');
            break;
        case 1 :
            detail = document.createElement('ul');
            break;
    }
    diaryBox.setAttribute("note-id", diaryID);
    diaryBox.setAttribute("diary-type", diaryType);
    topic.setAttribute("slot", "diary-topic");
    topic.innerHTML = diaryTopic;
    detail.setAttribute("slot", "diary-detail");

    // Having cut special character.
    detail.innerHTML = response["Detail"].replace(`[\\]`, "");

    diaryBox.appendChild(topic);
    diaryBox.appendChild(detail);

    diaries.appendChild(diaryBox);

    taskListBoxHasChild();
}

async function NewDiary(e) {
    e.preventDefault();

    const method = diaryForm.getAttribute("data-action");

    const diaryType = getDiaryType();
    getDiaryDetailContent(diaryType);

    switch (method) {
        case "make" :
            let responseMakeNote = await makeNote();

            createDiaryBox(responseMakeNote["success"]);

            clearDiaryForm();
            break;
        case "edit" :
            const noteID = diaryForm.getAttribute('note-id');

            let responseEditNote = await editNote(noteID);

            const diaryBox = document.querySelectorAll('diary-box');

            diaryBox.forEach( diary => {
                if (responseEditNote["NoteID"] == diary.getAttribute('note-id')) {
                    
                    if (diary.getAttribute('diary-type') !== "0") return;
                    
                    diary.querySelector('p[slot="diary-detail"]').textContent = responseEditNote["Detail"];
                }
            })

            diaryForm.setAttribute('data-action', 'make');
            diaryForm.removeAttribute('note-id');

            clearDiaryForm();
            break;
    }
} 

function toggleDiaryForm() {
    if (location.href === "http://notediary:8080/") {
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
        clearDiaryContextBtn.disabled = false;
        submitBtn.disabled = false;
    } else {
        inputEl.forEach(el => {
            el.disabled = true;
        });
        textAreaEl.disabled = true;
        clearDiaryContextBtn.disabled = true;
        submitBtn.disabled = true;
    }
}

initializeDescriptionControl();

linkExpandDescription?.addEventListener('click', expand);
linkMinimizeDescription?.addEventListener('click', minimize);

export { diaryForm, NewDiary, toggleDiaryForm, createDiaryBox };