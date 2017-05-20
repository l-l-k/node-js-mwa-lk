import { inject } from 'aurelia-framework';
//import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

//@inject(UserGateway)
@inject(User)
export class EditAccount {
    constructor(user) {
        //     this.userGateway = userGateway;
        this.user = user;
    }

    isBusy = false;

    applyChanges() {
        var msg = "New data  " + this.toString();
        console.log(msg);
        alert(msg);
        // TODO : try register as new user
    }

    toString() {
        var msg = "Current user : " + this.user.mail + " " + this.user.name + " " + this.user.password;
        return msg;
    }
}