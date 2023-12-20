let diaryForm = document.querySelector('#diary-form');
let topicInput = document.querySelector('#diary-topic');
let diaryTypeInput = document.querySelectorAll('input[name="diary-type"]');
let detail = document.querySelector('#diary-detail');

let todoListEditor = document.querySelector('#todo-list-box')
let taskList = document.querySelector('#todo-list-tasks');
let todoListInput = document.querySelector('#todo-list-input');
let addTodoListBtn = document.querySelector('#todo-list-input-btn');

let clearDiaryContextBtn = document.querySelector('.note-clear-btn');

const diaries = document.querySelector('#diaries');

let todoListTasks = {
    TodoList : [],
}

function getDiaryTopic() {
    return topicInput.value;
}

function getDiaryType() {
    let type = document.querySelector('input[name="diary-type"]:checked').value;
    return type;
}

function prepareTask() {
    let taskBox = document.createElement('div');
    let task = document.createElement('p');
    let btn = document.createElement('span');
    
    btn.classList.add("todo-list-task-btn");
    btn.innerHTML = `<i class="fa fa-trash"></i>`;
    btn.addEventListener('click', () => {
        let parentNode = btn.parentNode;
        let taskContext = parentNode.children[0].innerHTML;

        todoListTasks.TodoList = todoListTasks["TodoList"].filter( item => {
            return item.Task != taskContext;
        })

        taskList.removeChild(parentNode);
    })

    taskBox.classList.add("todo-list-task");
    task.classList.add("todo-list-task-context");
    task.innerHTML = todoListInput.value;
    todoListTasks["TodoList"].push({
        "Task": todoListInput.value,
        "IsDone" : false
    })

    taskList.appendChild(taskBox);

    taskBox.appendChild(task);
    taskBox.appendChild(btn);

    todoListInput.value = '';
}

function getDiaryDetailContent(diaryType) {
    switch (parseInt(diaryType)) {
        case 0 :
            return detail.value;
        case 1 :
            let convStr = JSON.stringify(todoListTasks);
            detail.value = convStr;
            return convStr;
    }
}
// From Internet
// diarySelectedType.forEach(selectType => {
//     selectType.addEventListener("change", function(e) {
//         let selected = e.target.value;
//         console.log(selected);

//         switch (selected.toLowerCase()) {
//             case "diarynote" :
//                 detail.classList.remove('hidden');
//                 break;
//             case "todolist" :
//                 detail.classList.add('hidden');
//                 break;
//         }
//     })
// });

// Form my adapt
// diarySelectedType?.addEventListener("change" ,() => {
//     let noteType = document.querySelector('input[name="diary-type"]:checked');
//     console.log("diary-type:", noteType.value);
// })

function setDiaryForm(noteContent) {

    topicInput.value = noteContent["Title"];

    diaryTypeInput.forEach( choice => {
        if (noteContent["DiaryType"] == choice.value) choice.checked = true;
    })

    switch (parseInt(noteContent["DiaryType"])) {
        case 0:
            detail.classList.remove('hidden');
            todoListEditor.classList.add('hidden');
            break;
        case 1:
            detail.classList.add('hidden');
            todoListEditor.classList.remove('hidden');
            break;
    }

    detail.value = noteContent["Detail"];

    diaryForm.setAttribute('note-id', noteContent["NoteID"]);
    diaryForm.setAttribute('data-action', 'edit');
}

// Clear data on Diary's form with user authentication
function clearDiaryForm() {
    detail.classList.remove('hidden');
    todoListEditor.classList.add('hidden');

    topicInput.value = '';

    diaryTypeInput.forEach( choice => {
        choice.checked = false;
    })

    todoListTasks["TodoList"] = [];
    taskList.innerHTML = '';
    detail.value = '';
    todoListInput.value = '';

    diaryForm.removeAttribute('note-id');
    diaryForm.setAttribute('data-action', 'make');
}

diaryTypeInput.forEach( choice => {
    choice.addEventListener("change", () => {
        let type = parseInt(choice.value);
        switch (type) {
            case 0 :
                detail.classList.remove('hidden');
                todoListEditor.classList.add('hidden');
                break;
            case 1 :
                detail.classList.add('hidden');
                todoListEditor.classList.remove('hidden');
                break;
        }
    })
})

addTodoListBtn?.addEventListener('click',  prepareTask);

export { diaries, diaryForm, topicInput, setDiaryForm, getDiaryTopic, getDiaryType, getDiaryDetailContent, clearDiaryContextBtn, clearDiaryForm };

