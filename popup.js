document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const historyList = document.getElementById("history");
    const clearButton = document.getElementById("clear");

    // Load clipboard history from storage
    chrome.storage.local.get(["clipboardHistory"], (result) => {
        const history = result.clipboardHistory || [];
        updateUI(history);
    });

    // Listen for paste events
    document.addEventListener("paste", (event) => {
        const text = event.clipboardData.getData("text");
        if (!text) return;

        chrome.storage.local.get(["clipboardHistory"], (result) => {
            let history = result.clipboardHistory || [];

            if (!history.includes(text)) {
                history.unshift(text);
                if (history.length > 100) history.pop(); // Limit to 100 items
                chrome.storage.local.set({ clipboardHistory: history }, () => updateUI(history));
            }
        });
    });

    // Search functionality
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        chrome.storage.local.get(["clipboardHistory"], (result) => {
            const history = result.clipboardHistory || [];
            const filtered = history.filter(item => item.toLowerCase().includes(query));
            updateUI(filtered);
        });
    });

    // Clear history
    clearButton.addEventListener("click", () => {
        chrome.storage.local.set({ clipboardHistory: [] }, () => updateUI([]));
    });

    // Update UI function
    function updateUI(history) {
        historyList.innerHTML = "";
        history.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            li.addEventListener("click", () => navigator.clipboard.writeText(item));
            historyList.appendChild(li);
        });
    }
});
