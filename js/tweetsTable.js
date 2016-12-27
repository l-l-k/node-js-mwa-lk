var tweetFilter;
var tableType = "small";
var updatingTweetHistoryRequested = false;
var visibleTweets = new Array();
var tweetsTableContainer, tweetsTable;
var selectionRange = [-1, -1];
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

        resetSelectionRange;

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
                selectedFilterOption = options[i];
                updateTableSettings(selectedFilterOption);
                tweetsTableContainer = document.getElementById("tweetsTable")
                tweetsTable = document.getElementById("extractedTweets")
                break;
            }
        }
    }

    if (selectedFilterOption.value=="other") {
        // regard changed user-id
        updateTableSettings(selectedFilterOption); 
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
        selectedFilterOption = e.currentTarget;
        updateTableSettings(selectedFilterOption);
        tweetsTableContainer = document.getElementById("tweetsTable")
        tweetsTable = document.getElementById("extractedTweets");
    }
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

            if (selectedRows.length == 0) {
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
                }
            }
    }
}

function deleteCurrentRows() {
    if ((tweetsTableContainer == null) || (tweetsTable == null)) {
        alert("No items selected");
    } else {
        var selectedRows = getSelectedRows(tweetsTable);
        var selectedItems = getSelectedItems(selectedRows);
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

function getSelectedRows(table) {
    var region = table.getElementsByTagName("TBODY")[0];
    var selectedRows = region.getElementsByClassName('selected');
    return selectedRows;
}

function getSelectedItems(selectedRows) {
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
        selectedItems[i] = tweetRecord(activeUser.id, day, time, "", "");
    }

    return selectedItems;
}

function selectFromTo(range, rows) {
    var firstIndex = range[0] - 1;
    var lastIndex = range[1] - 1;

    if (firstIndex > lastIndex) {
        firstIndex = range[1] - 1;
        lastIndex = range[0] - 1;
    }

    for (i = firstIndex; i <= lastIndex; i++) {
        rows[i].classList.toggle('selected', true);
    }
}

function deselectAll() {
    var region = tweetsTable.getElementsByTagName("TBODY")[0];
    var allRows = region.getElementsByTagName("tr");

    for (i = 0; i < allRows.length; i++) {
        rows[i].classList.toggle('selected', false);
    }
}

function historyButtonClicked(e) {
    var clickedButton = e.explicitOriginalTarget
    switch (clickedButton.id) {
        case 'updateView':
            updateView();
            break;

        case 'deleteSelectedRows':
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
