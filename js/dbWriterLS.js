// using local storage 

// =================================================== 
// Managing users

function appendUser(temporaryUser) {
    var newUser = new userRecord(
        temporaryUser.mailAddress,
        temporaryUser.password,
        temporaryUser.username);

    // TODO : append user to storage
    knownUsers.push(newUser);
    localStorage.setItem(knownUsersKey, JSON.stringify(knownUsers));

    return newUser;
}

function updateUser(temporaryUser, userID) {
    var success = false;
    var existingUser = retrieveUserDataByID(userID);

    //  update settings of current user
    if (existingUser != null) {
        existingUser.mailAddress = temporaryUser.mailAddress;
        existingUser.username = temporaryUser.username;
        existingUser.password = temporaryUser.password;
        success = true;
        localStorage.setItem(knownUsersKey, JSON.stringify(knownUsers));
    }

    return success;
}

function deleteUser(user) {
    var success = false;
    var index = knownUsers.indexOf(user);
    if (index >= 0) {
        knownUsers.splice(index, 1); // Remove 1 element 
        success = true;
    }
    return success;
}


// =================================================== 
// Handling tweets

function deleteSelectedTweets(userID, selectedItems) {
    // TODO : Remove some of user's tweets
    var before = availableTweets.length;

    alert("Should delete " + selectedItems.length + " records");
    resetSelectionRange();
    deselectAll();
    
    return (availableTweets.length < before);
}

function deleteUserTweets(userID) {
    // TODO : Remove user's tweets
    var before = availableTweets.length;

    alert("Should delete all records of user " + userID);
    resetSelectionRange();
    deselectAll();

    return (availableTweets.length < before);
}

function uploadTweet(newTweet) {
    var before = localStorage.getItem(availableTweetsKey).length;

    availableTweets.push(newTweet);
    localStorage.setItem(availableTweetsKey, JSON.stringify(availableTweets));

    return (localStorage.getItem(availableTweetsKey).length == before + 1);
}
