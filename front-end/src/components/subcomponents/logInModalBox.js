let logInModalBox = document.createElement('div');

logInModalBox.id = 'log-in-box';
logInModalBox.classList.add('hidden', 'absolute', 'box-border-theme', 'max-lg:fixed');

logInModalBox.innerHTML = `
<div class="header-box max-lg:px-10">
    <div class="grow header-box-title">LOG IN</div>
    <div id="log-in-close-btn" class="close-btn">&cross;</div>
</div>
<hr class="relative header-hr max-lg:mx-10">
<form id="login"
    class="flex gap-x-8 px-20 mt-10 md:gap-x-2 max-lg:flex-col max-lg:gap-y-2 max-lg:px-10 max-lg:text-[10px]" autocomplete="off">
    <div class="grow ml-5 max-lg:ml-0 max-lg:w-auto">
        <label for="username">Username: </label>
        <input role="presentation" class="input-box" type="text" name="username" id="username" required>
    </div>
    <div class="grow max-lg:w-auto">
        <label for="password">Password: </label>
        <input class="input-box" type="password" name="password" id="password" required>
    </div>
    <div class="min-w-[150px] max-lg:-translate-y-2">
        <button class="forgot-password-btn">Forgot Password?</button>
    </div>
    <div class="min-w-[80px] max-lg:-translate-y-2">
        <button class="log-in-submit-btn" type="submit">Log in</button>
    </div>
</form>
`;

export { logInModalBox };