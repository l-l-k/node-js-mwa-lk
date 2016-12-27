var tweetFilter;
var tableType = "small";
var updatingTweetHistoryRequested = false;
var visibleTweets = new Array();
var tweetsTableContainer, tweetsTable;
var currentRows;

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

function updateView() {
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
    tweetsTableContainer.disabled = true;

    // add new content
    updateTable(tweetsTable);
    // tweetsTable.parentNode.insertBefore(updateTable(), tweetsTable);
    tweetsTableContainer.disabled = false;
    tweetsTable.addEventListener('click', tblClicked, false);

    updatingTweetHistoryRequested = false;
}

function filterChanged(e) {
    if (e.currentTarget.checked) {
        updateTableSettings(e.currentTarget);
        tweetsTableContainer = document.getElementById("tweetsTable")
        tweetsTable = document.getElementById("extractedTweets");
    }
}


function tblClicked(e) {
    var selectedTable = e.currentTarget;
    var selectedColumn = e.target;
    var currentRow = e.target.parentNode;
    var nameOfRegion =  e.target.parentNode.parentNode.nodeName;
    var selectedRegion;
    var selectedRows = [];
    var startIndex = -1;
    var indexes = [0, 0];

    switch (nameOfRegion) {
        case 'THEAD':
            selectedRegion = selectedTable.children[0];
            // TODO : switch sort order
            break;
        case 'TBODY':
            selectedRegion = selectedTable.children[1];
            selectedRows = selectedRegion.getElementsByClassName('selected');

            if (selectedRows.length == 0) {
                currentRow.classList.toggle('selected');
                startIndex = currentRow.rowIndex;
            } else {
                if (e.ctrlKey) {
                    currentRow.classList.toggle('selected');
                }
                if ((event.shiftKey) && (startIndex >= 0)) {
                    endIndex = currentRow.rowIndex;
                    if (currentRow.rowIndex > startIndex) {
                        indexes[0] = startIndex;
                        indexes[1] = currentRow.rowIndex;
                    } else if (currentRow.rowIndex < startIndex) {
                        indexes[0] = currentRow.rowIndex;
                        indexes[1] = startIndex;
                    } else {
                        currentRow.classList.toggle('selected');
                    }
                }
            }
    }
}

function deleteCurrentRows() {
    if (tweetsTableContainer == null) {
        alert("No items selected");
    } else {
        var selectedItems = getSelectedItems;
        if (deleteSelectedTweets(activeUser.id, selectedItems)) {
            updateTable(tweetsTable);
        }
    }
}

function deleteAllTweets() {
    if (deleteUserTweets(activeUser.id)) {
        updateTable(tweetsTable);
    }
}

function getSelectedItems() {
    var selectedTable = e;
    var currentRows = selectedTable.getElementsByTagName('tr').getElementsByClassName('selected');
    var selectedItems = [];
    for (i = 0; i < currentRows.length; i++) {
        selectedItems = currentRows[i];
    }

    return selectedItems;
}

function historyButtonClicked(e) {
    var clickedButton = e.explicitOriginalTarget
    switch (clickedButton.id) {
        case 'updateView':
            updateView();
            break;

        case 'deletecurrentRows':
            deleteCurrentRows();
            break;

        case 'deleteAll':
            deleteAllTweets();
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
    var options = document.forms.tweetAuthor.elements.filter;
    var option;
    for (var i = [0]; i < options.length; i++) {
        option = options[i];
        option.addEventListener('click', filterChanged, false);
    }

    var frm = document.forms.tweetAuthor
    frm.addEventListener('submit', historyButtonClicked, false);

} ());
