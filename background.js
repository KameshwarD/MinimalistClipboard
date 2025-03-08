chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ clipboardHistory: [] });
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveClipboard") {
        chrome.storage.local.get(["clipboardHistory"], (result) => {
            let history = result.clipboardHistory || [];
            if (!history.includes(request.text)) {
                history.unshift(request.text);
                if (history.length > 100) history.pop();
                chrome.storage.local.set({ clipboardHistory: history });
            }
        });
    }
});
