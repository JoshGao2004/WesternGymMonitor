// Define the RSS feed URL
const feedUrl = 'https://nitter.1d4.us/twitterusername/rss';

// Function to fetch and parse the RSS feed
function checkForNewTweets() {
    fetch(feedUrl)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.querySelectorAll("item");
            const latestTweet = items[0]; // Assuming the first item is the latest tweet
            const descriptionText = latestTweet.querySelector("description").textContent;

            // Extract data using regular expressions
            const WR = descriptionText.match(/WR\s+(\d+)/)[1];
            const CM = descriptionText.match(/CM\s+(\d+)/)[1];
            const SPIN = descriptionText.match(/Spin\s+(\d+)/)[1];
            const time = new Date(latestTweet.querySelector("pubDate").textContent).toLocaleString();

            // Send the extracted information to the popup
            browser.runtime.sendMessage({
                action: "updateTweetInfo",
                data: { WR, CM, SPIN, time }
            });
        })
        .catch(error => console.error('Error fetching or parsing the RSS feed', error));
}

// Start the check immediately and then every 10 minutes
checkForNewTweets();
setInterval(checkForNewTweets, 10 * 60 * 1000);
