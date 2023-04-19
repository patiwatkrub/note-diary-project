// Dropdown action button variables
let dropdownBtn = document.querySelector('#dropdown-button');
let dropdownContent = document.querySelector('#dropdown-content');
let dropdownBtnLogic = false;

// Dropdown action button function
function dropdownControll() {
    dropdownBtnLogic = !dropdownBtnLogic;
    if (dropdownBtnLogic) {
        dropdownContent.classList.replace('hidden', 'block');
    } else {
        dropdownContent.classList.replace('block', 'hidden');
    }
}

// Dropdown action button event
dropdownBtn?.addEventListener('click', dropdownControll);

// Toggle description variables
let linkExpandDescrip = document.querySelector('#link-expand-description');
let expandDescrip = document.querySelector('#expand-description');
let linkMinimizeDescrip = document.querySelector('#link-minimize-description');


// Toggle description function
function expandDescription() {
    linkExpandDescrip.classList?.add('hidden');
    expandDescrip.classList.replace('hidden', 'inline');
    linkMinimizeDescrip.classList.replace('hidden', 'inline');
}

function minimizeDescription() {
    linkExpandDescrip.classList.replace('hidden', 'inline');
    expandDescrip.classList.replace('inline', 'hidden');
    linkMinimizeDescrip.classList.replace('inline', 'hidden');
}

// Toggle description events
linkExpandDescrip?.addEventListener('click', expandDescription);
linkMinimizeDescrip?.addEventListener('click', minimizeDescription);