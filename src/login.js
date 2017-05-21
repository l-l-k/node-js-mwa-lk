import { inject } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class Login {
    constructor(userGateway, user) {
        this.userGateway = userGateway;
        this.user = user;
    }

    isBusy = false;

    performLogin() {
        // TODO: Logout any active user
        var msg = "Before Login : " + this.user.toString();
        console.log(msg);
        //alert(msg);
        // Enable all
        this.user.isAuthenticated = true;
        this.user.isAdmin = true;

        // TODO: Validate user input, set properties isAuthenticated, isAdmin
        //this.user = this.userGateway.verify(this.user);
        // this.userGateway.verify(this.user);

        msg = "After Login : " + this.user.toString();
        console.log(msg);
  }
}
