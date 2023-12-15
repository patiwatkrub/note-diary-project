let diaryForm = document.querySelector('#diary-form');
let topicInput = document.querySelector('#diary-topic');
let dairyTypeInput = document.querySelectorAll('input[name="diary-type"]');
let detail = document.querySelector('#diary-detail');

let todoListEditor = document.querySelector('#todo-list-box')
let taskList = document.querySelector('#todo-list-tasks');
let todoListInput = document.querySelector('#todo-list-input');
let addTodoListBtn = document.querySelector('#todo-list-input-btn');

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

function getDiaryDetailContent(diaryType) {
    switch (diaryType.toLowerCase()) {
        case "diarynote" :
            return detail.value;
        case "todolist" :
            return JSON.stringify(todoListTasks);
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

dairyTypeInput.forEach( choice => {
    choice.addEventListener("change", () => {
        switch (choice.value.toLowerCase()) {
            case "diarynote" :
                detail.classList.remove('hidden');
                todoListEditor.classList.add('hidden');
                break;
            case "todolist" :
                detail.classList.add('hidden');
                todoListEditor.classList.remove('hidden');
                break;
        }
    })
})

addTodoListBtn?.addEventListener('click', () => {
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
});

export { diaryForm, topicInput, getDiaryTopic, getDiaryType, getDiaryDetailContent };

