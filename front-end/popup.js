// popup.js

function generateList(arg) {
    let items = "";
    for (let i = 0; i < arg.length; i++) {
        items += `<li>${arg[i]}</li>`;
    }
    return items;
}

document.getElementById('scrapeApp').addEventListener('click', async () => {
    // Obtain the active tabId
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: getCardsData,
        }, (injectionResults) => {
            if (chrome.runtime.lastError || !injectionResults || !injectionResults.length) {
                console.error('Script injection failed:', chrome.runtime.lastError);
                return;
            }
            chrome.runtime.sendMessage({
                action: "scrapeData",
                cards: injectionResults[0].result
            }, response => {
                if (chrome.runtime.lastError) {
                    console.error('Error in sendMessage:', chrome.runtime.lastError);
                    return;
                }
                if (response && response.storeNames) {
                    console.log('lmao');
                    document.querySelector("main").innerHTML = `<ul>${generateList(response.storeNames)}</ul>`;
                }
            });
        });
    });
});

function getCardsData() {
    const cards = Array.from(document.querySelectorAll('[data-testid="store-card"][href]')).map(card => ({
        url: card.getAttribute('href')
    }));
    return cards;
}
