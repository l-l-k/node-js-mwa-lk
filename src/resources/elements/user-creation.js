import { inject, NewInstance } from 'aurelia-framework';
import { UserGateway } from './../../services/user-gateway';
import { User } from './../../models/user';

@inject(UserGateway)
export class UserCreation {
    constructor(userGateway) {
        this.userGateway = userGateway;
        this.newUser = NewInstance.of(User);
   }

    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    addUser() {
        var msg = "Add user  " + newUser.user.toString();
        console.log(msg);

        // aurelia-validation is much more complex
        this.validationFailed =
            this.newUser.mail.length == 0 ||
        this.newUser.name.length == 0 ||
        this.newUser.password.length == 0;
        if (this.validationFailed) {
            console.log("Input-Validation failed");
            //  alert(msg);
            return;
        }

        // try retrieving user data from storage
        var existingUser = this.userGateway.getByMailAddress(this.newUser.mail);

        // display hints if registration fails
        this.addressExists = existingUser.mail != null && existingUser.mail.length > 0;
        this.nameExists = existingUser.name != null && existingUser.name.length > 0;

        // register as new user
        if (!addressExists && !nameExists) {
            return this.userGateway.add(this.newUser);
        }
    }
}
