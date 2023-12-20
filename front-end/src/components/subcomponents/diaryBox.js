import { editNote, deleteNote, getNote } from "../../utilities/helper/apiFetcher.js";
import { clearDiaryForm, diaries, diaryForm, setDiaryForm } from "../../utilities/diaryForm.js";
import { InformationBox } from "./informationBox.js";

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
        return ['diary-detail']
    }

    connectedCallback() {
        this.render();

        this.shadowRoot.querySelector('.diary-edit-btn').addEventListener('click', async () => { 
            if (this.diaryType == 1) {
                const logBox = new InformationBox();

                logBox.createBox("info", "Info", `.Sorry, you are edit context only "Diary Note" with "TodoList" can toggle only task for edit`);
                return;
            }

            // call get note's API 
            const note = await getNote(this.noteID);

            setDiaryForm(note);
        });

        this.shadowRoot.querySelector('.diary-close-btn').addEventListener('click', () => { 
            console.log(this.noteID + " deleted.");
            diaries.querySelectorAll('diary-box').forEach( diaryBox => {
                
                if (diaryBox.getAttribute('note-id') == this.noteID) {
                    diaries.removeChild(diaryBox);
                    
                    // call delete note's API
                    deleteNote(this.noteID);
                }
            })
            
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // make sure it is mounted first
        if (this.isConnected) {
            switch (name) {
            case 'diary-detail':
                this.diaryDetail = newValue || '';
                this.render();
                break;
            }
        }
    }

    disconnectedCallback() {

        this.shadowRoot.querySelector('.diary-edit-btn').removeEventListener('click', async () => { 
            if (this.diaryType == 1) {
                const logBox = new InformationBox();

                logBox.createBox("info", "Info", `.Sorry, you are edit context only "Diary Note" with "TodoList" can toggle only task for edit`);
                return;
            }

            const note = await getNote(this.noteID);

            setDiaryForm(note);
        });

        this.shadowRoot.querySelector('.diary-close-btn').removeEventListener('click', () => { 
            console.log(this.noteID + " deleted.");
            diaries.querySelectorAll('diary-box').forEach( diaryBox => {
                
                if (diaryBox.getAttribute('note-id') == this.noteID) {
                    diaries.removeChild(diaryBox);

                    deleteNote(this.noteID);
                }
            })
            
        });

        if (this.diaryType == 1) {
            let liEL = this.querySelectorAll('li');

            liEL.forEach( li => {

                li.removeEventListener('click', async (e) => {
                        
                    let done = e.target.getAttribute("data-done");
                    
                    if (done === "false") {
                        // Set UI 
                        e.target.setAttribute("data-done", "true"); 
                        e.target.querySelector('img').setAttribute("src", "../src/assets/icons/checkmark.png");

                        this.#todoListDetail.TodoList[index].IsDone = true;

                        this.diaryDetail = JSON.stringify(this.#todoListDetail);

                        setDiaryForm({
                            "NoteID" : this.noteID,
                            "Title" : this.diaryTopic,
                            "DiaryType" : this.diaryType,
                            "Detail": this.diaryDetail
                        })

                        await editNote(this.noteID);

                        diaryForm.setAttribute('data-action', 'make');
                        diaryForm.removeAttribute('note-id');
                        
                        clearDiaryForm();
                    }
                });

                li.removeEventListener('mouseleave', (e) => {
                        
                        let done = e.target.getAttribute("data-done");
                        
                        if (done === "false") {
                            li.querySelector("img").style.display = "none";
                        }
                });

                li.removeEventListener('mouseenter', (e) => {
                        let done = e.target.getAttribute("data-done");

                        if (done === "false") {
                            li.querySelector("img").style.display = "inline";
                        }
                    });
            });
        }
    }

    get style() {
        return `
        <style>
            * {
                font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                font-size : 16px;
            }

            .diary-close-btn {
                display: inline;
                position: absolute;
                height : 20px;
                right: 5px;
                top: -20px;
            }

            .diary-edit-btn {
                position: absolute;
                height : 20px;
                right: 25px;
                top: -20px;
            }

            .diary-close-btn:hover, .diary-edit-btn:hover {
                color : red;
            }
            
            h3 {
                position : relative;
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
            <span class="diary-close-btn"> &cross; </span>
            <span class="diary-edit-btn"> &#9998; </span>
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
            <span class="diary-close-btn"> &cross; </span>
            <span class="diary-edit-btn"> &#9998; </span>
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
        this.hasAttribute("diary-type") ? this.#diaryType = parseInt(this.getAttribute("diary-type")) : this.#diaryType = -1;
        switch (this.#diaryType) {
            case 0 :
                this.#diaryDetail = this.querySelector(`p[slot="diary-detail"]`).textContent;
                this.#noteDetail = this.#diaryDetail;
                this.shadowRoot.innerHTML = `${this.style}${this.diaryNoteTemplate}`;
                break;
            case 1 :
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

                    li.addEventListener('click', async (e) => {
                        
                        let done = e.target.getAttribute("data-done");
                        
                        if (done === "false") {
                            // Set UI 
                            e.target.setAttribute("data-done", "true"); 
                            e.target.querySelector('img').setAttribute("src", "../src/assets/icons/checkmark.png");

                            this.#todoListDetail.TodoList[index].IsDone = true;

                            this.diaryDetail = JSON.stringify(this.#todoListDetail);

                            setDiaryForm({
                                "NoteID" : this.noteID,
                                "Title" : this.diaryTopic,
                                "DiaryType" : this.diaryType,
                                "Detail": this.diaryDetail
                            })

                            await editNote(this.noteID);

                            diaryForm.setAttribute('data-action', 'make');
                            diaryForm.removeAttribute('note-id');
                            
                            clearDiaryForm();
                        }
                    });
                    
                    li.addEventListener('mouseenter', (e) => {
                        let done = e.target.getAttribute("data-done");

                        if (done === "false") {
                            li.querySelector("img").style.display = "inline";
                        }
                    });

                    li.addEventListener('mouseleave', (e) => {
                        
                        let done = e.target.getAttribute("data-done");
                        
                        if (done === "false") {
                            li.querySelector("img").style.display = "none";
                        }
                    });
                })
                break;
        }

    }

    get noteID() {
        return this.#noteId;
    }

    get diaryTopic() {
        return this.#diaryTopic;
    }

    get diaryType() {
        return this.#diaryType;
    }

    get diaryDetail() {
        return this.#diaryDetail;
    }

    set diaryTopic(newTopic) {
        this.#diaryTopic = newTopic;
    }

    set diaryDetail(newDetail) {
        this.#diaryDetail = newDetail;
    }
} 

customElements.define('diary-box', DiaryBox);