function tweetCreation() {
    // Private properties
    var tweetsTable = document.getElementById("extractedTweets");
    var tweetTbl = new tweetTable(tweetsTable);
    var tableUpdateRequested = false;

    // Private methods
    function addImage(selectedFile) {
        // load data asynchronously
        var reader = new FileReader();
        reader.onload = (function (selectedImage) {
            return function (e) {
                // create preview.
                var img = document.getElementById('preview');
                img.className = 'preview';
                img.src = e.target.result;
                img.title = selectedImage.name;
                // insert preview
                var preview = document.getElementById('attachedImage');
                preview.className = "preview";
                preview.insertBefore(img, null);
            };
        })(selectedFile);

        reader.readAsDataURL(selectedFile);
    }

    // Private objects
    function tweetRecord(userID, day, time, message, picture) {
        this.userID = userID;
        this.day = day;
        this.time = time;
        this.message = message;
        this.attachment = picture;
    }

    // ______________________________________________________
    // Public methods
    var tweetCreationObject = {

        createTweet: function (userID, day, time, message, picture) {
            return new tweetRecord(userID, day, time, message, picture);
        },

        // Event Handler
        // Image related to current tweet
        selectFile: function (e) {
            var openFileDialog = document.getElementById('addPicture');
            if (openFileDialog) {
                openFileDialog.click();
            }
            e.preventDefault(); // prevent reload
        },

        evaluateFileDialog: function (e) {
            var selectedFiles = e.target.files;
            if (selectedFiles.length > 0) {
                addImage(selectedFiles[0]);
            }
        },

        detachImage: function () {
            var preview = document.getElementById('attachedImage');
            preview.innerHTML = '';
            preview.className = 'hidden';
        },

        // ______________________________________________________
        // Uplod Data - text, image and meta data

        publishTweet: function (e) {
            var msg = document.forms.defineTweet.elements.message.value.trim();
            var img = document.getElementById('preview');
            console.log(msg.value);
            console.log(img.currentSrc.substring(0, 10));

            var newTweet = new tweetRecord(
                activeUser.id,
                mwaToolkit.getDay(),
                mwaToolkit.getTime(),
                msg,
                img.currentSrc
            );

            if (storageWriter.uploadTweet(newTweet)) {
                // TODO : update timeline if user is listed in current timeline
                tableUpdateRequested = true;
                // Update timeline
                if (tableUpdateRequested) {
                    var tweets = storageReader.getSubsetOfTweetsByID(tweetFilter);
                    tweetTbl.updateTable( tweets);
                    tableUpdateRequested = false;
                }
            } else {
                alert("Publishing tweet failed. Please try again.");
            }
        }

    };
    return tweetCreationObject;

}

// ______________________________________________________
// Event Handler

(function () {
    var tweetCreator = new tweetCreation();

    // submit by image-click
    var uploadCommand = document.getElementById('sendMsg');
    uploadCommand.addEventListener('click', tweetCreator.publishTweet, false);

    // add a picture
    var fileSelectorProxy = document.getElementById('camera');
    fileSelectorProxy.addEventListener('click', tweetCreator.selectFile, false);

    var fileSelector = document.getElementById('addPicture');
    fileSelector.addEventListener('change', tweetCreator.evaluateFileDialog, false);

    // detach a picture
    var wasteBasket = document.getElementById('detach');
    wasteBasket.addEventListener('click', tweetCreator.detachImage, false);

} ());
