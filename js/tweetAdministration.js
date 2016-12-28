var selectedAdmFilterOption;
var admTweetsTable;

// ___________________________________________________________
// Radio-Button Event Handler

function admFilterChanged(e) {
    if (e.currentTarget.checked) {
        selectedAdmFilterOption = e.currentTarget;
        updateAdmTableSettings(selectedAdmFilterOption);
    }
}

function updateAdmTableSettings(selectedOption) {

    tableType = "small";

    var findButton = document.forms.cleanupTweets.elements.findTweets;
    var delAllButton = document.forms.cleanupTweets.elements.cleanupTweets;

    switch (selectedOption.value) {
        case "some":
            findButton.disabled = false;
            delAllButton.disabled = true;
            admTweetsTable.className = 'notHhidden';
            break;

        case "all":
            findButton.disabled = true;
            delAllButton.disabled = false;
            admTweetsTable.className = 'hidden';
            break;
    }
}

// ___________________________________________________________
// Submit-Button Event Handler

function manageTweets(e) {
    var mailAddress = document.forms.cleanupTweets.elements.userID.value.trim();
    if (!findMailAddress(mailAddress)) {
        alert("Unknown address : " + mailAddress);
    } else {
        activeTable = admTweetsTable;
        var user = retrieveUserDataByMailAddress(mailAddress);
        var delAllButton = document.forms.cleanupTweets.elements.cleanupTweets;
        var action = e.explicitOriginalTarget;

        switch (action.name) {
            case 'userID':
                // ignore this action
                break;

            case 'findTweets':
                delAllButton.disabled = false;
                var tweets = getSubsetOfTweetsByID(user.id);
                updateTable(admTweetsTable, tweets);
                admTweetsTable.addEventListener('click', tblClicked, false);
                break;

            case 'cleanupTweets':
                deleteTweets(selectedAdmFilterOption, user.id);
                updateAdmTableSettings(selectedAdmFilterOption);
                if (tableUpdateRequested) {
                    var tweets = getSubsetOfTweetsByID(user.id);
                    updateTable(admTweetsTable, tweets);
                    delAllButton.disabled = false;
                }
                break;
        }
    }

    // Don't reload form
    e.preventDefault();
    e.stopPropagation();
    setTimeout(function () { }, 1500);
}

function updateAdmViewSettings() {
    var options = document.forms.cleanupTweets.elements.adminFilter;
    for (var i = [0]; i < options.length; i++) {
        if (options[i].checked) {
            selectedAdmFilterOption = options[i];
            updateAdmTableSettings(selectedAdmFilterOption);
            break;
        }
    }
}

function deleteTweets(selectedOption, userID) {
    switch (selectedOption.value) {
        case "some":
            deleteSelectedRows(userID);
            tableUpdateRequested = true;
            break;

        case "all":
            if (deleteAllTweets(userID)) {
                alert("Tweets successfully deleted.")
            } else {
                alert("Removing tweets failed.")
            }
            break;
    }
}

// _____________________________________________________
// event handler 

(function () {
    var frm = document.forms.cleanupTweets;
    frm.addEventListener('submit', manageTweets, false);

    var options = frm.elements.adminFilter;
    var option;
    for (var i = [0]; i < options.length; i++) {
        option = options[i];
        option.addEventListener('click', admFilterChanged, false);
        if (option.checked) {
            selectedAdmFilterOption = option;
        }
    }

    admTweetsTable = document.getElementById("userRelatedTweets");
    updateAdmTableSettings(selectedAdmFilterOption);

} ());
