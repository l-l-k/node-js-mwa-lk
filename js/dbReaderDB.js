function dbReader() {
    // Private properties
    var comparativeValue;
    var ls = new localStorageInitialisation();

    knownUsers = importKnownUsers();
    vips = importVIPs();
    availableTweets = importAvailableTweets();

    // =================================================== 
    // Private methods
    // users

    function equalsVIPID(vip) {
        return vip.id == comparativeValue;
    }

    function equalsUserID(user) {
        return user.id == comparativeValue;
    }

    function equalsUsername(user) {
        return user.username == comparativeValue;
    }

    function equalsMailAddress(user) {
        return user.mailAddress == comparativeValue;
    }

    function importKnownUsers() {
        return JSON.parse(localStorage.getItem(ls.knownUsersKey));
    }

    function importVIPs() {
        return JSON.parse(localStorage.getItem(ls.vipsKey));
    }

    // tweets
    function equalsTweetAuthor(tweet) {
        return tweet.userID == comparativeValue;
    }

    function importAvailableTweets() {
        return JSON.parse(localStorage.getItem(ls.availableTweetsKey));
    }

    function getVipTweets() {
        var vipTweets = new Array;
        if (!followVips) {
            return vipTweets;
        }
        var vip = vipRecord;
        for (var i = 0; i < vips.length; i++) {
            var vip = vips[i];
            if (vip.checked) {
                comparativeValue = vip.id;
                var vipResults = availableTweets.filter(equalsTweetAuthor);
                if (vipResults.length > 0) {
                    vipTweets = vipTweets.concat(vipResults);
                }
            }
        }
        return vipTweets;
    }

    // =================================================== 
    // Public methods
    var reader = {

        importAdmins: function(row) {
            admins.push(row[0]);
        },

        // Handling tweets
        retrieveVIPDataByID: function (userID) {
            comparativeValue = userID;
            var existingVip = vipRecord;
            var index = -1;
            if (vips != null) {
                index = vips.findIndex(equalsVIPID);
            }
            if (index >= 0) {
                existingVip = vips[index];
            }

            return existingVip;
        },

        retrieveUserDataByID: function (userID) {
            comparativeValue = userID;
            var existingUser = userRecord;
            var index = knownUsers.findIndex(equalsUserID);
            if (index >= 0) {
                existingUser = knownUsers[index];
            }

            return existingUser;
        },

        retrieveUserDataByName: function (username) {
            comparativeValue = username;
            var existingUser = userRecord;
            var index = knownUsers.findIndex(equalsUsername);
            if (index >= 0) {
                existingUser = knownUsers[index];
            }

            return existingUser;
        },

        retrieveUserDataByMailAddress: function (mailAddress) {
            comparativeValue = mailAddress;
            var existingUser = userRecord;
            var index = knownUsers.findIndex(equalsMailAddress);
            if (index >= 0) {
                existingUser = knownUsers[index];
            }

            return existingUser;
        },

        findUserName: function findUserName(name) {
            comparativeValue = name;
            var index = knownUsers.findIndex(equalsUsername);
            return index >= 0;
        },

        findMailAddress: function (address) {
            comparativeValue = address;
            var index = knownUsers.findIndex(equalsMailAddress);
            return index >= 0;
        },

        determineUserStatus: function (userID) {
            comparativeValue = userID;
            var index = admins.findIndex(equalsUserID);
            var isAdmin = index >= 0;;

            return isAdmin;
        },


        // =================================================== 
        // Handling tweets

        restoreTweets: function () {
            currentTweet = JSON.parse(localStorage.getItem(ls.currentMessageKey));
            lastDisplayedMessages = JSON.parse(localStorage.getItem(ls.lastDisplayedMessagesKey));
        },

        getSubsetOfTweetsByUsername: function (filter) {
            availableTweets = importAvailableTweets();
            var results = new Array; // of  tweetRecord objects
            if (filter == "*") {
                results = availableTweets;
            } else {
                var user = retrieveUserDataByName(filter);
                results = getSubsetOfTweetsByID(user.id);
            }

            return results;
        },

        getSubsetOfTweetsByMailAddress: function (filter) {
            availableTweets = importAvailableTweets();
            var results = new Array; // of  tweetRecord objects
            if (filter == "*") {
                results = availableTweets;
                return results; // vips are already included
            } else {
                var user = retrieveUserDataByMailAddress(filter);
                results = getSubsetOfTweetsByID(user.id);
            }

            return results;
        },

        getSubsetOfTweetsByID: function (filter) {
            availableTweets = importAvailableTweets();
            var results = new Array; // of  tweetRecord objects
            if (filter == "*") {
                results = availableTweets;
            } else {
                comparativeValue = filter;
                results = availableTweets.filter(equalsTweetAuthor);
            }
            //  append tweets of selected vips
            var vipTweets = getVipTweets();
            return results.concat(vipTweets);
        },

        // =================================================== 
        // Statistical queries

        getTweetsInPeriod: function (startDate, endDate) {
            availableTweets = importAvailableTweets();
            var results = [];
            var tweet; // = tweetRecord;
            var datum = "";
            var day;

            for (var i = [0]; i < availableTweets.length; i++) {
                tweet = availableTweets[i];
                datum = tweet.day.split("-");
                day = new Date(datum[0], datum[1], datum[2]);
                if ((day >= startDate) && (day <= endDate)) {
                    results.push(tweet);
                }
            }

            return results;
        },

        // =================================================== 
        // Update memory
        updateUsers: function () {
            knownUsers = importKnownUsers();
        },

        updateTweets: function () {
            availableTweets = importAvailableTweets();
        }

    };

    return reader;
}

