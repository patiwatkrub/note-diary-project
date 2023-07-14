let uploadImgModalBox = document.createElement('div');

uploadImgModalBox.id = 'upload-img-box';

uploadImgModalBox.classList.add('hidden', 'absolute', 'box-border-theme', 'max-md:fixed')

uploadImgModalBox.innerHTML = `
<div class="header-box max-md:px-10">
    <div class="grow header-box-title">UPLOAD PROFILE</div>
    <div id="upload-img-close-btn" class="close-btn">&cross;</div>
</div>
<hr class="relative header-hr max-md:mx-10">
<form id="upload-profile" action="" method="post" enctype="multipart/form-data"
    class="flex gap-x-8 px-20 mt-10 md:gap-x-2 max-md:flex-col max-md:gap-y-2 max-md:px-10 max-md:text-[10px]">
    <div>
        <label for="upload-img">Upload: </label>
        <input class="" type="file" name="upload-img" id="upload-img">
    </div>
    <div class="md:-translate-y-5">
        <button class="submit-btn" type="submit">Submit</button>
    </div>
</form>
`;

export { uploadImgModalBox };