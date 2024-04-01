let scrapeApp = document.getElementById('scrapeApp');

// Function to scrape data from food delivery web app
function scrapeDataFromPage() {
    const results = [];
    // Use the current page's URL
    const url = window.location.href;
    console.log('Current URL:', url);

    // Assuming you're already on the target page and want to scrape data from it
    const cards = document.querySelectorAll('[data-testid="store-card"]');

    cards.forEach(card => {
        // Extract the relevant data as before
        const name = card?.querySelector('h3')?.innerText?.trim();
        // Navigate the DOM to find the rating and delivery time as in your Python script
        const outerDiv = card?.parentElement; // Navigating up the DOM
        const innerDiv = outerDiv?.children[1]?.children[1]; // Then finding the specific child elements
        const rating = innerDiv?.children[0];
        let ratingText = null;
        if(rating?.children?.length >= 2) {
            ratingText = rating?.children[2]?.innerText.trim();
        } else {
            console.log("rating does not exist");
        }
        const deliveryTime = innerDiv?.children[1]?.children[0];
        const deliveryTimeText = deliveryTime?.querySelector('span')?.innerText.trim();

        results.push({
                name,
                ratingText,
                deliveryTimeText
            });
    });

    console.log("displaying results...");
    // Log results for debugging
    console.log(results);
}

scrapeApp.addEventListener("click", async () => {
    //Get current active tab
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    //Execute script to scrape the data from the food web app.
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: scrapeDataFromPage,
    });
});
