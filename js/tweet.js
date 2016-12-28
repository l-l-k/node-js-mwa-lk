// ______________________________________________________
// Image related to current tweet
function selectFile(e) {
    var openFileDialog = document.getElementById('addPicture');
    if (openFileDialog) {
        openFileDialog.click();
    }
    e.preventDefault(); // prevent reload
}

function evaluateFileDialog(e) {
    var selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
        addImage(selectedFiles[0]);
    }
}

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


function detachImage() {
    var preview = document.getElementById('attachedImage');
    preview.innerHTML = '';
    preview.className = 'hidden';
}

// ______________________________________________________
// Uplod Data - text, image and meta data

function publishTweet(e) {
    var msg = document.forms.defineTweet.elements.message.value.trim();
    var img = document.getElementById('preview');
    console.log(msg.value);
    console.log(img.currentSrc.substring(0, 10));

    var newTweet = tweetRecord(
        activeUser.id,
        getDay(),
        getTime(),
        msg,
        img.currentSrc
    );

    if (uploadTweet(newTweet)) {
        // TODO : update timeline if user is listed in current timeline
        tableUpdateRequested = true;
    } else {
        alert("Publishing tweet failed. Please try again.");
    }
}


// ______________________________________________________
// Event Handler

(function () {

    // submit by image-click
    var uploadCommand = document.getElementById('sendMsg');
    uploadCommand.addEventListener('click', publishTweet, false);

    // add a picture
    var fileSelectorProxy = document.getElementById('camera');
    fileSelectorProxy.addEventListener('click', selectFile, false);

    var fileSelector = document.getElementById('addPicture');
    fileSelector.addEventListener('change', evaluateFileDialog, false);

    // detach a picture
    var wasteBasket = document.getElementById('detach');
    wasteBasket.addEventListener('click', detachImage, false);


} ());
