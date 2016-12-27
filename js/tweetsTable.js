var tweetFilter;
var tableType = "small";
var updatingTweetHistoryRequested = false;
var visibleTweets = new Array();
var tweetsTableContainer, tweetsTable;
var selectedRows;

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
    }
}

function updateTable(existingTable) {
    var header, body;
    var columns = [];

    try {
        existingTable.innerHTML = "";
        visibleTweets = getSubsetOfTweets(tweetFilter);

        if (tableType == "small") {
            columns = ["Day", "Time", "Message", "Attachment"];
            header = createTableHeader(columns);
            body = populateTable(visibleTweets, 1, columns.length);
        } else {
            columns = ["Author", "Day", "Time", "Message", "Attachment"];
            header = createTableHeader(columns);
            body = populateTable(visibleTweets, 0, columns.length);
        }

        existingTable.appendChild(header);
        existingTable.appendChild(body);
        // emptyTable.setAttribute("id", tweetsTable.id);


    } catch (e) {
        var err = e.name + ' ' + e.message;
        alert(err);
        success = false;

    } finally {

    }
}

function createTableHeader(columns) {
    var header = document.createElement("thead");
    var row = document.createElement("tr");
    var col, content;

    for (var i = 0; i < columns.length; i++) {
        col = document.createElement("th");
        content = document.createTextNode(columns[i]);
        col.appendChild(content);
        row.appendChild(col);
    }

    header.appendChild(row);
    return header;
}

function populateTable(tweetsToDisplay, indexOfFirstTweetProperty, amountOfColumns) {
    // small table : indexOfFirstColumn = 1
    var body = document.createElement("tbody");
    var row, col, content;
    var tweetRecord;
    var user = userRecord;

    for (var rowIndex = 0; rowIndex < tweetsToDisplay.length; rowIndex++) {
        row = document.createElement("tr");
        if (isEven(rowIndex)) {
            row.setAttribute("class", "even");
        }

        tweetRecord = tweetsToDisplay[rowIndex];

        for (var colIndex = indexOfFirstTweetProperty; colIndex < amountOfColumns; colIndex++) {
            col = document.createElement("td");
            switch (colIndex) {
                case 0:
                    user = retrieveUserDataByID(tweetRecord.userID)
                    content = document.createTextNode(user.username);
                    break;
                case 1:
                    content = document.createTextNode(tweetRecord.day);
                    break;
                case 2:
                    content = document.createTextNode(tweetRecord.time);
                    break;
                case 3:
                    content = document.createTextNode(tweetRecord.message);
                    break;
                case 4:
                    content = document.createTextNode(tweetRecord.attachment);
                    break;
            }
            col.appendChild(content);
            row.appendChild(col);
        }

        body.appendChild(row);
    }
    return body;
}

function viewUpdateRequested(event) {
    // ensure access to table
    if (tweetsTableContainer == null) {
        var options = document.forms.tweetAuthor.elements.filter;
        for (var i = [0]; i < options.length; i++) {
            if (options[i].checked) {
                updateTableSettings(options[i]);
                tweetsTableContainer = document.getElementById("tweetsTable")
                tweetsTable = document.getElementById("extractedTweets")
                break;
            }
        }
    }

    // cleanup existing content of table
    tweetsTableContainer.disabled = false;
    tweetsTableContainer.setAttribute('disabled', 'disabled');

    // add new content
    updateTable(tweetsTable);
    // tweetsTable.parentNode.insertBefore(updateTable(), tweetsTable);
    tweetsTableContainer.disabled = false;
    tweetsTable.addEventListener('click', tblClicked, false);
    /*    var rows = tweetsTable.getElementsByTagName('tr');
        for (i = 0; i < rows.length; i++) {
            rows[i].onclick = rowClicked;
        }
    */
    updatingTweetHistoryRequested = false;
    // Don't reload form
    event.preventDefault();
    event.stopPropagation();
    setTimeout(function () { }, 1500);
}

function filterChanged(e) {
    if (e.currentTarget.checked) {
        updateTableSettings(e.currentTarget);
        tweetsTableContainer = document.getElementById("tweetsTable")
        tweetsTableContainer.setAttribute('disabled', 'disabled');
        tweetsTable = document.getElementById("extractedTweets");
    }
}


function tblClicked(e) {
    var selectedTable = e;
    var selectedColumn = e.target;
    var selectedRow = e.target.parentNode;
    var selectedRegion = e.target.parentNode.parentNode.nodeName;

    switch (selectedRegion) {
        case 'THEAD':
            // TODO : switch sort order
            break;
        case 'TBODY':
            if (selectedRow.className == 'selected') {
                selectedRow.className = ''
            } else {
                selectedRow.className = 'selected';
            }
    }
}

function deleteSelectedRows(e) {
    if (tweetsTableContainer == null) {
        alert("No items selected");
    } else {
        var selectedItems = getSelectedItems;
        if (deleteSelectedTweets(activeUser.id, selectedItems)) {
            updateTable(tweetsTable);
        }
    }
}

function deleteAllTweets(e) {
    if (deleteUserTweets(activeUser.id)) {
        updateTable(tweetsTable);
    }
}

function getSelectedItems() {
    var selectedTable = e;
    var selectedRows = selectedTable.getElementsByTagName('tr').getElementsByClassName('selected');
    var selectedItems = [];
    for (i = 0; i < selectedRows.length; i++) {
        selectedItems = selectedRows[i];
    }

    return selectedItems;
}

// _____________________________________________________
// event handler 
document.forms..getElementById('updateView').addEventListener('submit', viewUpdateRequested, false);
//document.forms.tweetAuthor.getElementById('deleteSelectedRows').addEventListener('submit', deleteSelectedTweets, false);
//document.forms.tweetAuthor.getElementById('deleteAll').addEventListener('submit', deleteAllTweets, false);

//document.getElementById("extractedTweets").addEventListener("click", tblClicked, false);

(function () {
    var options = document.forms.tweetAuthor.elements.filter;
    var option;
    for (var i = [0]; i < options.length; i++) {
        option = options[i];
        option.addEventListener('click', filterChanged, false);
    }

/*    var btnUpdate = document.forms.tweetAuthor.elements.updateView;
    btnUpdate.addEventListener('submit', viewUpdateRequested, false);
    var btnDelSome = document.forms.tweetAuthor.elements.deleteSelectedRows;
    btnDelSome.addEventListener('submit', deleteSelectedRows, false);
    var btnDelAll = document.forms.tweetAuthor.elements.deleteAll;
    btnDelAll.addEventListener('submit', deleteAllTweets, false);
*/} ());
