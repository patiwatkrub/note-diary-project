let signInModalBox = document.createElement('div');

signInModalBox.id = 'sign-in-box';
signInModalBox.classList.add('hidden', `fixed`, 'box-border-theme')

signInModalBox.innerHTML = `
<div class="header-box max-lg:px-10">
        <div class="grow header-box-title">SIGN IN</div>
        <div id="sign-in-close-btn" class="close-btn">&cross;</div>
</div>
<hr class="relative header-hr max-lg:mx-10">
<form id="sign-in"
    class="flex gap-x-8 px-16 mt-10 max-lg:flex-col max-lg:gap-y-2 max-lg:px-8" autocomplete="off"
    >
    <div class="flex-initial min-w-[100px] max-lg:w-auto">
        <label for="reg-username">Username<span class="text-red-600">* </span>: </label>
        <input role="presentation" class="input-box" type="text" name="reg-username" id="reg-username" required>
    </div>
    <div class="flex-initial min-w-[100px] max-lg:w-auto">
        <label for="reg-password">Password<span class="text-red-600">* </span>: </label>
        <input class="input-box" type="password" name="reg-password" id="reg-password" required>
    </div>
    <div class="flex-initial min-w-[100px] max-lg:w-auto">
        <label for="reg-email">Email<span class="text-red-600">* </span>: </label>
        <input role="presentation" class="input-box" type="email" name="reg-email" id="reg-email" required>
    </div>
    <div class="basis-1/5">
        <button class="reset-btn" type="reset">Clear</button>
    </div>
    <div class="basis-1/5">
        <button class="sign-in-submit-btn" type="submit">Summit</button>
    </div>
</form>
`;

export { signInModalBox };