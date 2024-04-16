function parseLink(URL) {
    const baseURL = "https://www.ubereats.com";
    return baseURL + URL;
}

async function fetchData(links, callback) {
    fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({links: links})
    })
    .then(response => response.json())
    .then(data => {
        callback(data);
    });
}

async function scrapeLinks(cards, sendResponse) {
    const links = cards.map(card => parseLink(card.url));

    try {
        fetchData(links.slice(0, 2), function(docs) {
            /* Send HTML documents to content script for processing
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "processDocs", docs: docs}, function(response) {
                    sendResponse({storeNames: response.storeNames});
                });
            });*/
            return docs;
        });
    } catch (error) {
        console.error('Error scraping data', error);
    }
    return true; // to keep the message channel open for asynchronous response
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "scrapeData") {
            scrapeLinks(request.cards, sendResponse).then(storeNames => {
                sendResponse({storeNames: storeNames});
            });
            return true; // to keep the message channel open
        }
    }
);
