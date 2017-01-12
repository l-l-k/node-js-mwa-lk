function localStorageWriter() {
    // Private properties
    var ls = new localStorageInitialisation();
    var comparativeValue;

    knownUsers = importKnownUsers();
    availableTweets = importAvailableTweets();

    // Private methods
    function importAvailableTweets() {
        return JSON.parse(localStorage.getItem(ls.availableTweetsKey));
    }

    function importKnownUsers() {
        return JSON.parse(localStorage.getItem(ls.knownUsersKey));
    }

    function equalsTweetAuthor(tweet) {
        return tweet.userID == comparativeValue;
    }

    // =================================================== 
    // Public methods
    var writer = {
        // Managing users

        appendUser: function (temporaryUser) {
            var newUser = new userRecord(
                temporaryUser.mailAddress,
                temporaryUser.password,
                temporaryUser.username);

            // append user to storage
            knownUsers.push(newUser);
            localStorage.setItem(ls.knownUsersKey, JSON.stringify(knownUsers));

            return newUser;
        },

        updateUser: function (temporaryUser, userID) {
            var success = false;
            var existingUser = storageReader.retrieveUserDataByID(userID);

            //  update settings of current user
            if (existingUser != null) {
                existingUser.mailAddress = temporaryUser.mailAddress;
                existingUser.username = temporaryUser.username;
                existingUser.password = temporaryUser.password;
                success = true;
                localStorage.setItem(ls.knownUsersKey, JSON.stringify(knownUsers));
            }

            return success;
        },

        deleteUser: function (user) {
            var success = false;
            var index = knownUsers.indexOf(user);
            if (index >= 0) {
                knownUsers.splice(index, 1); // Remove 1 element 
                success = true;
            }
            return success;
        },

        // Managing VIPs
        toggleVIP: function (vip) {
            var index = -1; // no vip
            var existingVIP = storageReader.retrieveVIPDataByID(vip.id);
            if ((existingVIP == null) || (existingVIP.id == null)) {
                // append vip
                if (vips==null) {vips = new Array;}
                vips.push(vip);
                index = vips.length -1;
            } else {
                // remove vip
                var vipIndex = vips.indexOf(existingVIP);
                if (vipIndex >= 0) {
                    vips.splice(vipIndex, 1); // Remove 1 element 
                }
            }
            localStorage.setItem(ls.vipsKey, JSON.stringify(vips));

            return index;
        },

        storeVipFollowingStatus : function() {
            localStorage.setItem(initiator.followVipsKey, followVips)
        }

        // =================================================== 
        // Handling tweets

        deleteSelectedTweets: function (userID, selectedItems) {
            // TODO : Remove some of user's tweets
            alert("Should delete " + selectedItems.length + " records");
            var before = availableTweets.length;
            var results = new Array; // of  tweetRecord objects
            var result = tweetRecord;
            var item = tweetRecord;

            results = availableTweets.filter(equalsTweetAuthor);
            for (var i = 0; i < selectedItems.length; i++) {
                item = selectedItems[i];

                for (var k = 0; i < results.length; i++) {
                    result = results[k];
                    if ((result.day == item.day) && (result.tine == item.time)) {
                        var index = availableTweets.indexOf(user);
                        if (index >= 0) {
                            availableTweets.splice(index, 1); // Remove 1 element 
                            success = true;
                        }
                    }
                }
            }

            mwaToolkit.resetSelectionRange();
            deselectAll();

            return (availableTweets.length < before);
        },

        deleteUserTweets: function (userID) {
            // TODO : Remove user's tweets
            var before = availableTweets.length;

            alert("Should delete all records of user " + userID);
            mwaToolkit.resetSelectionRange();
            deselectAll();

            return (availableTweets.length < before);
        },

        uploadTweet: function (newTweet) {
            var before = availableTweets.length;

            availableTweets.push(newTweet);
            localStorage.setItem(ls.availableTweetsKey, JSON.stringify(availableTweets));

            return (availableTweets.length == before + 1);
        }

    };

    return writer;
}
