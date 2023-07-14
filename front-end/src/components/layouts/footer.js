const footer = document.createElement('footer');

footer.classList.add('w-auto', 'h-[150px]', 'pt-4', 'bg-gradient-to-tl', 'from-medium-aquamarine', 'to-myrtle-green', 'text-center');

footer.innerHTML = `
<span class="uppercase"><i>Copyright&copy;</i></span><br>
        <span>
            Email &#9993;: <a style="color: white; text-decoration: none;" href="mailto:Patiwatkrubst@hotmail.com">Patiwatkrubst@hotmail.com</a>
        </span><br>
        <span>Github</span> 
        <span>
            <img style="display: inline-flex; width: 20px; height: 20px;" src="https://cdn-icons-png.flaticon.com/24/2111/2111374.png" alt="Git icon"></span>
        <span> 
            : <a style="color: white; text-decoration: none;" href="https://github.com/patiwatkrub/note-diary-project" target="_blank">github.com/patiwatkrub/note-diary-project</a> 
        </span><br>
        <span>
            Tel &#9743;: <a style="color: white; text-decoration: none;" class="lining-nums" href="tel:098-2838-104">098-2838-104</a>
</span>`;

export { footer };
