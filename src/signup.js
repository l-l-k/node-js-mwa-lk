import { inject } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class Signup {
    constructor(userGateway, user) {
        this.userGateway = userGateway;
        this.user = user;
    }

    isBusy = false;

    performSignup() {
        var msg = "Signup  " + this.toString();
        console.log(msg);
        alert(msg);
        // TODO : try register as new user
        this.userGateway.tryRegister(this.user)
        // TODO Display hints if registration fails
    }

    toString() {
        var msg = "Current user : " + this.user.mail + " " + this.user.name + " " + this.user.password;
        return msg;
    }
}
