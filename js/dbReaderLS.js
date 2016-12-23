// using local storage 

// =================================================== 
// Managing users
var comparativeValue;


function retrieveUserDataByID(userID) {
    comparativeValue = userID;
    var existingUser = userRecord;
    var index = knownUsers.findIndex(equalsUserID);
    if (index >= 0) {
        existingUser = knownUsers[index];
    }

    return existingUser;
}

function retrieveUserDataByMailAddress(mailAddress) {
    comparativeValue = mailAddress;
    var existingUser = userRecord;
    var index = knownUsers.findIndex(equalsMailAddress);
    if (index >= 0) {
        existingUser = knownUsers[index];
    }

    return existingUser;
}

function findUserName(name) {
    comparativeValue = name;
    var index = knownUsers.findIndex(equalsUsername);
    return index >= 0;
}

function findMailAddress(address) {
    comparativeValue = address;
    var index = knownUsers.findIndex(equalsMailAddress);
    return index >= 0;
}

function determineUserStatus(userID) {
    comparativeValue = userID;
    var index = admins.findIndex(equalsUserID);
    var isAdmin = index >= 0;;

    return isAdmin;
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


// =================================================== 
// Handling tweets

function restoreTweets() {
    currentMessage = JSON.parse(localStorage.getItem(currentMessageKey));
    lastDisplayedMessages = JSON.parse(localStorage.getItem(lastDisplayedMessagesKey));
}

