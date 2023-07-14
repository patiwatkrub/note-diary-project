let signInModalBox = document.createElement('div');

signInModalBox.id = 'sign-in-box';
signInModalBox.classList.add('hidden', 'absolute', 'box-border-theme', 'max-lg:fixed')

signInModalBox.innerHTML = `
<div class="header-box max-lg:px-10">
        <div class="grow header-box-title">SIGN IN</div>
        <div id="sign-in-close-btn" class="close-btn">&cross;</div>
</div>
<hr class="relative header-hr max-lg:mx-10">
<form id="signin" action="" method="post"
    class="flex gap-x-8 px-20 mt-10 max-lg:flex-col max-lg:gap-y-2 max-lg:px-10" autocomplete="off"
    >
    <div>
        <label for="reg-username">Username<span class="text-red-600">* </span>: </label>
        <input role="presentation" class="input-box" type="text" name="reg-username" id="reg-username" required>
    </div>
    <div>
        <label for="reg-password">Password<span class="text-red-600">* </span>: </label>
        <input class="input-box" type="password" name="reg-password" id="reg-password" required>
    </div>
    <div>
        <label for="reg-email">Email<span class="text-red-600">* </span>: </label>
        <input role="presentation" class="input-box" type="email" name="reg-email" id="reg-email" required>
    </div>
    <div>
        <button class="reset-btn" type="reset">Clear</button>
    </div>
    <div>
        <button class="submit-btn" type="submit">Summit</button>
    </div>
</form>
`;

export { signInModalBox };