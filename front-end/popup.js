// popup.js

document.getElementById('scrapeApp').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: getCardsData,
    }, (injectionResults) => {
        for (const frameResult of injectionResults) {
            chrome.runtime.sendMessage({
                action: "scrapeData",
                cards: frameResult.result,
                html: document
            }, response => {
                console.log('Scraped Names:', response.storeNames);
                //updateUI(response.storeNames);
            });
        }
    });
});

function getCardsData() {
    const cards = Array.from(document.querySelectorAll('[data-testid="store-card"][href]')).map(card => ({
        url: card.getAttribute('href')
    }));
    return cards;
}

function updateUI(storeNames) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear previous results
    storeNames.forEach(name => {
        const div = document.createElement('div');
        div.textContent = name;
        main.appendChild(div);
    });
}
