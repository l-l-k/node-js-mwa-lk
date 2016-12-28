
var maxTextLength = 140;

function updateCounter(e) {
    var hint = document.getElementById('charCounter');
    var txtField = e.target || e.srcElement;
    var count = maxTextLength - txtField.value.length;
    if (count < 0) {
        hint.className = 'error';
    } else if (count < 11) {
        hint.className = 'warn';
    } else {
        hint.className = 'good';
    }
    var txt = 'There are ' + '<b>' + count + '</b>' + ' characters left';
    hint.innerHTML = txt;
}

function hideCounter(e) {
    var hint = document.getElementById('charCounter');
    var txtField = e.target || e.srcElement;
    var count = txtField.value.length;
    if (count <= maxTextLength) {
        hint.className = 'hidden';
    }
}

// _____________________________________________________
// event handler 

(function () {
    // <textarea> element
    var msg = document.getElementById('message'); 

    msg.addEventListener('focus', updateCounter, false);
    msg.addEventListener('input', updateCounter, false);

    msg.addEventListener('blur', hideCounter, false);
} ());
