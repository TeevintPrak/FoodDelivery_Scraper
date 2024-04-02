let scrapeApp = document.getElementById('scrapeApp');

function scrapeDataFromPage() {
    const results = [];
    // Use the current page's URL
    const url = window.location.href;
    console.log('Current URL:', url);

    // Assuming you're already on the target page and want to scrape data from it
    const cards = document.querySelectorAll('[class="ak bb"]');

    // Regex patterns
    const ratingRegex = /\b\d\.\d\b/; // Matches a single digit, a period, and another single digit
    const deliveryTimeRegex = /\d{2}–\d{2} min/; // Matches the delivery time format "15–30 min"

    console.log("# of cards" + cards.length);

    cards.forEach(card => {
        // Extract the restaurant name directly
        const name = card.children[0].querySelector('h3')?.innerText.trim();

        // Navigate to find rating and delivery time without relying on class names
        const containerDiv = card.parentElement; // Ascend to the parent that contains all info
        
        // Assuming the rating and delivery time are contained within the same parent div
        // and are always in a predictable order
        const infoText = containerDiv.innerText;

        // Apply regex to extract rating and delivery time
        const ratingMatch = infoText.match(ratingRegex);
        const deliveryTimeMatch = infoText.match(deliveryTimeRegex);

        // Extract the first match (if any) as the desired value
        const ratingText = ratingMatch ? ratingMatch[0] : 'No rating info';
        const deliveryTimeText = deliveryTimeMatch ? deliveryTimeMatch[0] : 'No delivery time info';

        results.push({
            name,
            rating: ratingText,
            deliveryTime: deliveryTimeText
        });
    });

    console.log("Displaying results...");
    console.log(results);

    return results;
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
