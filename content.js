document.addEventListener("copy", async () => {
    try {
        const text = await navigator.clipboard.readText();
        chrome.runtime.sendMessage({ action: "saveClipboard", text });
    } catch (err) {
        console.error("Clipboard read failed:", err);
    }
});
