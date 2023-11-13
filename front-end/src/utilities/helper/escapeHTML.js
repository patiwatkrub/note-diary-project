function escapeHtml(unsafe) {
    return unsafe.replace("<script>", "").replace("</script>", "").replace(/&/g, "").replace(/</g, "").replace(/>/g, "").replace(/"/g, "").replace(/'/g, "");
}

export { escapeHtml };