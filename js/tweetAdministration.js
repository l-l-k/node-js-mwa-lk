function tweetAdministration() {
    // Private properties
    var activeFilter;
    var selectedFilterOption = "";
    var tweetsTable = document.getElementById("userRelatedTweets");
    var tweetTbl = new tweetTable(tweetsTable);
    var tableUpdateRequested = false;

    // Private methods
    function determineFilterOption() {
        var options = document.forms.cleanupTweets.elements.filter;
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                selectedFilterOption = options[i];
                break;
            }
        }
    }

    function updateAdmViewSettings() {
        determineFilterOption;
        updateTableSettings();
    }

    function updateTableSettings() {

        var findButton = document.forms.cleanupTweets.elements.findTweets;
        var delAllButton = document.forms.cleanupTweets.elements.cleanupTweets;

        switch (selectedFilterOption.value) {
            case "any":
                findButton.disabled = false;
                delAllButton.disabled = true;
                tweetsTable.className = 'notHhidden';
                // create filter term for defined user
                activeFilter = document.forms.cleanupTweets.elements.userID.trim();
                break;

            case "all":
                findButton.disabled = true;
                delAllButton.disabled = false;
                tweetsTable.className = 'hidden';
                activeFilter = "*";
                break;
        }

        tweetTbl.setTableType("small");
    }

    function deleteTweets(userID) {
        switch (selectedFilterOption.value) {
            case "any":
                tweetTbl.deleteSelectedTweets(userID);
                tableUpdateRequested = true;
                break;

            case "all":
                if (tweetTbl.deleteAllTweets(userID)) {
                    alert("Tweets successfully deleted.")
                } else {
                    alert("Removing tweets failed.")
                }
                break;
        }
    }

    // ___________________________________________________________
    // Public methods

    var administratioObject = {

        updateAdmTableSettings: function (selectedOption) {
            selectedFilterOption = selectedOption;
            updateTableSettings();
        },

        // ___________________________________________________________
        // Event Handler

        // Radio-Button Event Handler
        admFilterChanged: function (e) {
            if (e.currentTarget.checked) {
                selectedFilterOption = e.currentTarget;
                updateTableSettings(selectedFilterOption);
            }
        },

        // Submit-Button
        manageTweets: function (e) {
            var mailAddress = document.forms.cleanupTweets.elements.userID.value.trim();
            if (!storageReader.findMailAddress(mailAddress)) {
                alert("Unknown address : " + mailAddress);
            } else {
                var user = storageReader.retrieveUserDataByMailAddress(mailAddress);
                var delAllButton = document.forms.cleanupTweets.elements.cleanupTweets;
                var action = e.explicitOriginalTarget;

                switch (action.name) {
                    case 'userID':
                        // ignore this action
                        break;

                    case 'findTweets':
                        delAllButton.disabled = false;
                        var tweets = storageReader.getSubsetOfTweetsByID(user.id);
                        tweetTbl.updateTable(tweets);
                        tweetsTable.addEventListener('click', tweetTbl.findTweets, false);
                        break;

                    case 'cleanupTweets':
                        deleteTweets(user.id);
                        updateTableSettings();
                        if (tableUpdateRequested) {
                            var tweets = storageReader.getSubsetOfTweetsByID(user.id);
                            tweetTbl.updateTable(tweets);
                            delAllButton.disabled = false;
                            tableUpdateRequested = false;
                        }
                        break;
                }
            }

            // Don't reload form
            e.preventDefault();
            e.stopPropagation();
            setTimeout(function () { }, 1500);
        }

    }
    return administratioObject;

}

// _____________________________________________________
// event handler 

(function () {
    var tweetAdmin = new tweetAdministration();

    var frm = document.forms.cleanupTweets;
    frm.addEventListener('submit', tweetAdmin.manageTweets, false);

    var options = frm.elements.adminFilter;
    var option;
    var selectedFilterOption;
    for (var i = [0]; i < options.length; i++) {
        option = options[i];
        option.addEventListener('click', tweetAdmin.admFilterChanged, false);
        if (option.checked) {
            selectedFilterOption = option;
        }
    }

    // admTweetsTable = document.getElementById("userRelatedTweets");
    tweetAdmin.updateAdmTableSettings(selectedFilterOption);

} ());
