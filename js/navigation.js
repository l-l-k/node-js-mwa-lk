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
    // TODO check if user is admin
    var isAdmin = true;

    // TODO enable admin-link if required
    if (isAdmin) {
activateAdminMode();
    }
}

function activateTweetSection() {
    activateSection('tweets');
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
}

function activateLogin() {
    activateAccountSection();
    activateFieldset('login');
    prepareLoginForm();
}

function activateUserData() {
    activateAccountSection();
    activateFieldset('userdata');
    prepareSettingsForm();
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
