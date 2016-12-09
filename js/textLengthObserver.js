
var msg; // <textarea> element
var hint= document.getElementById('charCounter');
var limit=140;

function updateCounter(e) {
    var txtField = e.target || e.srcElement;
    var count = limit - txtField.value.length;
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
    var txtField = e.target || e.srcElement;
    var count = txtField.value.length;
    if (count <= limit) {             
      hint.className = 'hidden';             
    }
}

msg = document.getElementById('message');
msg.addEventListener('focus', updateCounter, false);
msg.addEventListener('input', updateCounter, false);

msg.addEventListener('blur', hideCounter, false);
