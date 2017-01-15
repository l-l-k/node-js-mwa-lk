var dbTools = require("./serverToolkit.js");

module.exports = {
    // active user or any db-record
    userRecord: function (email, password, name, id) {
        this.mailAddress = email.trim();
        this.password = password.trim();
        this.username = name.trim();
        if (id == null || id == "") {
            this.id = dbTools.createGuid();
        } else {
            this.id = id;
        }
    },

    vipRecord: function (id, name, checked) {
        this.id = id;
        this.username = name.trim();
        if (checked == null) {
            this.checked = false;
        } else if ((checked == "checked") || (checked == true)) {
            this.checked = true;
        } else {
            this.checked = checked;
        }
    },

    tweetRecord: function (userID, day, time, message, picture) {
        this.userID = userID.trim();
        this.day = day;
        this.time = time;
        this.message = message.trim();
        this.attachment = picture.trim();
    }

}