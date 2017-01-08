function tweetTable(dataTable) {
    // Private properties
    var activeTable = dataTable;
    var tableType = "small";
    var selectionRange = [-1, -1];

    // Private methods
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
        var tweetData;
        var user = userRecord;

        for (var rowIndex = 0; rowIndex < tweetsToDisplay.length; rowIndex++) {
            row = document.createElement("tr");
            if (mwaToolkit.isEven(rowIndex)) {
                row.setAttribute("class", "even");
            }

            tweetData = tweetsToDisplay[rowIndex];

            for (var colIndex = indexOfFirstTweetProperty; colIndex < amountOfColumns; colIndex++) {
                col = document.createElement("td");
                switch (colIndex) {
                    case 0:
                        user = storageReader.retrieveUserDataByID(tweetData.userID)
                        content = document.createTextNode(user.username);
                        break;
                    case 1:
                        content = document.createTextNode(tweetData.day);
                        break;
                    case 2:
                        content = document.createTextNode(tweetData.time);
                        break;
                    case 3:
                        content = document.createTextNode(tweetData.message);
                        break;
                    case 4:
                        content = document.createTextNode(tweetData.attachment);
                        break;
                }
                col.appendChild(content);
                row.appendChild(col);
            }

            body.appendChild(row);
        }
        return body;
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
            if (storageWriter.deleteSelectedTweets(userID, selectedItems)) {
                var tweets = storageReader.getSubsetOfTweetsByID(userID);
                updateContent(tweets);
            }
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
            selectedItems.push(tweetCreator.createTweet(userID, day, time, "", ""));
        }

        return selectedItems;
    }

    function updateContent(subsetOfTweets) {
        var header, body;
        var columns = [];

        try {
            activeTable.innerHTML = "";

            if (tableType == "small") {
                columns = ["Day", "Time", "Message", "Attachment"];
                header = createTableHeader(columns);
                body = populateTable(subsetOfTweets, 1, columns.length);
            } else {
                columns = ["Author", "Day", "Time", "Message", "Attachment"];
                header = createTableHeader(columns);
                body = populateTable(subsetOfTweets, 0, columns.length);
            }

            activeTable.appendChild(header);
            activeTable.appendChild(body);

            mwaToolkit.resetSelectionRange();

        } catch (e) {
            var err = e.name + ' ' + e.message;
            alert(err);
            success = false;

        } finally {

        }
    }


    // ___________________________________________________________
    // Public methods

    var tableObject = {

        setTableType: function (typeOfTable) {
            tableType = typeOfTable;
        },

        updateTable: function (subsetOfTweets) {
            updateContent(subsetOfTweets);
        },

        findTweets: function (e) {
            var activeTable = e.currentTarget;
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
                    selectedRows = getSelectedRows(activeTable);

                    if (selectionRange[0] < 0) {
                        if (selectedRows.length > 0) {
                            deselectAll();
                        }
                        currentRow.classList.toggle('selected');
                        selectionRange[0] = currentRow.rowIndex; // startIndex
                    } else {
                        switch (true) {
                            case (e.ctrlKey):
                                // append row to selection list
                                if (e.ctrlKey) {
                                    currentRow.classList.toggle('selected');
                                }
                                break;

                            case ((e.shiftKey) && (startIndex >= 0)):
                                // create selection list as region
                                if ((e.shiftKey) && (startIndex >= 0)) {
                                    if (currentRow.rowIndex == startIndex) {
                                        currentRow.classList.toggle('selected');
                                    } else {
                                        selectionRange[1] = currentRow.rowIndex;
                                        var region = activeTable.getElementsByTagName("TBODY")[0];
                                        var allRows = region.getElementsByTagName("tr");
                                        selectFromTo(selectionRange, allRows);
                                    }
                                    mwaToolkit.resetSelectionRange();
                                }
                                break;
                            case (true):
                                // refuse existing selection list, start a new one
                                if (selectedRows.length > 0) {
                                    deselectAll();
                                    mwaToolkit.resetSelectionRange();
                                }
                                currentRow.classList.toggle('selected');
                                selectionRange[0] = currentRow.rowIndex; // startIndex
                                break;
                        }
                    }
            }
        },

        deleteAllTweets: function (userID) {
            if (storageWriter.deleteUserTweets(userID)) {
                var tweets = storageReader.getSubsetOfTweetsByID(userID);
                updateContent(tweets);
            }
        },

        deleteSelectedTweets: function (userID) {
            //deleteSelectedRows(userID);

            if (activeTable == null) {
                alert("No items selected");
                return;
            }
            var selectedRows = getSelectedRows(activeTable);
            if (selectedRows.length == 0) {
                alert("No items selected");
                return;
            }

            var selectedItems = getSelectedItems(selectedRows, userID);
            if (storageWriter.deleteSelectedTweets(userID, selectedItems)) {
                var tweets = storageReader.getSubsetOfTweetsByID(userID);
                updateContent(tweets);
            }
        }
    };
    return tableObject;

}