var dbWriter = (function () {

function appendUser(temporaryUser) {
    var newUser = new userRecord(temporaryUser.email, temporaryUser.password, temporaryUser.name);
    // TODO : append user to storage

}

function updateUser(temporaryUser) {
    var settings = userRecord();
     // TODO : retrieve userdata by ID
   currentUser.id
    // TODO : update settings of current user
}

})();
