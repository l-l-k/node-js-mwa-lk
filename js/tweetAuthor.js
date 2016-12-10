var tweetFilter = document.forms.tweetAuthor;
var anyUser = document.forms.tweetAuthor.elements.author;
var filter;

function getFilter(e) {

    switch (options) {
        case 1:
            break;
    }

}

function filterChanged(e) {
    console.log(e.value);
    if (this.checked) {
        var msg;
        switch (this.value) {
            case "me":
                filter = "me";
                msg = "Me (" + filter + ")";
                break;

            case "other":
                filter = document.forms.tweetAuthor.elements.author;
                msg = filter.value;
                break;

            case "all":
                filter = "*";
                msg = "all members";
                break;
        }
        var submitBtn = document.forms.tweetAuthor.elements.updateView;
        submitBtn.value = "Show tweets of " + msg;
    }
}

// _____________________________________________________
// event handler 
tweetFilter.addEventListener('submit', getFilter, false);

anyUser.addEventListener('blur', filterChanged, false);

(function () {
    var options = document.forms.tweetAuthor.elements.filter;
    var option;
    for (var i = [0]; i < options.length; i++) {
        option = options[i];
        option.addEventListener('click', filterChanged, false);
    }
} ());

/*
options[0].addEventListener('click', filterChanged, false);
options[1].addEventListener('click', setFilter, false);
options[2].addEventListener('click', setFilter, false);
*/