const informationBoxStack = document.querySelector(`.info-stack`);

export class InformationBox {
    
    #title;
    #detail;
    #titleBackground;
    #detailTextColor;
    #informationBox;

    #prepareBox() {
        this.#informationBox = document.createElement('div');
        this.#informationBox.classList.add(`bg-gradient-to-r`, `from-white`, `to-gray-200`, `rounded-xl`, `shadow-2xl`, `max-w-fit`);
    }

    #getTheme(level) {
        switch(level) {
            case "success":
                this.#titleBackground = "bg-green-600";
                this.#detailTextColor = "text-green-600";
                break;
            case "info":
                this.#titleBackground = "bg-sky-500";
                this.#detailTextColor = "text-sky-500";
                break;
            case "warning":
                this.#titleBackground = "bg-yellow-400";
                this.#detailTextColor = "text-yellow-400";
                break;
            case "error":
                this.#titleBackground = "bg-red-600";
                this.#detailTextColor = "text-red-600";
                break;
            default:
                console.warn("define information level went wrong");
                break;
        }
    }

    createBox(level, title, detail) {
        this.#prepareBox();
        
        this.#title = title;
        this.#detail = detail;

        this.#getTheme(level);

        this.#informationBox.addEventListener("click", () => {
            this.#removeBox();
        });

        this.#informationBox.addEventListener("animationend", () => {
            this.#removeBox();
        });
        
        this.#informationBox.onmouseenter = () => {
            this.#informationBox.classList.add("animate-[fadePulse_3s_ease-in-out_2]");
        }

        this.#informationBox.innerHTML = `
        <div class="group flex flex-row-reverse gap-1 hover:cursor-pointer">
            <span class="my-1 ml-1 ${this.#titleBackground} text-white rounded-xl">
                <span class="px-1">
                    ${this.#title}
                </span>
            </span>
            <span class="mr-1 p-1 ${this.#detailTextColor}">
                ${this.#detail}
            </span>
            <span class="hidden p-1 -translate-x-1 text-amber-800 group-hover:block">
                &cross;
            </span>
        </div> 
        `;
        informationBoxStack.appendChild(this.#informationBox);
    }
    
    #removeBox() {
        informationBoxStack.removeChild(this.#informationBox);
    }
}
