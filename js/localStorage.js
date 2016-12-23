// store and restor users

var admins = new Array();
var adminsKey = "mwa-admins";
var knownUsers = new Array();
var knownUsersKey = "mwa-knownUsers";
var lastUser;
var lastUserKey = "mwa-lastUser";
var currentMessage;
var currentMessageKey = "mwa-currentMessage";
var lastDisplayedMessages = new Array();
var lastDisplayedMessagesKey = "mwa-Messages";

window.onload = invokeLocalStorage;

function invokeLocalStorage() {
    admins = JSON.parse(localStorage.getItem(adminsKey));
    knownUsers = JSON.parse(localStorage.getItem(knownUsersKey));
    lastUser = JSON.parse(localStorage.getItem(lastUserKey));
    // restoreTweets;
}


(function () {
    var admin = new userRecord("leo@regensburg.oth", "l", "Admin Leo l","0");
    var admins = [admin.id];
    localStorage.setItem(adminsKey, JSON.stringify(admins));

    var users = [];
    users.push(admin);
    users.push(new userRecord("anton@post.de", "a", "Testuser Anton","1"));
    users.push(new userRecord("otto@post.de", "o", "Testuser Otto","2"));
    users.push(new userRecord("fred@post.de", "f", "Testuser Fred","3"));
    users.push(new userRecord("sepp@post.de", "s", "Testuser Sepp","4"));
    localStorage.setItem(knownUsersKey, JSON.stringify(users));

    var lastUser = users[2];
    localStorage.setItem(lastUserKey, JSON.stringify(lastUser));

    var currentMessage = new tweetRecord(lastUser.id, "Eins ist mehr als zwei", "");
    localStorage.setItem(currentMessageKey, JSON.stringify(currentMessage));
} ());
