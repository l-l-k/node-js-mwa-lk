import { inject } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class Signup {
    constructor(userGateway, user, validationController) {
        this.userGateway = userGateway;
        this.user = user;
    }

    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    performSignup() {
        var msg = "Signup  " + this.user.toString();
        console.log(msg);

        // aurelia-validation is much more complex
        this.validationFailed =
            this.user.mail.length == 0 ||
            this.user.name.length == 0 ||
            this.user.password.length == 0;
        if (this.validationFailed) {
            console.log("Input-Validation failed");
            //  alert(msg);
            return;
        }

        // try retrieving user data from storage
        var existingUser = this.userGateway.getByMailAddress(this.user.mailAddress);

        // display hints if registration fails
        this.addressExists = existingUser.mail != null && existingUser.mail.length > 0;
        this.nameExists = existingUser.name != null && existingUser.name.length > 0;

        // register as new user
        if (!addressExists && !nameExists) {
            this.userGateway.add(this.user);
        }
    }
}
