
/* Global Objects */
var mwaToolkit = mwaToolkit();
var storageReader = localStorageReader();
var storageWriter = localStorageWriter();

var tweetCreator = tweetCreation();
var tweetViewer = tweetView();

// navigation to admin-tools
var adminLink = document.getElementById('adminLink');
// adminLink.className = 'hidden';

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

    storageReader.updateUsers();
    storageReader.updateTweets();
    
    tweetViewer.populateVipList();
} ());


