// Registration and  Login
var elSignup = document.getElementById('signup');
var elLogin = document.getElementById('login');
var elUserData = document.getElementById('userdata');
var elAccountSection = document.getElementById('account');
// Administration
var elAddUser = document.getElementById('addUser');
var elRemoveUser = document.getElementById('removeUser');
var elCleanupTweets = document.getElementById('cleanupTweets');
var elStatistics = document.getElementById('statistics');
var elAdminSection = document.getElementById('administration');
// Tweets
var elTweetSection = document.getElementById('tweets');
var elEmptyPageSection = document.getElementById('emptyPage')

var sections = [elAccountSection, elEmptyPageSection, elTweetSection, elAdminSection]
var activeSection;
var fieldsets = [elSignup, elLogin, elUserData, elAddUser, elRemoveUser, elCleanupTweets, elStatistics]
var activeFieldset;
var activeElement;

//=============================================================
function setup() {
    // hide navigation to admin-tools
    var elAdminLink = document.getElementById('adminLink');
    elAdminLink.className = 'hidden';

    // Hide Sections
    elAccountSection.className = 'hidden';
    elEmptyPageSection.className = 'notHidden';
    elTweetSection.className = 'hidden';
    elAdminSection.className = 'hidden';

    // Hide all fieldsets in section account (Registration and  Login)
    elSignup.className = 'hidden';
    elLogin.className = 'hidden';
    elUserData.className = 'hidden';

    // Hide all fieldsets in section administration
    elAddUser.className = 'hidden';
    elRemoveUser.className = 'hidden';
    elCleanupTweets.className = 'hidden';
    elStatistics.className = 'hidden';
}

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

    // TODO enable admin-link if required
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

// Event handler
//=============================================================

function activateSignup() {
    activateAccountSection();
    activateFieldset('signup');
   // window.location.href = undefined;
}

function activateLogin() {
    activateAccountSection();
    activateFieldset('login');
   // window.location.href = undefined;
}

function activateUserData() {
    activateAccountSection();
    activateFieldset('userdata');
   // window.location.href = undefined;
}

function activateAdminMode() {
    activateAdminSection();
   // window.location.href = undefined;
}

function activateTweetMode() {
    activateTweetSection();
   // window.location.href = undefined;
}


// Event handler
//=============================================================
// call invoke while loading the page
document.addEventListener('DOMContentloaded', setup, false);
// call invoke after loading the page
document.addEventListener('load', setup, false);

//elForm.addEventListener('submit', checkTerms, false);
//elSelectPackage.addEventListener('change', packageHint, false);
