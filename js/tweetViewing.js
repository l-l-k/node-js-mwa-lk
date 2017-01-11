function tweetView() {
    // Private properties
    var activeFilter;
    var selectedFilterOption = "";
    var tweetsTable = document.getElementById("extractedTweets");
    var tweetTbl = new tweetTable(tweetsTable);

    // Private methods
    function determineFilterOption() {
        var options = document.forms.tweetAuthor.elements.filter;
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                selectedFilterOption = options[i];
                break;
            }
        }
    }

    function editVipList() {
        var username = document.forms.tweetAuthor.elements.anyVIP.value.trim();
        var anyUser = storageReader.retrieveUserDataByName(username);
        if (anyUser != null) {
            var vip = new vipRecord(anyUser.id, username, "unchecked");
            storageWriter.toggleVIP(vip);
            cleanupVipList();
            createVipList();
        }
    }

    function cleanupVipList() {
        //var vipSection = document.getElementsByName('vipList');
        var checkboxes = document.getElementsByName('vipMember');
        var parent = checkboxes[0].parentNode;
        for (var i = checkboxes.length - 1; i >= 0; i--) {
            parent.removeChild(checkboxes[i])
        }
        var labels = document.getElementsByName('vipLabel');
        for (var i = labels.length - 1; i >= 0; i--) {
            parent.removeChild(labels[i])
        }

    }

    function createVipList() {
        var vip = vipRecord;
        var position = document.getElementById("vipList");

        for (var i = 0; i < vips.length; i++) {
            vip = vips[i];
            var itemID = "vipLabel" + i;
            var chkItem = document.createElement('input');
            chkItem.setAttribute("type", "checkbox");
            chkItem.setAttribute("id", "itemID");
            chkItem.setAttribute("class", "vipItem");
            chkItem.setAttribute("name", "vipMember");
            chkItem.setAttribute("value", vip.id);
            chkItem.setAttribute("checked", vip.checked);
            position.appendChild(chkitem);

            var lbl = document.createElement('label');
            lbl.setAttribute("for", "itemID");
            lbl.innerHTML = vip.name;
            position.appendChild(lbl);
        }

    }

    function updateUserView() {
        determineFilterOption;
        updateTableSettings();

        // hide table while updating
        tweetsTable.className = 'hidden';

        // add new content
        var tweets = storageReader.getSubsetOfTweetsByID(tweetFilter);
        tweetTbl.updateTable(tweets);

        tweetsTable.className = 'notHidden';
        tweetsTable.addEventListener('click', tweetTbl.findTweets, false);
    }

    function updateTableSettings() {

        var delRowsButton = document.forms.tweetAuthor.elements.deleteSelectedRows;
        delRowsButton.disabled = true;
        var delAllButton = document.forms.tweetAuthor.elements.deleteAll;
        delAllButton.disabled = true;

        switch (selectedFilterOption.value) {
            case "me":
                activeFilter = activeUser.id;
                tableType = "small";
                delRowsButton.disabled = false;
                delAllButton.disabled = false;
                break;

            case "other":
                var username = document.forms.tweetAuthor.elements.author.value.trim();
                var otherUser = storageReader.retrieveUserDataByName(username);
                activeFilter = otherUser.id;
                tableType = "small";
                break;

            case "some":
                //TODO : append vips to filter term in order to display more than one user
                activeFilter = document.forms.tweetAuthor.elements.author.trim();
                tableType = "wide";
                break;

            case "all":
                activeFilter = "*";
                tableType = "wide";
                break;

            case 'none':
                activeFilter = "";
                tweetsTable.className = 'hidden';
                break;
        }

        // TODO: append vips to filter

        tweetTbl.setTableType(tableType);
    }

    // ___________________________________________________________
    // Public methods

    var tableViewObject = {

        filterChanged: function (e) {
            if (e.currentTarget.checked) {
                selectedFilterOption = e.currentTarget;
                updateTableSettings(selectedFilterOption);
                tweetsTable = document.getElementById("extractedTweets");
            }
        },

        historyButtonClicked: function (e) {
            var clickedButton = e.explicitOriginalTarget;
            switch (clickedButton.id) {
                case "editVipList":
                    editVipList();
                    break;

                case 'updateView':
                    tweetsTable.className = 'notHidden';
                    updateUserView();
                    break;

                case 'deleteSelectedRows':
                    tweetTbl.deleteSelectedTweets(activeUser.id);
                    break;

                case 'deleteAll':
                    tweetTbl.deleteAllTweets(activeUser.id);
                    break;
            }

            // Don't reload form
            e.preventDefault();
            e.stopPropagation();
            setTimeout(function () { }, 1500);
        },

        fitSettings: function (selectedOption) {
            selectedFilterOption = selectedOption;
            updateTableSettings(selectedFilterOption);
        },

        populateVipList: function () {
            cleanupVipList();
            createVipList();
        },

    }
    return tableViewObject;

}

// _____________________________________________________
// event handler 

(function () {
    var viewer = new tweetView();
    var frm = document.forms.tweetAuthor
    frm.addEventListener('submit', viewer.historyButtonClicked, false);

    var options = frm.elements.filter;
    var option;
    for (var i = [0]; i < options.length; i++) {
        option = options[i];
        option.addEventListener('click', viewer.filterChanged, false);
        if (option.checked) {
            selectedFilterOption = option;
        }
    }

    //tweetsTable = document.getElementById("extractedTweets");
    viewer.fitSettings(selectedFilterOption);
    viewer.populateVipList();
} ());
