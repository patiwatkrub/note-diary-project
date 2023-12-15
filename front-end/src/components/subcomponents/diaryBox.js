const dumpTodoList = {
    TodoList:[
        {
            "Task":"Take a bath",
            "IsDone": true 
        },
        {
            "Task":"Fill pet food",
            "IsDone":true}
    ]
}

export class DiaryBox extends HTMLElement {

    #noteId = "";
    #diaryTopic = "";
    #diaryType = "";
    #diaryDetail = "";
    #noteDetail = "";
    #todoListDetail = {
        TodoList : []
    }
    
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['diary-topic', 'diary-detail']
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // make sure it is mounted first
        if (this.isConnected) {
            switch (name) {
            case 'diary-topic':
                this.#diaryTopic = newValue || '';
                break;
            case 'diary-detail':
                this.diaryDetail = newValue || '';
                break;
            }
        
            this.render()
        }
    }

    get style() {
        return `
        <style>
            * {
                font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                font-size : 16px;
            }

            h3 {
                text-align : start;
            }

            h3 ::slotted([slot="diary-topic"]) {
                font-weight: 200;
            }

            div {
                grid-row: span 2 / span 2;
                width : auto;
                height : auto;
                text-align : justify;
                text-overflow : ellipsis;
                word-break: break-all;
            }

            div ::slotted([slot="diary-detail"]) {
                text-indent: 1rem;
            }

            div > ul {
                list-style-position : inside;
                margin-left : 1.25rem;
            }
        </style>
        `;
    }

    get diaryNoteTemplate() {
        return `
        <h3>
            <b>Topic:</b><br>
            <slot name="diary-topic">${this.#diaryTopic ? this.#diaryTopic : `<span style="font-weight : 200;">Topic Space</span>`}</slot>
        </h3>
        <div>
            <b>Detail:</b><br>
            <slot name="diary-detail">${this.#noteDetail ? this.#noteDetail : `<p style="text-indent : 16px; ">No content</p>`}</slot>
        </div>
        `;
    }

    get todoListTemplate() {
        return `
        <h3>
            <b>Topic:</b><br>
            <slot name="diary-topic">${this.#diaryTopic ? this.#diaryTopic : `<span style="font-weight : 200;">Topic Space</span>`}</slot>
        </h3>
        <div style="overflow-y: scroll;">
            <b>Detail:</b><br>
            <slot name="diary-detail">${this.#todoListDetail["TodoList"].length > 0 ? `` : `<p style="text-indent : 16px; ">No content</p>`}
            </slot>
        </div>
        `;
    }
    // add delete btn and edit btn
    render() {
        this.classList.add("diary-box");
        this.hasAttribute("note-id") ? this.#noteId = this.getAttribute("note-id") : this.#noteId = "";
        this.hasAttribute("diary-type") ? this.#diaryType = this.getAttribute("diary-type") : this.#diaryType = "";
        switch (this.#diaryType.toLowerCase()) {
            case "diarynote" :
                this.#diaryDetail = this.querySelector(`p[slot="diary-detail"]`).textContent;
                this.#noteDetail = this.#diaryDetail;
                this.shadowRoot.innerHTML = `${this.style}${this.diaryNoteTemplate}`;
                break;
            case "todolist" :
                // Get slot tap content and convert to object
                this.#diaryDetail = this.querySelector(`ul[slot="diary-detail"]`).textContent;
                let convJSON = JSON.parse(this.#diaryDetail);
                
                // Initial value
                this.#todoListDetail.TodoList = convJSON["TodoList"];
                
                // Prepare tasks content
                let taskListEl = this.#todoListDetail["TodoList"].map(task => {
                    return `<li data-done="${task.IsDone}">${task.IsDone ? `<img src="../src/assets/icons/checkmark.png" style="display:inline;margin:4px;text-align:center;width:16px;height:16px;">` : `<img src="../src/assets/icons/checkmark.gif" style="display:none;margin:4px;text-align:center;width:16px;height:16px;">`}${task.Task}</li>`
                }).join('');

                // Rewrite to slot tag
                this.querySelector('ul[slot="diary-detail"]').innerHTML = taskListEl;
                
                // Render
                this.shadowRoot.innerHTML = `${this.style}${this.todoListTemplate}`;

                // Add interaction
                let liEl = this.querySelectorAll(`li`);

                liEl.forEach( (li, index) => {

                    li.addEventListener('click', (e) => {
                        
                        let done = e.target.getAttribute("data-done");
                        
                        if (done === "false") {
                            // Set UI
                            e.target.setAttribute("data-done", "true");
                            e.target.querySelector('img').setAttribute("src", "../src/assets/icons/checkmark.png")

                            // Update field, call api update to db
                            // console.log(index);
                        }
                    })
                    
                    li.addEventListener('mouseenter', (e) => {
                        let done = e.target.getAttribute("data-done");

                        if (done === "false") {
                            li.querySelector("img").style.display = "inline";
                        }
                    })

                    li.addEventListener('mouseleave', (e) => {
                        
                        let done = e.target.getAttribute("data-done");
                        
                        if (done === "false") {
                            li.querySelector("img").style.display = "none";
                        }
                    })
                })
                break;
        }
    }
}

customElements.define('diary-box', DiaryBox);