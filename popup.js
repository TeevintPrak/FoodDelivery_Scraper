let scrapeApp = document.getElementById('scrapeApp');

function scrapeDataFromPage() {
    function parseData(restaurantName, ratingText, deliveryTimeText) {

        const rating = parseFloat(ratingText);    
        const earliest = parseInt(deliveryTimeText.substring(0,2));
        const latest = parseInt(deliveryTimeText.substring(3,5));
    
        const arr = [
            restaurantName,
            rating,
            earliest,
            latest
        ];
        return arr;
    }

    function findAverageRating(arr) {
        const sum = arr.reduce((partialSum, curr) => partialSum + curr, 0);
        const average = Math.round((sum / arr.length)*100)/100;
        return average;
    }

    const results = [];
    const restaurantNames = [];
    const ratings = [];
    const earliestDeliveryTime = [];
    const latestDeliveryTime = [];
    const medianDeliveryTime = [];
    // Use the current page's URL
    const url = window.location.href;
    console.log('Current URL:', url);

    // Assuming you're already on the target page and want to scrape data from it
    const cards = document.querySelectorAll('[class="ak bb"]');

    // Regex patterns
    const ratingRegex = /\b\d\.\d\b/; // Matches a single digit, a period, and another single digit
    const deliveryTimeRegex = /\d{2}–\d{2} min/; // Matches the delivery time format "15–30 min"

    console.log("# of cards" + cards.length);

    cards.forEach((card, index) => {
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
        const ratingText = ratingMatch ? ratingMatch[0] : null;
        const deliveryTimeText = deliveryTimeMatch ? deliveryTimeMatch[0] : null;

        // Remove if there is a null value
        if(name && ratingText && deliveryTimeText){
            //parse the data into float, ints, and seperating numbers. 
            var arr = parseData(name, ratingText, deliveryTimeText);
            results.push(arr);
            restaurantNames.push(arr[0]);
            ratings.push(arr[1]);
            earliestDeliveryTime.push(arr[2]);
            latestDeliveryTime.push(arr[3]);
            medianDeliveryTime.push((arr[2] + arr[3])/2);
        }
        
        /*
        results.push(
            name,
            rating: ratingText,
            deliveryTime: deliveryTimeText
        });*/

    });

    const averageRating = findAverageRating(ratings);
    const highestRatedIndex = ratings.reduce((iMax, x, i, ratings) => x > ratings[iMax] ? i : iMax, 0);
    const lowestRatedIndex = ratings.reduce((iLow, x, i, ratings) => x < ratings[iLow] ? i : iLow, 0);
    const longestDeliveryIndex = medianDeliveryTime.reduce((iMax, x, i, ratings) => x > ratings[iMax] ? i : iMax, 0);
    const shortestDeliveryIndex = medianDeliveryTime.reduce((iLow, x, i, ratings) => x < ratings[iLow] ? i : iLow, 0);

    const finalResults = ["Average Rating: " + averageRating, 
    "Highest Rated Restaurant: " + restaurantNames[highestRatedIndex], 
    "Highest  Rating: " + ratings[highestRatedIndex], 
    "Lowest Rated Restaurant: " + restaurantNames[lowestRatedIndex], 
    "Lowest Rating: " + ratings[lowestRatedIndex], 
    "Longest Delivery Restaurant: " + restaurantNames[longestDeliveryIndex], 
    "Longest Delivery Time: " + medianDeliveryTime[longestDeliveryIndex] + " min", 
    "Shortest Delivery Restaurant: " + restaurantNames[shortestDeliveryIndex], 
    "Shortest Delivery Time: " + medianDeliveryTime[shortestDeliveryIndex] + " min"];

    console.log("Average Rating:" + finalResults[0]);
    console.log("Highest Rated Restaurant:" + finalResults[1] + " with  Rating: " + finalResults[2]);
    console.log("Lowest Rated Restaurant:" + finalResults[3] + " with Rating: " + finalResults[4]);
    console.log("Longest Delivery Restaurant:" + finalResults[5] + " with Time: " + finalResults[6] + " mins");
    console.log("Shortest Delivery Restaurant:" + finalResults[7] + " with Time: " + finalResults[8] + " mins");

    return finalResults;
}

function generateList(arg) {
    let items = "";
    for(let i = 0; i < arg.length; i++) {
        items += `<li>${arg[i]}</li>`;
    }
    return items;
}

scrapeApp.addEventListener("click", async () => {
    //Get current active tab
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    /*
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: scrapeDataFromPage,
    });*/

    const executeScript = (tabId, func) => new Promise(resolve => {
        chrome.scripting.executeScript({ target: {tabId}, func}, resolve)
    });

    const [{result: finalResults}] = await executeScript(tab.id, scrapeDataFromPage);
    
    document.querySelector("main").innerHTML = `<ul>${generateList(finalResults)}</ul>`;
});
