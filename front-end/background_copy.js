// background.js

let document = ""; 

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

// function scrapeMenuData(docs) {
//     for (const html in docs) {
//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = html;
//         const storeTitleElement = tempDiv.querySelector('h1[data-testid="store-title-summary"]');
//         if (storeTitleElement) {
//             const storeTitle = storeTitleElement.textContent.trim();
//             console.log('Store Title:', storeTitle);
//             return storeTitle;
//         } else {
//             console.log('Store Title element not found');
//             return null;
//         }
//     }
// }

function scrapeMenuData(docs) {
    let storeTitles = []; // Array to store all found store titles

    for (const html of docs) { // Correct iteration over HTML contents
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


async function scrapeLinks(cards) {
    const storeNames = [];
    const links = [];

    for (const card of cards) {
        links.push(parseLink(card.url));
    }

    try {
        fetchData(links.slice(0, 2), function(docs) {
            storeNames = scrapeMenuData(docs);
        });
    } catch (error) {
        console.error('Error scraping data', error);
    }
    return storeNames;
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "scrapeData") {
            document = request.html;
            console.log(document);
            scrapeLinks(request.cards).then(storeNames => {
                sendResponse({storeNames: storeNames});
            });
            return true;
        }
    }
);
