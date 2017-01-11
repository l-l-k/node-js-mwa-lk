// store and restor users
function localStorageInitialisation() {
    // Private properties
    var tweetCreator = tweetCreation();

    //Private methods

    // Public 
    var lsObject = {
        // Public properties
        adminsKey: "mwa-admins",
        knownUsersKey: "mwa-knownUsers",
        lastUserKey: "mwa-lastUser",
        currentTweetKey: "mwa-currentMessage",
        lastDisplayedMessagesKey: "mwa-Messages",
        availableTweetsKey: "mwa-Tweets",
        vipsKey: "mwa-Vips",

        // Public methods
        temporaryTweet: function (userID, message, picture) {
            this.userID = userID;
            this.message = message;
            this.attachment = picture;
        },

        initialise: function () {
            var i = 5;
            admins = JSON.parse(localStorage.getItem(this.adminsKey));
            knownUsers = JSON.parse(localStorage.getItem(this.knownUsersKey));
            lastUser = JSON.parse(localStorage.getItem(this.lastUserKey));
            vips = JSON.parse(localStorage.getItem(this.vipsKey));
            // restoreTweets;
            currentTweet = JSON.parse(localStorage.getItem(this.currentTweetKey));
            availableTweets = JSON.parse(localStorage.getItem(this.availableTweetsKey));
        },

        populateUserList: function () {
            var admin = new userRecord("leo@regensburg.oth", "l", "Admin Leo l", "0");
            admins = [admin.id];
            localStorage.setItem(this.adminsKey, JSON.stringify(admins));

            var users = [];
            users.push(admin);
            users.push(new userRecord("anton@post.de", "a", "Testuser Anton", "1"));
            users.push(new userRecord("otto@post.de", "o", "Testuser Otto", "2"));
            users.push(new userRecord("fred@post.de", "f", "Testuser Fred", "3"));
            users.push(new userRecord("sepp@post.de", "s", "Testuser Sepp", "4"));
            localStorage.setItem(this.knownUsersKey, JSON.stringify(users));

            lastUser = users[2];
            localStorage.setItem(this.lastUserKey, JSON.stringify(lastUser));
        },

        populateTweetList: function () {
            currentTweet = new this.temporaryTweet("2", "Eins ist mehr als zwei", "");
            localStorage.setItem(this.currentTweetKey, JSON.stringify(currentTweet));

           // var tweetCreator = tweetCreation();
            var users = JSON.parse(localStorage.getItem(this.knownUsersKey));
            var messages = [];
            var anyTweet = tweetCreator.createTweet("1","2017-01-05", "10:13:19","X","" )
            messages.push(tweetCreator.createTweet("3", "2016-12-01", "10:10:10",
                "Only after generating 1 billion UUIDs every second for the next 100 years, the probability of creating just one duplicate would be about 50%", ""));
            messages.push(tweetCreator.createTweet("3", "2016-12-01", "10:10:10", "The Node.js node-donothing module is very simple to use.", ""));
            messages.push(tweetCreator.createTweet("2", "2016-12-02", "10:10:11", "Hier finden Sie dekorative Wohnzimmerlampen für jeden Geschmack und für jeden Geldbeutel.", ""));
            messages.push(tweetCreator.createTweet("3", "2016-12-03", "10:11:10", "Lichtexperten empfehlen für die Grundbeleuchtung von 100 Lumen pro Quadratmeter. ", ""));
            messages.push(tweetCreator.createTweet("1", "2016-12-03", "10:12:10", " In many cases, well written cloud applications does not need to know what Heroku dyno is handling a request. ", ""));
            messages.push(tweetCreator.createTweet("1", "2016-12-01", "11:10:10", "I got an error saying that I need to install legacy Java ", ""));
            messages.push(tweetCreator.createTweet("4", "2016-12-04", "13:10:10", "Trees play a significant role in reducing erosion and moderating the climate.", ""));
            messages.push(tweetCreator.createTweet("3", "2016-12-05", "15:10:10", "A tree typically has many secondary branches supported clear of the ground by the trunk. ", ""));
            messages.push(tweetCreator.createTweet("4", "2016-12-03", "10:18:10", "Trees tend to be long-lived, some reaching several thousand years old. The tallest known tree, a coast redwood named Hyperion, stands 115.6 m (379 ft) high.", ""));
            messages.push(tweetCreator.createTweet("2", "2016-12-04", "10:19:50", "Although tree is a term of common parlance, there is no universally recognised precise definition of what a tree is, either botanically or in common language.", ""));
            messages.push(tweetCreator.createTweet("3", "2016-12-07", "09:10:30", "Aside from structural definitions, trees are commonly defined by use, for instance as those plants which yield lumber.", ""));
            messages.push(tweetCreator.createTweet("2", "2016-12-01", "17:17:10", "The estimate suggests that about 15 billion trees are cut down annually and about 5 billion are planted. ", ""));
            messages.push(tweetCreator.createTweet("4", "2016-12-08", "20:10:08", " In the 12,000 years since the start of human agriculture, the number of trees worldwide has decreased by 46%.", ""));
            messages.push(tweetCreator.createTweet("1", "2016-12-05", "20:10:47", "The roots of a tree serve to anchor it to the ground and gather water and nutrients to transfer to all parts of the tree. ", ""));

            localStorage.setItem(this.availableTweetsKey, JSON.stringify(messages));
        }

    };
    return lsObject;
}

//===========================================================
// Event Handler
(function () {
    var initiator = new localStorageInitialisation();

    if ((localStorage.getItem(initiator.adminsKey) == null) ||
        (localStorage.getItem(initiator.adminsKey).length == 0)) {
        initiator.populateUserList();
    } else {
        initiator.populateUserList();
    }

    if ((localStorage.getItem(initiator.availableTweetsKey)) == null ||
        (localStorage.getItem(initiator.availableTweetsKey).length == 0)) {
        initiator.populateTweetList();
    } else {
        initiator.populateTweetList();
    }

} ());

