let forgetPWDModalBox = document.createElement('div');

forgetPWDModalBox.id = 'forget-pwd-box';

forgetPWDModalBox.classList.add('hidden', 'fixed', 'box-border-theme')

forgetPWDModalBox.innerHTML = `
<div class="header-box max-md:px-10">
    <div class="grow header-box-title">FORGET PASSWORD</div>
    <div id="forget-pwd-close-btn" class="close-btn">&cross;</div>
</div>
<hr class="relative header-hr max-md:mx-10">
<form id="forget-password-form"
    class="flex flex-col gap-x-8 px-20 mt-10 md:gap-x-2 max-md:gap-y-2 max-md:px-10 max-md:text-[16px]">
    <label id="log-paragraph" class="mb-2 text-xs"></label>
    <div class="flex flex-initial place-content-center  gap-x-2 min-w-[320px] md:w-auto max-lg:w-full">
        <label class="translate-y-1"for="check-email">Email<span class="text-red-600">* </span> : </label>
        <input type="text" name="check-email" id="check-email" placeholder="Enter email" role="presentation" class="rounded-md p-1" required>
        <input id="check-email-btn" class="w-auto bg-orange-200 rounded-lg p-1 hover:bg-orange-300" type="button" value="Check">
    </div>
    <div class="hidden flex-initial place-content-center  mt-5 mb-2 min-w-[320px] md:w-auto max-lg:w-full">
        <label for="reset-password">New Password<span class="text-red-600">* </span> : </label>
        <input type="password" name="reset-password" id="reset-password" placeholder="Enter new password" class="p-1 rounded-md" required>
    </div>
    <button class="hidden forget-password-btn flex-center-on-screen" type="submit">Submit</button>
</form>
`;

const logDataSet = {
    "process" : {
        "loading" : {
            "context" : `<span class="w-full h-full flex-center-on-screen bg-gray-300 rounded-lg p-2 "> <img class="animate-spin w-5 h-5 mr-1" src="../../../src/assets/icons/loading.png"> </span>`
        },
        "isEmail" : {
            "context" : `<span class="w-full h-full flex-center-on-screen text-white bg-log-info rounded-lg p-2 "> Input email pattern is correct.</span>`
        },
        "isNotEmail" : {
            "context" : `<span class="w-full h-full flex-center-on-screen text-white bg-log-info rounded-lg p-2 "> Input email pattern is not correct. Example : abc_12@hotmail.com </span>`
        }
    },
    "200" : {
        "context" : `<span class="w-full h-full flex-center-on-screen bg-green-200 rounded-lg p-2 "><span class="text-green-600">Please, Check you is Email for confirm to reset password in 5 minutes</span> <span class="text-green-800 font-semibold italic">&nbsp;when submit form</span></span>`
    },
    "400" : {
        "context" : `<span class="w-full h-full flex-center-on-screen text-red-700 bg-red-200 rounded-lg p-2 ">Invalid input.</span>`
    },
    "404" : {
        "context" : `<span class="w-full h-full flex-center-on-screen text-red-700 bg-red-200 rounded-lg p-2 ">Email not found.</span>`
    },
    "500" : {
        "context" : `<span class="w-full h-full flex-center-on-screen text-red-700 bg-red-200 rounded-lg p-2 ">Internal Server Error.</span>`
    },
}

function enableForgetPWDForm() {
    const form = forgetPWDModalBox.querySelector('#forget-password-form');

    form.children[form.children.length-1].classList.replace("hidden", "flex");
    form.children[form.children.length-2].classList.replace("hidden", "flex");
}

function disableForgetPWDForm() {
    const form = forgetPWDModalBox.querySelector('#forget-password-form');

    form.children[form.children.length-1].classList.replace("flex", "hidden");
    form.children[form.children.length-2].classList.replace("flex", "hidden");
}

function forgetPWDFormLogAPI(level) {
    const log = document.querySelector("#log-paragraph")
    
    log.innerHTML = '';
    
    switch (level) {
        case "200" :
            log.innerHTML = logDataSet[200].context;
            break;
        case "400" :
            log.innerHTML = logDataSet[400].context;
            break;
        case "404" :
            log.innerHTML = logDataSet[404].context;
            break;
        case "500" :
            log.innerHTML = logDataSet[500].context;
            break;
    }
}

function forgetPWDFormLogProcess(level) {
    const log = document.querySelector("#log-paragraph")
    
    log.innerHTML = '';
    switch (level) {
        case "loading" : 
            log.innerHTML = logDataSet["process"]["loading"].context;
            break;
        case "isEmail" : 
            log.innerHTML = logDataSet["process"]["isEmail"].context;
            break;
        case "isNotEmail" : 
            log.innerHTML = logDataSet["process"]["isNotEmail"].context;
            break;
    }
}

export { forgetPWDModalBox, enableForgetPWDForm, disableForgetPWDForm, forgetPWDFormLogProcess, forgetPWDFormLogAPI };