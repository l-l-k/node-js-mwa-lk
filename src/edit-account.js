import { inject, NewInstance } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class EditAccount {
    constructor(userGateway, user) {
        this.userGateway = userGateway;
        this.user = user;
        this.currentUser = NewInstance.of(User);
        this.currentUser.mail = this.user.mail;
        this.currentUser.name = this.user.name;
        this.currentUser.password = this.user.password;
    }

    isBusy = false;

    applyChanges() {
        var msg1 = "Original user : " + this.user.mail + " " + this.user.name + " " + this.user.password;
        console.log(msg1);
        var msg = "Input :  " + this.toString();
        console.log(msg);
        alert(msg);

        //  update active user
        this.user.mail = this.currentUser.mail;
        this.user.name = this.currentUser.name;
        this.user.password = this.currentUser.password;

        var msg2 = "Changed user data : " + this.user.mail + " " + this.user.name + " " + this.user.password;
        console.log(msg2);

        // TODO : try change user record in data base
        this.userGateway.updateRecord(this.user);
    }

    toString() {
        var msg = "Current user : " + this.currentUser.mail + " " + this.currentUser.name + " " + this.currentUser.password;
        return msg;
    }
}