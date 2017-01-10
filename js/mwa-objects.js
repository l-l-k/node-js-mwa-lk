var mwa = {};

/* Global Variables */
var admins = new Array();
var knownUsers = new Array();
var lastDisplayedMessages = new Array();
var availableTweets = new Array();
var currentTweet;
var lastUser = userRecord;
var tweetFilter="";

// global variables for navigation and activation

var sections = [];
sections.push(document.getElementById('account'));
sections.push(document.getElementById('tweets'));
sections.push(document.getElementById('administration'));

var activeFieldset;
var fieldsets = [];
fieldsets.push(document.getElementById('signup'));
fieldsets.push(document.getElementById('login'));
fieldsets.push(document.getElementById('userdata'));
fieldsets.push(document.getElementById('addUser'));
fieldsets.push(document.getElementById('removeUser'));
fieldsets.push(document.getElementById('cleanupTweets'));
fieldsets.push(document.getElementById('statistics'));

// global data objects

var activeUser = function () {
    this.id = "dummy";
    this.isAdmin = false;
};
var currentUser =  function () {
    this.id = "";
    this.isAdmin = false;
};

// active user or any db-record
function userRecord(email, password, name, id) {
    this.mailAddress = email.trim();
    this.password = password.trim();
    this.username = name.trim();
    if (id == null || id == "") {
        this.id = mwaToolkit.createGuid();
    } else {
        this.id = id;
    }
}

function tweetRecord(userID, day, time, message, picture) {
    this.userID = userID;
    this.day = day;
    this.time = time;
    this.message = message;
    this.attachment = picture;
}

