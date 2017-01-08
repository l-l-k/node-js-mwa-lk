var AdminStatistics = (function () {
    // Private properties
    var activeForm = document.forms.statistics;
    var activeTable = document.getElementById("admStatisticsTable");

    // =================================================== 
    // Private methods

    function updateTable(startDate, endDate) {
        var caption = "";
        activeTable.innerHTML = "";
        var results = evaluatePeriod(startDate, endDate);

        createTable(results);
    }

    function createTable(results) {
        var header, body, foot;
        var columns = ["User", "Tweets"];

        try {
            header = createTableHeader(columns);
            body = populateTable(results, columns.length);
            foot = createTableFoot(results, columns);

            activeTable.appendChild(header);
            activeTable.appendChild(body);
            activeTable.appendChild(foot);

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

    function populateTable(recordsToDisplay, amountOfColumns) {
        var body = document.createElement("tbody");
        var row, col, content;
        var statRecord;

        for (var rowIndex = 0; rowIndex < recordsToDisplay.length; rowIndex++) {
            row = document.createElement("tr");
            if (mwaToolkit.isEven(rowIndex)) {
                row.setAttribute("class", "even");
            }

            statRecord = recordsToDisplay[rowIndex];

            for (var colIndex = 0; colIndex < amountOfColumns; colIndex++) {
                col = document.createElement("td");
                switch (colIndex) {
                    case 0:
                        content = document.createTextNode(statRecord.name);
                        break;
                    case 1:
                        content = document.createTextNode(statRecord.amount);
                        break;
                }
                col.appendChild(content);
                row.appendChild(col);
            }

            body.appendChild(row);
        }
        return body;
    }

    function createTableFoot(results, columns) {
        var foot = document.createElement("tfoot");
        var row = document.createElement("tr");
        var col, content;
        var item = admQueryItem;
        var sum = 0;

        for (var rowIndex = 0; rowIndex < results.length; rowIndex++) {
            item = results[rowIndex];
            sum += item.amount;
        }

        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            col = document.createElement("td");
            switch (colIndex) {
                case 0:
                    content = document.createTextNode("SUM : ");
                    break;

                case 1:
                    content = document.createTextNode(sum);
                    break;
            }
            col.setAttribute("class", "summary");
            col.appendChild(content);
            row.appendChild(col);
        }

        foot.appendChild(row);
        return foot;
    }

    function evaluatePeriod(startDate, endDate) {
        var results = [];
        var users = [];
        var tweets = storageReader.getTweetsInPeriod(startDate, endDate);
        var user = userRecord;
        var item = admQueryItem;
        var userID = "";

        for (var i = [0]; i < tweets.length; i++) {
            userID = tweets[i].userID;
            // if (users.indexOf(userID) < 0) {
            if (users[userID] == null) {
                user = storageReader.retrieveUserDataByID(userID);
                item = new admQueryItem(user.username);
                users[userID] = item;
            } else {
                users[userID].amount += 1;
            }
        }

        var key;
        for (key in users) {
            results.push(users[key]);
        }

        return results;
    }

    // =================================================== 
    // Private objects
    function admQueryItem(name) {
        this.name = name;
        this.amount = 1;
    }

    // =================================================== 
    // Public methods
    return {
        processStatistics: function (e) {
            var datum = "";
            var datum = activeForm.elements.startDate.value.split("-");
            var firstDay = new Date(datum[0], datum[1], datum[2]);

            var datum = activeForm.elements.endDate.value.split("-");
            var lastDay = new Date(datum[0], datum[1], datum[2]);

            updateTable(firstDay, lastDay);
            activeTable.className = 'notHidden';

            // Don't reload form
            e.preventDefault();
            e.stopPropagation();
            setTimeout(function () { }, 1000);
        },

        closeView: function (e) {
            activeTable.innerHTML = '';
            activeTable.className = 'hidden';

            // Don't reload form
            e.preventDefault();
            e.stopPropagation();
            setTimeout(function () { }, 1000);
        }


    };

})();

// Event handler
//=============================================================

(function () {
    document.forms.statistics.addEventListener('submit', AdminStatistics.processStatistics, false);

    var wasteBasket = document.getElementById('closeAdmStatView');
    wasteBasket.addEventListener('click', AdminStatistics.closeView, false);
} ());
