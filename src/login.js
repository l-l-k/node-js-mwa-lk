import { inject, NewInstance } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class Login {
    constructor(userGateway, user) {
        this.userGateway = userGateway;
        this.user = user;
    }

    isBusy = false;
    validationFailed = false;
    addressExists = true;
    isValidPassword = true; // ER: validate PW-Security

    performLogin() {
        var msg = "Before Login : " + this.user.toString();
        console.log(msg);
        //alert(msg);

        // aurelia-validation is much more complex
        this.validationFailed = this.user.mail.length == 0 || this.user.password.length == 0;
        if (this.validationFailed) {
            console.log("Input-Validation failed : Empty fields");
            return;
        }

        // Enable all
        // TODO: set properties isAuthenticated, isAdmin
        this.user.isAuthenticated = true;
        this.user.isAdmin = true;
        //this.user = this.userGateway.verify(this.user);
        // this.userGateway.verify(this.user);

        msg = "After Login : " + this.user.toString();
        console.log(msg);

        // TODO Logout any active user : cleanup broadcast-feature
        //this.user.reset();

    }
}
