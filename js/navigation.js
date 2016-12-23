/* navigation support */
// other global variables
var sections = [elAccountSection, elEmptyPageSection, elTweetSection, elAdminSection]
var activeSection;
var fieldsets = [elSignup, elLogin, elUserData, elAddUser, elRemoveUser, elCleanupTweets, elStatistics]
var activeFieldset;
var activeElement;

//=============================================================
function activateSection(sectionID) {
    activeElement = activeSection;
    activateElement(sections, sectionID);
    activeSection = activeElement;
}

function activateFieldset(fieldsetID) {
    activeElement = activeFieldset;
    activateElement(fieldsets, fieldsetID);
    activeFieldset = activeElement;
}

function activateElement(elements, elementID) {
    var elementToActivate = document.getElementById(elementID);
    var activeElementChanged = true;
    if (activeElement != null) {
        if (activeElement.id == elementID && activeElement.hasAttribute('class')) {
            if (activeElement.className = 'hidden') {
                activeElement.className = 'notHidden';
            } else {
                activeElementChanged = false;
            }
        }
    }

    if (activeElementChanged = true) {
        var element;
        for (i = 0; i < elements.length; i++) {
            element = elements[i]
            switch (element.id) {
                case elementID:
                    element.className = 'notHidden';
                    break;
                default:
                    element.className = 'hidden';
                    break;
            }
        }
        activeElement = elementToActivate;
    }
}

function tryEnableAdminMode() {
    // enable admin-link if required
    if (activeUser == null) {
        alert("Please login first.");
    } else {
        if (currentUser.isAdmin) {
            activateAdminMode();
        }
    }
}

function activateTweetSection() {
    if (activeUser == null) {
        alert("Please login first.");
    } else {
        activateSection('tweets');
    }
}

function activateAccountSection() {
    activateSection('account');
}

function activateAdminSection() {
    activateSection('administration');
}

// Event handlers connectod to page-navigation
//=============================================================

function activateSignup() {
    activateAccountSection();
    activateFieldset('signup');
    var feedback = document.getElementById('feedbackSignup');
    feedback.className = 'hidden';
}

function activateLogin() {
    activateAccountSection();
    activateFieldset('login');
    var loginForm = document.forms.login;
    loginForm.elements.mailAddress.value = lastUser.mailAddress;
}

function activateUserData() {
    if (activeUser == null) {
        alert("Please login first.");
    } else {
        activateAccountSection();
        activateFieldset('userdata');
        var settingsForm = document.forms.userdata;
        settingsForm.elements.mailAddress.value = activeUser.mailAddress;
        settingsForm.elements.username.value = activeUser.username;
    }
}

function activateAddUser() {
    activateFieldset('addUser');
}

function activateRemoveUser() {
    activateFieldset('removeUser');
}

function activateCleanupTweets() {
    activateFieldset('cleanupTweets');
}

function activateAdmSummary() {
    activateFieldset('statistics');
}

function activateAdminMode() {
    activateAdminSection();
}

function activateTweetMode() {
    activateTweetSection();
}


// Event handler
//=============================================================
