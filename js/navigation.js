// Activation object
var activator = (function () {
    // Private properties
    var activeSection;
    var activeElement;

    // Private methods
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

    // Public methods
    return {
        performLogout: function () {
            document.getElementById("nameOfCurrentUser").innerHTML = " ";
            resetUI();
        },

        activateSignup: function () {
            activateAccountSection();
            activateFieldset('signup');
            var feedback = document.getElementById('feedbackSignup');
            feedback.className = 'hidden';
        },

        activateLogin: function () {
            activateAccountSection();
            activateFieldset('login');
            var loginForm = document.forms.login;
            loginForm.elements.mailAddress.value = lastUser.mailAddress;
        },

        activateUserData: function () {
            if (activeUser == null) {
                alert("Please login first.");
            } else {
                activateAccountSection();
                activateFieldset('userdata');
                var settingsForm = document.forms.userdata;
                settingsForm.elements.mailAddress.value = activeUser.mailAddress;
                settingsForm.elements.username.value = activeUser.username;
                settingsForm.elements.password.value = activeUser.password;
            }
        },

        activateAddUser: function () {
            activateFieldset('addUser');
        },

        activateRemoveUser: function () {
            activateFieldset('removeUser');
        },

        activateCleanupTweets: function () {
            activateFieldset('cleanupTweets');
        },

        activateAdmSummary: function () {
            activateFieldset('statistics');
        },

        activateAdminMode: function () {
            activateAdminSection();
        },

        activateTweetMode: function () {
            activateTweetSection();
        }

    };

})();

//=============================================================
// Event handlers, connectod to page-navigation
//=============================================================

function performLogout() {
    activator.performLogout();
}

function activateSignup() {
    activator.activateSignup();
}

function activateLogin() {
    activator.activateLogin();
}

function activateUserData() {
    activator.activateUserData();
}

function activateAddUser() {
    activator.activateAddUser();
}

function activateRemoveUser() {
    activator.activateRemoveUser();
}

function activateCleanupTweets() {
    activator.activateCleanupTweets();
}

function activateAdmSummary() {
    activator.activateAdmSummary();
}

function activateAdminMode() {
    activator.activateAdminMode();
}

function activateTweetMode() {
    activator.activateTweetMode();
}
