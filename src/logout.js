import { inject, NewInstance } from 'aurelia-framework';
import { User } from './models/user';

@inject(User)
export class Logout {
    constructor(user) {
        this.user = user;
        console.log("Logout Route initialised with " + this.user.mail)
    }

    activate() {
        console.log("activated: Logout " + this.user.mail )
        if (this.user !== null) {
            console.log("Before Reset: " + this.user.mail);
            this.user.reset()
            console.log("After Reset: "+ this.user.mail);
        }
    }
}
