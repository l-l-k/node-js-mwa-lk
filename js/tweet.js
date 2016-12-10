var fileSelectorProxy, fileSelector;
var uploadCommandProxy, uploadCommand;
var wasteBasket;

// ______________________________________________________
// Image related to current tweet
function selectFile(e) {
    var openFileDialog = document.getElementById('addPicture');
    if (openFileDialog) {
        openFileDialog.click();
    }
    e.preventDefault(); // prevent navigation to "#"
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

function getUserID() {
    var id;

    return id;
}

function uploadTweet(e) {
    var activeForm = document.forms.defineTweet;
    var msg = activeForm.elements.message
    var img = document.getElementById('preview');
    console.log(msg.value);
    console.log(img.currentSrc.substring(0, 10));

    var now = new date();
    var record = {
        id: getUserID,
        day: now.getFullYear + "-" + now.getMonth + "-" + now.getDate,
        time: now.getFullYear + "-" + now.getMonth + "-" + now.getDate,,
        msg: activeForm.elements.message.value,
        img: img.currentSrc
    }
    console.log(msg.value);
    console.log(img.currentSrc.substring(0, 10));

}


// ______________________________________________________
// Event Handler

// submit by image-click
uploadCommand = document.getElementById('sendMsg');
uploadCommand.addEventListener('click', uploadTweet, false);

// add a picture
fileSelectorProxy = document.getElementById('camera');
fileSelectorProxy.addEventListener('click', selectFile, false);

fileSelector = document.getElementById('addPicture');
fileSelector.addEventListener('change', evaluateFileDialog, false);

// detach a picture
wasteBasket = document.getElementById('detach');
wasteBasket.addEventListener('click', detachImage, false);

