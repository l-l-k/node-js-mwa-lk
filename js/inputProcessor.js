/* data request support */
// global variables
var currentUser;
var activeFieldset;

function member(mail, password, name) {
    this.mailAddress = mail;
    this.password = password;
    this.name = name;
    this.id = mail + name; // TODO get id from server
}

function validateInput(event) {
    //elSignupForm.                        
    //TODO Send data to server
    var activeForm = event.currentTarget;
    activeFieldset = thisForm.parentElement;

    switch (activeForm) {
        case document.forms.signup:
            var newUser = new user(
                activeForm.elements.mailAddress,
                activeForm.elements.password,
                activeForm.elements.username)
            validateSignup(newUser);
            break;

        case document.forms.login:
            var loginUser = new user(
                activeForm.elements.mailAddress,
                activeForm.elements.password,
                "")
            validateLogin(loginUser);
            break;

        case document.forms.userdata:
            var settings = new user(
                activeForm.elements.mailAddress,
                activeForm.elements.password,
                activeForm.elements.username)
            validateSettingChanges(settings);
            break;

        // ADMIN Tasks
        case document.forms.addUser:
            var newUser = new user(
                activeForm.elements.mailAddress,
                activeForm.elements.password,
                activeForm.elements.username)
            validateSignup(newUser);
            break;

        case document.forms.removeUser:
            removeUser(activeForm.elements.userID);
            break;

        case document.forms.cleanupTweets:
            removeTweets(activeForm.elements.userID);
            break;

        case document.forms.statistics:
            var firstDay = activeForm.elements.startDate;
            var lastDay = activeForm.elements.endDate;
            getAccountSummary(firstDay, lastDay)
            break;
    }

    try {

        if (!mailAddress == null) {
            var mailAddressExists = true;
            validateNewMailAddress(mailAddressExists);
        }

        if (!username == null) {
            var isValidName = false;
            validateNewUsername(isValidName);
        }

    } catch (e) {
        var err = e.name + ' ' + e.message;
    } finally {

    }

    if ((!isValidName) || (mailAddressExists)) {
        event.preventDefault(); // Don't submit form
    }
}

function validateSignup(user) {
    var isValidUser =
        doesMailAddressExist(user) &&
        doesUsernameExist(user) &&
        isValidPassord(user);

    if (isValidUser) {
        // TODO : Create userID
        // Workaround : Create random number between 1 and 10
        var randomNum = Math.floor((Math.random() * 10) + 1);
        newUser.id = randomNum;
        currentUser = newUser;
        thisFieldset.className = 'hidden';
    }
}

function validateLogin(user) {
    var isValidUser =
        doesMailAddressExist(user) &&
        isValidPassord(user);

    if (isValidUser) {
        // TODO : retrieve other user data from storage
        currentUser = newUser;
        thisFieldset.className = 'hidden';
    }
}

function validateSettingChanges(settings) {
    var isValidUser =
        doesMailAddressExist(user) &&
        doesUsernameExist(user) &&
        isValidPassord(user);

    if (isValidUser) {
        // TODO : compare with current user
        var randomNum = Math.floor((Math.random() * 10) + 1);
        newUser.id = randomNum;
        currentUser = newUser;
        thisFieldset.className = 'hidden';
    }
}

function doesMailAddressExist(user) {
    var mailAddressExists = true;

    // TODO check if address exists

    var elFeedback = document.getElementById('feedback11')
    if (mailAddressExists) {
        elFeedback.className = 'warning';
        elFeedback.innerHTML = 'Address already exists.' + '<br />' + 'Edit Account to change password or username.';
    } else {
        elFeedback.className = 'hidden';
    }

    return !mailAddressExists;
}

function doesUsernameExist(user) {
    var nameExists = true;

    // TODO check if name exists

    var elFeedback = document.getElementById('feedback13')
    if (nameExists) {
        elFeedback.className = 'warning';
        elFeedback.innerHTML = 'Name already exists. Please choose another.';
    } else {
        elFeedback.className = 'hidden';
    }

    return !nameExists;
}

function isValidPassord(user) {
    var isValidPW = false;


    return isValidPW;
}

function removeUser(userID) {

}

function removeTweets(userID) {

}

function getAccountSummary(firstDay, lastDay) {

}

// Event handler
//=============================================================
document.forms.signup.addEventListener('submit', validateInput, false);
document.forms.login.addEventListener('submit', validateInput, false);
document.forms.userdata.addEventListener('submit', validateInput, false);
document.forms.addUser.addEventListener('submit', validateInput, false);
document.forms.removeUser.addEventListener('submit', validateInput, false);
document.forms.cleanupTweets.addEventListener('submit', validateInput, false);
document.forms.statistics.addEventListener('submit', validateInput, false);
