// store and restor users

var admins = new Array();
var adminsKey = "mwa-admins";
var knownUsers = new Array();
var knownUsersKey = "mwa-knownUsers";
var lastUser;
var lastUserKey = "mwa-lastUser";
var currentTweet;
var currentTweetKey = "mwa-currentMessage";
var lastDisplayedMessages = new Array();
var lastDisplayedMessagesKey = "mwa-Messages";
var availableTweets = new Array();
var availableTweetsKey = "mwa-Tweets";

window.onload = invokeLocalStorage;

function invokeLocalStorage() {
    admins = JSON.parse(localStorage.getItem(adminsKey));
    knownUsers = JSON.parse(localStorage.getItem(knownUsersKey));
    lastUser = JSON.parse(localStorage.getItem(lastUserKey));
    // restoreTweets;
    currentTweet = JSON.parse(localStorage.getItem(currentTweetKey));
    availableTweets = JSON.parse(localStorage.getItem(availableTweetsKey));
}


(function () {
    if ((localStorage.getItem(adminsKey) == null) ||
        (localStorage.getItem(adminsKey).length == 0)) {
        populateUserList();
    }
    if ((localStorage.getItem(availableTweetsKey)) == null ||
        (localStorage.getItem(availableTweetsKey).length == 0)) {
        populateTweetList();
    }
            populateTweetList();

} ());

function populateUserList() {
    var admin = new userRecord("leo@regensburg.oth", "l", "Admin Leo l", "0");
    var admins = [admin.id];
    localStorage.setItem(adminsKey, JSON.stringify(admins));

    var users = [];
    users.push(admin);
    users.push(new userRecord("anton@post.de", "a", "Testuser Anton", "1"));
    users.push(new userRecord("otto@post.de", "o", "Testuser Otto", "2"));
    users.push(new userRecord("fred@post.de", "f", "Testuser Fred", "3"));
    users.push(new userRecord("sepp@post.de", "s", "Testuser Sepp", "4"));
    localStorage.setItem(knownUsersKey, JSON.stringify(users));

    lastUser = users[2];
    localStorage.setItem(lastUserKey, JSON.stringify(lastUser));
}

function populateTweetList() {
    currentTweet = new temporaryTweetRecord("2", "Eins ist mehr als zwei", "");
    localStorage.setItem(currentTweetKey, JSON.stringify(currentTweet));

    var users = JSON.parse(localStorage.getItem(knownUsersKey));
    var messages = [];
    messages.push(new tweetRecord("3", "2016-12-01", "10:10:10",
        "Only after generating 1 billion UUIDs every second for the next 100 years, the probability of creating just one duplicate would be about 50%", ""));
    messages.push(new tweetRecord("3", "2016-12-01", "10:10:10", "The Node.js node-donothing module is very simple to use.", ""));
    messages.push(new tweetRecord("2", "2016-12-02", "10:10:11", "Hier finden Sie dekorative Wohnzimmerlampen für jeden Geschmack und für jeden Geldbeutel.", ""));
    messages.push(new tweetRecord("3", "2016-12-03", "10:11:10", "Lichtexperten empfehlen für die Grundbeleuchtung von 100 Lumen pro Quadratmeter. ", ""));
    messages.push(new tweetRecord("1", "2016-12-03", "10:12:10", " In many cases, well written cloud applications does not need to know what Heroku dyno is handling a request. ", ""));
    messages.push(new tweetRecord("1", "2016-12-01", "11:10:10", "I got an error saying that I need to install legacy Java ", ""));
    messages.push(new tweetRecord("4", "2016-12-04", "13:10:10", "Trees play a significant role in reducing erosion and moderating the climate.", ""));
    messages.push(new tweetRecord("3", "2016-12-05", "15:10:10", "A tree typically has many secondary branches supported clear of the ground by the trunk. ", ""));
    messages.push(new tweetRecord("4", "2016-12-03", "10:18:10", "Trees tend to be long-lived, some reaching several thousand years old. The tallest known tree, a coast redwood named Hyperion, stands 115.6 m (379 ft) high.", ""));
    messages.push(new tweetRecord("2", "2016-12-04", "10:19:50", "Although tree is a term of common parlance, there is no universally recognised precise definition of what a tree is, either botanically or in common language.", ""));
    messages.push(new tweetRecord("3", "2016-12-07", "09:10:30", "Aside from structural definitions, trees are commonly defined by use, for instance as those plants which yield lumber.", ""));
    messages.push(new tweetRecord("2", "2016-12-01", "17:17:10", "The estimate suggests that about 15 billion trees are cut down annually and about 5 billion are planted. ", ""));
    messages.push(new tweetRecord("4", "2016-12-08", "20:10:08", " In the 12,000 years since the start of human agriculture, the number of trees worldwide has decreased by 46%.", ""));
    messages.push(new tweetRecord("1", "2016-12-05", "20:10:47", "The roots of a tree serve to anchor it to the ground and gather water and nutrients to transfer to all parts of the tree. ", ""));

    localStorage.setItem(availableTweetsKey, JSON.stringify(messages));
}