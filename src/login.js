import { inject } from 'aurelia-framework';
//import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

//@inject(UserGateway)
export class Login {
    constructor(user) {
        //     this.userGateway = userGateway;
        this.user = new User();
        this.user.mail = "x@y.z";
        this.user.name = "ede";
        this.user.password = "1";
    }

    isBusy = false;

    performLogin() {
        // TODO: Logout any active user
        var msg = "Login now  " + this.user.mail + " " + this.user.name + " " + this.user.password
        console.log(msg);
        alert(msg);
        // TODO: Validate user input
    }
}
