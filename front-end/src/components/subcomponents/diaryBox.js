export class DiaryBox extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    get style() {
        return `
        <style>
            :host {
                display : grid;
                grid-row : 3;
                column-gap : 8px;
                box-sizing : content-box;
                margin : 0px 20px;
                padding : 32px;
                width : auto;
                hight : 200px;
                background-color: #FFFF;
                border-radius: 0.5rem;
                opacity: 0.9;
            }

            :host:hover {
                opacity: 1;
            }
        <style>
        `;
    }

    get template() {
        return `
        <h3 class="row-span-1 p-2 text-left">
            <b>Topic:</b> 
            <slot name="diary-topic">Task-content [Prototype: Diary]</slot>
        </h3>
        <div class="row-span-2 p-2 w-auto h-auto text-justify text-ellipsis break-all overflow-hidden">
            <b>Detail:</b><br>
            <slot name="diary-detail">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia ad fugiat velit totam, omnis eaque</slot>
        </div>
        `;
    }

    render() {
        this.classList.add("diary-box");
        this.shadowRoot.innerHTML = `${this.template}`;
    }
}

customElements.define('diary-box', DiaryBox);