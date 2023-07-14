import { UnicodeDecodeB64 } from "../../utilities/helper/generateSecureKey.js";

const header = document.createElement('header');

header.classList.add('flex', 'flex-row', 'w-auto', 'h-[64px]', 'align-bottom', 'rounded-lg', 'bg-gainsboro', 'group');

header.innerHTML = `
<span class="flex-1 inline-flex m-2">
    <img class="logo-icon" src="../../src/assets/icons/logo-icon-32px.png" alt="Logo">
    <span class="mt-2 left-16 font-medium text-center">
        <span> Note Diary Project</span>
    </span>
</span>
<!-- Register section on Windows -->
<span class="m-1 group-[.is-login]:hidden max-md:hidden max-md:group-[.is-login]:hidden">
    <button id="sign-in-btn">
        SIGN IN
    </button>
    <button id="log-in-btn">
        LOG IN
    </button>
</span>
<!-- 
    User detail section on Windows
    default: hidden
    active(log in): block
-->
<span class="wins-profile-box hidden group-[.is-login]:block max-md:hidden max-md:group-[.is-login]:hidden">
    <span class="wins-profile-layout">
        <img class="wins-profile-img-item place-self-end" src="../../src/assets/images/profile-photo-default.png" alt="Dump profile">
        <span id="user-data-wins" class="wins-profile-username-item place-self-end">
            <strong>{{ .Username }}</strong>
        </span>
        <span class="wins-profile-user-setting-item place-self-end">
            <a href="./profile.html">
                Setting
            </a>
        </span>
        <span class="wins-profile-log-out-item place-self-end">
            <a href="#">
                LOG OUT
            </a>
        </span>
    </span>
</span>
<span id="dropdown-box">
    <button id="dropdown-button" class="peer" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="dropdown-img" alt="Dropdown icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    </button>
    <!-- problem: this is front-end section.but i want to use golang template, how could i call the template?
    solve: methodology use path. -->
    <div id="dropdown-content" class="hidden dropdown-menu-box">
        <ui>
            <li class="dropdown-menu-elements hidden group-[.is-login]:block">
                <div id="user-data-mobile" class="break-words">
                    <span><strong>Username</strong></span>
                    <br>
                    <span><strong>Email</strong></span>
                </div>
            </li>
            <li class="dropdown-menu-elements hidden group-[.is-login]:block">
                <a href="./profile.html">Setting</a>
            </li>
            <li class="dropdown-menu-elements hidden group-[.is-login]:block">
                <a href="#">Log out</a>
            </li>
            <li class="dropdown-menu-elements group-[.is-login]:hidden">
                <a id="mobile-sign-in-btn" href="#">SIGN IN</a>
            </li>
            <li class="dropdown-menu-elements group-[.is-login]:hidden">
                <a id="mobile-log-in-btn" href="#">LOG IN</a>
            </li>
        </ui>
    </div>
</span>
`;

function UpdateUserData(data) {
    let userDataWins = document.querySelector('#user-data-wins');
    let userDataMobile = document.querySelector('#user-data-mobile');
    let userDataImg = document.querySelector('.wins-profile-img-item');

    userDataImg.src = UnicodeDecodeB64(data.imgProfile);
    userDataWins.innerHTML = 
    `<strong>${data.username}</strong>`;
    userDataMobile.innerHTML = 
    `<span><strong>${data.username}</strong></span>
    <br>
    <span><strong>${data.email}</strong></span>`;
}

export { header, UpdateUserData };