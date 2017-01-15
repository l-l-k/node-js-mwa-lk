
/* Global Objects */
var mwaToolset = mwaToolkit();
var pg = pg;
var storageReader = readDB();//localStorageReader();
var storageWriter = writeDB();

var tweetCreator = tweetCreation();
var tweetViewer = tweetView();

// navigation to admin-tools
var adminLink = document.getElementById('adminLink');
adminLink.className = 'hidden';

//=============================================================

function resetUI() {
    // Hide Sections
    for (i = 0; i < sections.length; i++) {
        sections[i].className = 'hidden';
    };

    // Hide all fieldsets 
    for (i = 0; i < fieldsets.length; i++) {
        fieldsets[i].className = 'hidden';
    };
}

(function () {
    var lsInitiator = new localStorageInitialisation();
    lsInitiator.initialise();

    resetUI();
    
    tweetViewer.populateVipList();
} ());