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

function removeUser(user) {
    var index = knownUsers.indexOf(user);
    if (index >= 0) {
        knownUsers.splice(index, 1); // Remove 1 element 
    }
}

function removeUserTweets(userID) {
        // TODO : Remove user's tweets
}

function storeUserdataLocal(settings) {
    var userdata = userRecord();
    if (window.localstorage) {
        localStorage.setItem('currentUser', JSON.stringify(userdata));
    }
}


// =================================================== 
// Handling tweets

