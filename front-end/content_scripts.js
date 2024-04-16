chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "processDocs") {
        //const storeNames = scrapeMenuData(request.docs);
        sendResponse({storeNames: request.docs});
    }
});

function scrapeMenuData(docs) {
    let storeTitles = []; // Array to store all found store titles

    for (const html of docs) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html; // Set innerHTML to the HTML string
        const storeTitleElement = tempDiv.querySelector('h1[data-testid="store-title-summary"]');

        if (storeTitleElement) {
            const storeTitle = storeTitleElement.textContent.trim();
            console.log('Store Title:', storeTitle);
            storeTitles.push(storeTitle); // Add found title to the array
        } else {
            console.log('Store Title element not found');
        }
    }

    return storeTitles; // Return all found titles
}
