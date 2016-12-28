function processAdminStatistics(e) {
    var datum = "";
    var datum = activeForm.elements.startDate.value.split("-");
    var firstDay = new Date(datum[0], datum[1], datum[2]);

    var datum = activeForm.elements.endDate.value.split("-");
    var lastDay = new Date(datum[0], datum[1], datum[2]);

    var statTable = document.getElementById("admStatisticsTable");

    updateStatAdmTable(statTable, firstDay, lastDay);
    statTable.className = 'notHidden';

}

function updateStatAdmTable(existingTable, startDate, endDate) {
    var caption = "";
    existingTable.innerHTML = "";
    var results = evaluateAdmPeriod(startDate, endDate);

    createStatAdmTable(existingTable, results);
}

function createStatAdmTable(existingTable, results) {
    var header, body, foot;
    var columns = ["User", "Tweets"];

    try {
        header = createTableHeader(columns);
        body = populateStatAdmTable(results, columns.length);
        foot = createStatAdmTableFoot(results, columns);

        existingTable.appendChild(header);
        existingTable.appendChild(body);
        existingTable.appendChild(foot);

    } catch (e) {
        var err = e.name + ' ' + e.message;
        alert(err);
        success = false;

    } finally {

    }
}

function populateStatAdmTable(recordsToDisplay, amountOfColumns) {
    var body = document.createElement("tbody");
    var row, col, content;
    var statRecord;

    for (var rowIndex = 0; rowIndex < recordsToDisplay.length; rowIndex++) {
        row = document.createElement("tr");
        if (isEven(rowIndex)) {
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

function createStatAdmTableFoot(results, columns) {
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

function evaluateAdmPeriod(startDate, endDate) {
    var results = [];
    var users = [];
    var tweets = getTweetsInPeriod(startDate, endDate);
    var tweet = tweetRecord;
    var user = userRecord;
    var item = admQueryItem;
    var userID = "";

    for (var i = [0]; i < tweets.length; i++) {
        userID = tweets[i].userID;
        // if (users.indexOf(userID) < 0) {
        if (users[userID] == null) {
            user = retrieveUserDataByID(userID);
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

function admQueryItem(name) {
    this.name = name;
    this.amount = 1;
}

function closeAdmStatView() {
    var statTable = document.getElementById("admStatisticsTable");
    statTable.innerHTML = '';
    statTable.className = 'hidden';
}

// Event handler
//=============================================================

(function () {
    document.forms.statistics.addEventListener('submit', processAdminStatistics, false);

    var wasteBasket = document.getElementById('closeAdmStatView');
    wasteBasket.addEventListener('click', closeAdmStatView, false);
} ());
