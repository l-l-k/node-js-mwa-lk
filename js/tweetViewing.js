var tweetFilter;
var tweetsTable;
var selectedFilterOption;

function resetSelectionRange() {
    selectionRange = [-1, -1];
}

function updateTableSettings(selectedOption) {

    var delRowsButton = document.forms.tweetAuthor.elements.deleteSelectedRows;
    delRowsButton.disabled = true;
    var delAllButton = document.forms.tweetAuthor.elements.deleteAll;
    delAllButton.disabled = true;

    switch (selectedOption.value) {
        case "me":
            tweetFilter = activeUser.id;
            tableType = "small";
            delRowsButton.disabled = false;
            delAllButton.disabled = false;
            break;

        case "other":
            var username = document.forms.tweetAuthor.elements.author.value.trim();
            var otherUser = retrieveUserDataByName(username);
            tweetFilter = otherUser.id;
            tableType = "small";
            break;

        case "some":
            //TODO : create filter term
            tweetFilter = document.forms.tweetAuthor.elements.author.trim();
            tableType = "wide";
            break;

        case "all":
            tweetFilter = "*";
            tableType = "wide";
            break;

        case 'none':
            tweetsTable.className = 'hidden';
            break;
    }
    activeFilter = tweetFilter;
}

function updateUserView() {
    // ensure access to table
    if (tweetsTable == null) {
        var options = document.forms.tweetAuthor.elements.filter;
        for (var i = [0]; i < options.length; i++) {
            if (options[i].checked) {
                selectedFilterOption = options[i];
                updateTableSettings(selectedFilterOption);
                tweetsTable = document.getElementById("extractedTweets")
                break;
            }
        }
    }

    if (selectedFilterOption.value == "other") {
        // regard changed user-id
        updateTableSettings(selectedFilterOption);
    }

    // hide table while updating
    tweetsTable.className = 'hidden';

    // add new content
    var tweets = getSubsetOfTweetsByID(tweetFilter);
    updateTable(tweetsTable, tweets);

    tweetsTable.className = 'notHidden';
    tweetsTable.addEventListener('click', tblClicked, false);
}

function filterChanged(e) {
    if (e.currentTarget.checked) {
        selectedFilterOption = e.currentTarget;
        updateTableSettings(selectedFilterOption);
        tweetsTable = document.getElementById("extractedTweets");
        activeTable = tweetsTable;
    }
}

function historyButtonClicked(e) {
    activeTable = tweetsTable;
    var clickedButton = e.explicitOriginalTarget;
    switch (clickedButton.id) {
        case 'updateView':
            tweetsTable.className = 'notHidden';
            updateUserView();
            break;

        case 'deleteSelectedRows':
            deleteSelectedRows(activeUser.id);
            break;

        case 'deleteAll':
            deleteAllTweets(activeUser.id);
            break;
    }

    // Don't reload form
    e.preventDefault();
    e.stopPropagation();
    setTimeout(function () { }, 1500);
}
// _____________________________________________________
// event handler 

(function () {
    var frm = document.forms.tweetAuthor
    frm.addEventListener('submit', historyButtonClicked, false);

    var options = frm.elements.filter;
    var option;
    for (var i = [0]; i < options.length; i++) {
        option = options[i];
        option.addEventListener('click', filterChanged, false);
        if (option.checked) {
            selectedFilterOption = option;
        }
    }

    tweetsTable = document.getElementById("extractedTweets");
    updateTableSettings(selectedFilterOption);
} ());
