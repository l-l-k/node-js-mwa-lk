function setVisibilityOfCard() {
    var vcard = document.getElementById("vcard");
    if (vcard.className == 'hidden') {
        vcard.className = 'notHidden';
    } else {
        vcard.className = 'hidden';
    }
}

var card = document.getElementById("hcard");
card.onclick = setVisibilityOfCard;
