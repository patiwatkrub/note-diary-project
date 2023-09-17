const loadingBox = document.createElement('div');

loadingBox.classList.add('hidden', 'fixed', 'w-auto', 'h-auto', 'bg-transparent', 'set-center');

loadingBox.innerHTML = `
    <img class="animate-spin w-5 h-5 mr-1" src="../src/assets/icons/loading.png" alt="loading...">
    <span class="flex-grow font-bold z-10 text-xl">Loading...</span>
    <span class="absolute z-0 flex-none font-bold text-xl text-neutral-100 translate-x-[26px] translate-y-[2px]">Loading...</span>
`;

export { loadingBox };