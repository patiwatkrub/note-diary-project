import { body } from "../../src/utilities/helper/body.js";

let linkExpandDescription;
let linkMinimizeDescription;
let expandDescription;

function initializeDescriptionControl() {
    linkExpandDescription = body.querySelector('#link-expand-description');
    linkMinimizeDescription = body.querySelector('#link-minimize-description');
    expandDescription = body.querySelector('#expand-description');
}

function expand() {
    linkExpandDescription.classList?.add('hidden');
    expandDescription.classList.replace('hidden', 'inline');
    linkMinimizeDescription.classList.replace('hidden', 'inline');
}

function minimize() {
    linkExpandDescription.classList.replace('hidden', 'inline');
    expandDescription.classList.replace('inline', 'hidden');
    linkMinimizeDescription.classList.replace('inline', 'hidden');
}

export { linkExpandDescription, linkMinimizeDescription, expand, minimize, initializeDescriptionControl }