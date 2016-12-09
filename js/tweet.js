var fileSelectorProxy, fileSelector;
var uploadCommand;

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
    } else {
        removeImage();
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


function removeImage() {
    var preview = document.getElementById('attachedImage');
    preview.innerHTML = '';
    preview.className = 'hidden';
}

// ______________________________________________________
// Uplod Data - text, image and meta data
function uploadTweet() {

}


// ______________________________________________________
// Event Handler

uploadCommand = document.getElementById('send');
uploadCommand.addEventListener('submit', uploadTweet, false);

fileSelectorProxy = document.getElementById('camera');
fileSelectorProxy.addEventListener('click', selectFile, false);

fileSelector = document.getElementById('addPicture');
fileSelector.addEventListener('change', evaluateFileDialog, false);
