import { inject } from 'aurelia-framework';
//import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

//@inject(UserGateway)
@inject(User)
export class Login {
    constructor(user) {
        //     this.userGateway = userGateway;
        this.user = user;
    }

    isBusy = false;

    performLogin() {
        // TODO: Logout any active user
        var msg = "Login now  " + this.user.mail + " " + this.user.name + " " + this.user.password
        console.log(msg);
        alert(msg);
        // TODO: Validate user input

        // TODO : Enable postings
        this.user.isau
        config.navModel.setTitle(this.contact.fullName);
    
    }
}
