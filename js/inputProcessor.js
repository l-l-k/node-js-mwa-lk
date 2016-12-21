/* data request support */
// global variables
var activeUser;
var activeFieldset;
var activeForm;

function validateInput(event) {
    //TODO Send data to server
    var isValidInput = false;
    activeForm = event.currentTarget;
    activeFieldset = activeForm.parentElement;

    try {
        switch (activeForm) {
            case document.forms.signup:
                var newUser = new temporaryUserData(
                    activeForm.elements.mailAddress,
                    activeForm.elements.password,
                    activeForm.elements.username)
                isValidInput = validateSignup(newUser);
                break;

            case document.forms.login:
                var loginUser = new temporaryUserData(
                    activeForm.elements.mailAddress,
                    activeForm.elements.password,
                    "")
                isValidInput = validateLogin(loginUser);
                break;

            case document.forms.userdata:
                var settings = new temporaryUserData(
                    activeForm.elements.mailAddress,
                    activeForm.elements.password,
                    activeForm.elements.username)
                isValidInput = validateSettingChanges(settings);
                break;

            // ADMIN Tasks
            case document.forms.addUser:
                var newUser = new temporaryUserData(
                    activeForm.elements.mailAddress,
                    activeForm.elements.password,
                    activeForm.elements.username)
                isValidInput = validateSignup(newUser);
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

    } catch (e) {
        var err = e.name + ' ' + e.message;
        alert(err);
        isValidInput=false;

    } finally {

    }

    if (!isValidInput) {
        event.preventDefault(); // Don't submit form
    }
}

function validateSignup(temporaryUser) {
    // try retrieving user data from storage
    var existingUser = retrieveUserDataByMailAddress(temporaryUser);

    var addressExists = existingUser.mailAddress == null || existingUser.mailAddress == "";
    displayMailAddressHint(addressExists);

    // ask server if name exists
    var nameExists = findUserName(temporaryUser.username);
    displayUsernameHint(nameExists);

    var isValidUser =
        !addressExists &&
        !nameExists &&
        isValidPassword(temporaryUser.password);

    if (isValidUser) {
        // append user to storage
        var newUser = appendUser(temporaryUser);

        // TODO : send activation mail

        // Welcome-Message
        var feedback = document.getElementById('feedbackSignup')
        if (!isValidPW) {
            elFeedback.className = 'info';
            elFeedback.innerHTML = 'Welcome ' + newUser.username + '<br />' + "You may login now";
        } else {
            elFeedback.className = 'hidden';
        }
    }

    return isValidUser;
}

function validateLogin(temporaryUser) {
    // try retrieving user data from storage
    var existingUser = retrieveUserDataByMailAddress(temporaryUser);

    var addressExists = existingUser.mailAddress != null && existingUser.mailAddress.length > 0;
    displayMailAddressHint(addressExists);

    var pwExists = temporaryUser.password == existingUser.password;
    displayPasswordHint(pwExists);

    var isValidUser = addressExists && pwExists
    if (isValidUser) {
        activeUser = existingUser;
        setCurrentUser(activeUser.id);
        activeFieldset.className = 'hidden';
    }
}

function validateSettingChanges(temporaryUser) {
    // compare with current user and database
    var hasChanges = false;
    var storeSettings = false;

    // mail address
    var isValidAddress = true;
    var addressExists = false;
    if (activeUser.mailAddress != temporaryUser.mailAddress) {
        // ask server if name exists
        var addressExists = findMailAddress(temporaryUser.mailAddress);
        displayMailAddressHint(addressExists);
        isValidAddress = !addressExists;
        hasChanges = true;
    }

    // username 
    var isValidName = true;
    var nameExists = false;
    if (activeUser.username != temporaryUser.username) {
        // ask server if name exists
        var nameExists = findUserName(temporaryUser.username);
        displayUsernameHint(nameExists);
        isValidName = !nameExists;
        hasChanges = true;
    }

    // password
    var isValidPW = true;
    // If real world app: get pw from server (don't store it in memory)
    if (activeUser.password != temporaryUser.password) {
        isValidPW = isValidPassword(user);
        hasChanges = true;
    }

    storeSettings = hasChanges && isValidPW && isValidName && isValidAddress

    if (storeSettings) {
        updateUser(temporaryUser)
        activeUser = temporaryUser;
        // TODO update displayed tweet timeline
        activeFieldset.className = 'hidden';
    }
}

function displayMailAddressHint(mailAddressExists) {
    // Update dialog
    switch (activeForm) {
        case document.forms.signup:
            var elFeedback = document.getElementById('feedbackAddressExists')
            if (mailAddressExists) {
                elFeedback.className = 'warning';
                elFeedback.innerHTML = 'Address already exists.' + '<br />' + 'Edit Account to change password or username.';
            } else {
                elFeedback.className = 'hidden';
            }

        case document.forms.login:
            var elFeedback = document.getElementById('feedbackAddressUnknown')
            if (mailAddressExists) {
                elFeedback.className = 'warning';
                elFeedback.innerHTML = 'Mail-Address unknown.' + '<br />';
            } else {
                elFeedback.className = 'hidden';
            }
    }

    return mailAddressExists;
}

function displayUsernameHint(nameExists) {
    // Update dialog
    var elFeedback = document.getElementById('feedbackUsernameExists')
    if (nameExists) {
        elFeedback.className = 'warning';
        elFeedback.innerHTML = 'Name already exists. Please choose another.';
    } else {
        elFeedback.className = 'hidden';
    }
}

function displayPasswordHint(isValidPW) {
    var elFeedback = document.getElementById('feedbackPasswordUnknown')
    if (!isValidPW) {
        elFeedback.className = 'warning';
        elFeedback.innerHTML = 'Password is not valid.' + '<br />';
    } else {
        elFeedback.className = 'hidden';
    }
}


function isValidPassword() {
    // TODO validate PW-Security
    return true;
}

function setCurrentUser(activeUser) {
    currentUser.id = activeUser.userID;
    currentUser.isAdmin = determineUserStatus(currentUser.id)
}

function removeUser(userID) {
 //TODO : Admin-Task removeUser
}

function removeTweets(userID) {
 //TODO : Admin-Task removeTweets
}

function getAccountSummary(firstDay, lastDay) {
 //TODO : Admin-Task getAccountSummary
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
