import { inject, NewInstance } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class X {
    constructor(userGateway, user) {
        this.userGateway = userGateway;
        this.user = user;
        this.newUser = new User();  
        this.newUser.mail = "";
        this.newUser.nickname = "";
        this.newUser.password = "";
    }

    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    performSignup() {
        var msg = "Signup  " + newUser.user.toString();
        console.log(msg);

        // aurelia-validation is much more complex
        this.validationFailed =
            this.newUser.mail.length == 0 ||
            this.newUser.nickname.length == 0 ||
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
        this.nameExists = existingUser.nickname != null && existingUser.nickname.length > 0;

        // register as new user
        if (!addressExists && !nameExists) {
            this.userGateway.add(this.newUser);
        }
    }
}
