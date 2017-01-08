function textLengthObserver(limit) {
    var me=this;
    var limit = limit;

    var observerObject = {
        maxTextLength: function() {
            return limit;
        },

        updateCounter: function (e) {
            var hint = document.getElementById('charCounter');
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
        },

        hideCounter: function (e) {
            var hint = document.getElementById('charCounter');
            var txtField = e.target || e.srcElement;
            var count = txtField.value.length;
            if (count <= limit) {
                hint.className = 'hidden';
            }
        }
    };
    return observerObject;
};

// _____________________________________________________
// event handler 

(function () {
    var observer = new textLengthObserver(140);  // of <textarea> element
    var msg = document.getElementById('message');

    msg.addEventListener('focus', observer.updateCounter, false);
    msg.addEventListener('input', observer.updateCounter, false);

    msg.addEventListener('blur', observer.hideCounter, false);
} ());
