import { body } from "../../src/utilities/helper/body.js";
import { toggleLogic } from "./helper/toggleLogic.js";

// Dropdown variables
let dropdownBtn;
let dropdownContent;
let dropdownLogicBtn;

function initializeDropdownControl() {
    dropdownBtn = body.querySelector('#dropdown-button');
    dropdownContent = body.querySelector('#dropdown-content');
    dropdownLogicBtn = false;
}

function dropdownToggle() {
    dropdownLogicBtn = toggleLogic(dropdownLogicBtn);
    
    if (dropdownLogicBtn) {
        dropdownContent.classList.replace('hidden', 'block');
    } else {
        dropdownContent.classList.replace('block', 'hidden');
    }
}

export { dropdownBtn, dropdownToggle, initializeDropdownControl };