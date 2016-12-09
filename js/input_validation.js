/* data request support */
// global variables
var elSignupForm = document.getElementById('signup')


// validateSignupInput

function validateInput(event) {
    //elSignupForm.                        
    //TODO Send data to server
    var thisForm = event.originalTarget
    var mailAddress;
    var pw;
    var username;

    switch (thisForm) {
        case document.forms.signup:
            mailAddress = thisForm.elements.mailAddress;
            pw = thisForm.elements.mailAddress;
            username = thisForm.elements.username;
            break;

        case document.forms.login:
            mailAddress = thisForm.elements.mailAddress;
            pw = thisForm.elements.mailAddress;
            break;

        case document.forms.userdata:
            mailAddress = thisForm.elements.mailAddress;
            pw = thisForm.elements.mailAddress;
            username = thisForm.elements.username;
            break;

        // ADMIN Tasks
        case document.forms.addUser:
            mailAddress = thisForm.elements.mailAddress;
            pw = thisForm.elements.mailAddress;
            username = thisForm.elements.username;
            break;

        case document.forms.removeUser:
            mailAddress = thisForm.elements.mailAddress;
            username = thisForm.elements.username;
            break;

        case document.forms.cleanupTweets:
            mailAddress = thisForm.elements.mailAddress;
            username = thisForm.elements.username;
            break;

        case document.forms.statistics:
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

function validateNewMailAddress(mailAddressExists) {
    var elFeedback = document.getElementById('feedback11')
    if (mailAddressExists) {
        elFeedback.className = 'warning';
        elFeedback.innerHTML = 'Address already exists.' + '<br />' + 'Edit Account to change password or username.';
    } else {
        elFeedback.className = 'hidden';
    }
}

function validateNewUsername(isValidName) {
    var elFeedback = document.getElementById('feedback13')
    if (!isValidName) {
        elFeedback.className = 'warning';
        elFeedback.innerHTML = 'Name already exists. Please choose another.';
    } else {
        elFeedback.className = 'hidden';
    }
}


// Event handler
//=============================================================
elSignupForm.addEventListener('submit', validateInput, false);
//elSelectPackage.addEventListener('change', packageHint, false);
