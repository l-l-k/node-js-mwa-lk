var activeTable;
var activeFilter;
var tableUpdateRequested = false;
var tableType = "small";
var selectionRange = [-1, -1];

function updateTable(existingTable, subsetOfTweets) {
    var header, body;
    var columns = [];

    try {
        existingTable.innerHTML = "";

        if (tableType == "small") {
            columns = ["Day", "Time", "Message", "Attachment"];
            header = createTableHeader(columns);
            body = populateTable(subsetOfTweets, 1, columns.length);
        } else {
            columns = ["Author", "Day", "Time", "Message", "Attachment"];
            header = createTableHeader(columns);
            body = populateTable(subsetOfTweets, 0, columns.length);
        }

        existingTable.appendChild(header);
        existingTable.appendChild(body);

        resetSelectionRange;
        tableUpdateRequested = false;

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

function tblClicked(e) {
    var selectedTable = e.currentTarget;
    var selectedColumn = e.target;
    var currentRow = e.target.parentNode;
    var nameOfRegion = e.target.parentNode.parentNode.nodeName;
    var selectedRows = [];
    var startIndex = selectionRange[0];

    switch (nameOfRegion) {
        case 'THEAD':
            // TODO : switch sort order
            break;
        case 'TBODY':
            // highlight selected rows
            selectedRows = getSelectedRows(selectedTable);

            if (selectionRange[0] <0) {
           if (selectedRows.length > 0) { 
               deselectAll();
           }
                currentRow.classList.toggle('selected');
                selectionRange[0] = currentRow.rowIndex; // startIndex
            } else {
                // append row to selection list
                if (e.ctrlKey) {
                    currentRow.classList.toggle('selected');
                }
                // create selection list as region
                if ((e.shiftKey) && (startIndex >= 0)) {
                    if (currentRow.rowIndex == startIndex) {
                        currentRow.classList.toggle('selected');
                    } else {
                        selectionRange[1] = currentRow.rowIndex;
                        var region = selectedTable.getElementsByTagName("TBODY")[0];
                        var allRows = region.getElementsByTagName("tr");
                        selectFromTo(selectionRange, allRows);
                    }
                    resetSelectionRange();
                }
            }
    }
}

function selectFromTo(range, rows) {
    var firstIndex = range[0] - 1;
    var lastIndex = range[1] - 1;

    if (firstIndex > lastIndex) {
        firstIndex = range[1] - 1;
        lastIndex = range[0] - 1;
    }

    for (i = 0; i < rows.length; i++) {
        switch (true) {
            case (i < firstIndex):
                rows[i].classList.toggle('selected', false);
                break;
            case (i > lastIndex):
                rows[i].classList.toggle('selected', false);
                break;
            default:
                rows[i].classList.toggle('selected', true);
                break;
        }
    }
}

function deselectAll() {
    var region = activeTable.getElementsByTagName("TBODY")[0];
    var rows = region.getElementsByTagName("tr");

    for (i = 0; i < rows.length; i++) {
        rows[i].classList.toggle('selected', false);
    }
}

function deleteSelectedRows(userID) {
    if (activeTable == null) {
        alert("No items selected");
    } else {
        var selectedRows = getSelectedRows(activeTable);
        var selectedItems = getSelectedItems(selectedRows, userID);
        if (deleteSelectedTweets(userID, selectedItems)) {
            var tweets = getSubsetOfTweetsByID(userID);
            updateTable(activeTable, tweets);
        }
    }
}

function deleteAllTweets(userID) {
    if (deleteUserTweets(userID)) {
        var tweets = getSubsetOfTweetsByID(userID);
        updateTable(activeTable, tweets);
    }
}

function getSelectedRows(table) {
    var region = table.getElementsByTagName("TBODY")[0];
    var selectedRows = region.getElementsByClassName('selected');
    return selectedRows;
}

function getSelectedItems(selectedRows, userID) {
    var selectedItems = [];
    var dayIndex = 0;
    if (tableType != 'small') {
        dayIndex = 1;
    }
    var timeIndex = dayIndex + 1;
    var day, time;

    for (i = 0; i < selectedRows.length; i++) {
        day = selectedRows[i].children[dayIndex].innerText;
        time = selectedRows[i].children[timeIndex].innerText;
        selectedItems[i] = tweetRecord(userID, day, time, "", "");
    }

    return selectedItems;
}

