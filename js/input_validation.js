/* data request support */
// global variables
var elSignupForm = document.getElementById('signup')


// validateSignupInput

function validateSignupInput(event) {
    //elSignupForm.                        
    //TODO Send data to server

    switch (this.id) {
        case 'signup':
            break;
        case 'login':
            break;
        case 'userdata':
            break;
    }

    try {

        var mailAddressExists = true;
        validateMailAddress(mailAddressExists);

        var isValidName = false;
        validateUsername(isValidName);
    } catch (e) {
        var err = e.name + ' ' + e.message;
    } finally {

    }

    if ((!isValidName) || (mailAddressExists)) {
        event.preventDefault(); // Don't submit form
    }
}

function validateMailAddress(mailAddressExists) {
    var elFeedback = document.getElementById('feedback11')
    if (mailAddressExists) {
        elFeedback.className = 'warning';
        elFeedback.innerHTML = 'Address already exists.' + '<br />' + 'Edit Account to change password or username.';
    } else {
        elFeedback.className = 'hidden';
    }
}

function validateUsername(isValidName) {
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
elSignupForm.addEventListener('submit', validateSignupInput, false);
//elSelectPackage.addEventListener('change', packageHint, false);
