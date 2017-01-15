function inputValidation() {
    // Private properties
    var activeForm;
    var tweetsTable = document.getElementById("extractedTweets");
    var tweetTbl = new tweetTable(tweetsTable);

    // Private methods
    function validateSignup(temporaryUser) {
        // try retrieving user data from storage
        var existingUser = storageReader.retrieveUserDataByMailAddress(temporaryUser.mailAddress);
        var addressExists = existingUser.mailAddress != null && existingUser.mailAddress.length > 0;
        displayMailAddressHint(addressExists);

        // ask server if name exists
        var user = storageReader.retrieveUserDataByName(temporaryUser.username);
        var nameExists = user.username != null && user.username.length > 0;
        displayUsernameHint(nameExists);

        var isValidUser =
            !addressExists &&
            !nameExists &&
            isValidPassword(temporaryUser.password);

        if (isValidUser) {
            // append user to storage
            var newUser = storageWriter.appendUser(temporaryUser);
            if (newUser != null) {
                lastUser = newUser;  // prepare login
            } else {
                isValidUser = false;
            }
        }

        return isValidUser;
    }

    function validateLogin(temporaryUser) {
        // try retrieving user data from storage
        var existingUser = storageReader.retrieveUserDataByMailAddress(temporaryUser.mailAddress);

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

        return isValidUser;
    }

    function validateSettingChanges(temporaryUser) {
        // compare with current user and database
        var hasChanges = false;
        var storeSettings = false;
        var settingsChanged = false;
        var hasUsernameChanged = false;  // triggers update of tweet-history
        var user;

        // mail address
        var isValidAddress = true;
        if (activeUser.mailAddress != temporaryUser.mailAddress) {
            // ask server if name exists
            user = storageReader.retrieveUserDataByMailAddress(temporaryUser.mailAddress);
            var addressExists = user.mailAddress != null && user.mailAddress.length > 0;

            displayMailAddressHint(addressExists);
            isValidAddress = !addressExists;
            hasChanges = true;
        }

        // username 
        var isValidName = true;
        if (activeUser.username != temporaryUser.username) {
            // ask server if name exists
            user = storageReader.retrieveUserDataByName(temporaryUser.username);
            var nameExists = user.username != null && user.username.length > 0;

            displayUsernameHint(nameExists);
            isValidName = !nameExists;
            hasChanges = true;
            hasUsernameChanged = isValidName;
        }

        // password
        var isValidPW = true;
        // If real world app: get pw from server (don't store it in memory)
        if (activeUser.password != temporaryUser.password) {
            isValidPW = isValidPassword(temporaryUser.password);
            hasChanges = true;
        }

        storeSettings = hasChanges && isValidPW && isValidName && isValidAddress

        if (storeSettings) {
            if (storageWriter.updateUser(temporaryUser, activeUser.id)) {
                settingsChanged = true;
                // Update displayed tweet timeline ?
                if (hasUsernameChanged) {
                    // TODO : improve performace by checking if user is listed in current timeline
                    // Update timeline
                    var tweets = storageReader.getSubsetOfTweetsByID(tweetFilter);
                    tweetTbl.updateTable(tweets);
                }
                activeFieldset.className = 'hidden';
            }
        }

        return settingsChanged;
    }

    function displayMailAddressHint(mailAddressExists) {
        // Update dialog
        var feedback;
        var msg;
        var msgRequested = false;

        switch (activeForm) {
            case document.forms.signup:
                msgRequested = mailAddressExists;
                feedback = document.getElementById('feedbackAddressExists')
                msg = 'Address already exists.' + '<br />' + 'Edit Account to change password or username.';
                break;
            case document.forms.login:
                msgRequested = !mailAddressExists;
                feedback = document.getElementById('feedbackAddressUnknown')
                msg = 'Mail-Address unknown.' + '<br />';
                break;
            case document.forms.addUser:
                msgRequested = mailAddressExists;
                feedback = document.getElementById('feedbackAddressAlreadyExists')
                msg = 'Address already exists.' + '<br />' + 'Edit Account to change password or username.';
                break;
        }

        if (feedback != null) {
            if (msgRequested) {
                feedback.className = 'warning';
                feedback.innerHTML = msg;
            } else {
                feedback.className = 'hidden';
            }
        }

    }

    function displayUsernameHint(nameExists) {
        // Update dialog
        var feedback;
        switch (activeForm) {
            case document.forms.signup:
                feedback = document.getElementById('feedbackUsernameExists')
                break;
            case document.forms.addUser:
                feedback = document.getElementById('feedbackUsernameAlreadyExists')
                break;
        }

        if (feedback != null) {
            if (nameExists) {
                feedback.className = 'warning';
                feedback.innerHTML = 'Name already exists. Please choose another.';
            } else {
                feedback.className = 'hidden';
            }
        }
    }

    function displayPasswordHint(isValidPW) {
        var feedback = document.getElementById('feedbackPasswordUnknown')
        if (isValidPW) {
            feedback.className = 'hidden';
        } else {
            feedback.className = 'warning';
            feedback.innerHTML = 'Password is not valid.' + '<br />';
        }
    }

    function isValidPassword(pw) {
        // ER: validate PW-Security
        return true;
    }

    function setCurrentUser(id) {
        currentUser.id = id;
        currentUser.isAdmin = storageReader.determineUserStatus(id);
    }

    function removeUser(mailAddress) {
        // Admin-Task removeUser
            user = storageReader.retrieveUserDataByMailAddress(temporaryUser.mailAddress);
            var addressExists = user.mailAddress != null && user.mailAddress.length > 0;
        if (userExists) {
            var user = storageReader.retrieveUserDataByMailAddress(mailAddress);
            // First remove user's tweets ...
            if (storageWriter.deleteUserTweets(user.id)) {
                // ... then remove user
                userExists = !storageWriter.deleteUser(user);
            }
        }
        return userExists;
    }


    // Private objects
    // userdata generated by input-forms
    function temporaryUser(email, password, name) {
        this.mailAddress = email.trim();
        this.password = password.trim();
        this.username = name.trim();
    }

    // ___________________________________________________________
    // Public methods

    var validationObject = {

        validateInput: function (event) {
            //TODO Send data to server
            var success = false;
            activeForm = event.currentTarget;
            activeFieldset = activeForm.parentElement;

            try {
                switch (activeForm) {
                    case document.forms.signup:
                        var newUser = new temporaryUser(
                            activeForm.elements.mailAddress.value,
                            activeForm.elements.password.value,
                            activeForm.elements.username.value)
                        success = validateSignup(newUser);
                        if (success) {
                            // ER : ensure identity by sending an activation mail

                            // Welcome-Message
                            var feedback = document.getElementById('feedbackSignup');
                            feedback.className = 'info';
                            feedback.innerHTML = 'Welcome ' + newUser.username + '<br />' + "You may login now";
                        }
                        break;

                    case document.forms.login:
                        var loginUser = new temporaryUser(
                            activeForm.elements.mailAddress.value,
                            activeForm.elements.password.value,
                            "")
                        success = validateLogin(loginUser);
                        if (success) {
                            document.getElementById("nameOfCurrentUser").innerHTML = activeUser.username;
                            if (!currentUser.isAdmin) {
                                activateTweetMode();
                            }
                        }
                        break;

                    case document.forms.userdata:
                        var settings = new temporaryUser(
                            activeForm.elements.mailAddress.value,
                            activeForm.elements.password.value,
                            activeForm.elements.username.value)
                        success = validateSettingChanges(settings);
                        if (success) {
                            // Change label text 'My tweets'
                            document.getElementById("labelR1").innerHTML = "My tweets (" + activeUser.username + ")";
                            if (!currentUser.isAdmin) {
                                activateTweetMode();
                            }
                        }
                        break;

                    // ADMIN Tasks
                    case document.forms.addUser:
                        var newUser = new temporaryUser(
                            activeForm.elements.mailAddress.value,
                            activeForm.elements.password.value,
                            activeForm.elements.username.value)
                        success = validateSignup(newUser);
                        if (success) {
                            alert("User successfully added.")
                        }
                        break;

                    case document.forms.removeUser:
                        // here the mail address serves as userid 
                        if (removeUser(activeForm.elements.userID.value)) {
                            alert("User successfully deleted.")
                        } else {
                            alert("User already exists.")
                        }
                        break;
                }

            } catch (e) {
                var err = e.name + ' ' + e.message;
                alert(err);
                success = false;

            } finally {

            }

            // Don't reload form
            event.preventDefault();
        }

    }

    return validationObject;
}

// Event handler
(function () {
    var inputValidator = new inputValidation();
    document.forms.signup.addEventListener('submit', inputValidator.validateInput, false);
    document.forms.login.addEventListener('submit', inputValidator.validateInput, false);
    document.forms.userdata.addEventListener('submit', inputValidator.validateInput, false);
    document.forms.addUser.addEventListener('submit', inputValidator.validateInput, false);
    document.forms.removeUser.addEventListener('submit', inputValidator.validateInput, false);
} ());
