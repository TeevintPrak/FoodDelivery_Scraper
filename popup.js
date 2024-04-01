let scrapeApp = document.getElementById('scrapeApp');

// Function to scrape data from food delivery web app
function scrapeDataFromPage() {
    alert('scraping');
}

scrapeApp.addEventListener("click", async () => {
    //Get current active tab
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    //Execute script to scrape the data from the food web app.
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeDataFromPage,
    });
})
