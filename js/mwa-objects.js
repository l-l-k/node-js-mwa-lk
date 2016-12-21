// userdata generated by input-forms
function temporaryUserData(email, password, name) {
    this.mailAddress = email.trim;
    this.password = password.trim;
    this.username = name.trim;
}

// active user or any db-record
function userRecord(email, password, name, id) {
    this.mailAddress = email.trim;
    this.password = password.trim;
    this.username = name.trim;
    if (id == null || id == "") {
        this.id = createGuid();
    } else {
        this.id = id;
    }
}

function currentUser(userID, isAdmin) {
    this.id = userID;
    this.isAdmin = isAdmin;
}

function tweetRecord(userID, message, picture) {
    this.userID = userID;
    this.day = getDay();
    this.time = getTime();
    this.message = message;
    this.attachment = picture;
}

function messageRow(username, day, time, message, picture) {
    this.user = username;
    this.day = day;
    this.time = time;
    this.message = message;
    this.attachment = picture;
}
