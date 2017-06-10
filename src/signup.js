import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';
import { Router } from 'aurelia-router';

@inject(Router, EventAggregator, UserGateway, User)
export class Signup {
    constructor(router, eventAggregator, userGateway, user) {
        this.router = router;
        this.ea = eventAggregator;
        this.userGateway = userGateway;
        this.user = user;
        this.newUser = new User();
        this.newUser.mail = "a@a.a";
        this.newUser.nickname = "aa";
        this.newUser.password = "a";
    }

    activate() {
        console.log("Signup activated");
        var self = this;
        this.subscription = this.ea.subscribe('user-detected', function (e) {
            console.log("Event raised");
            console.log(e);

            var existingUser = e.existingUser;
            // display hints if registration fails
            self.addressExists = existingUser.mail != "";
            self.nameExists = existingUser.nickname != "";

            if (!self.addressExists && !self.nameExists) {
                console.log("Add user");
                self.userGateway.add(self.newUser);
            }
        });

        this.subscription2 = this.ea.subscribe('user-added', e => {
            console.log("Event 2 raised");
            console.log(e);
            //this.user = e.existingUser;          
            self.router.navigateToRoute('login');
        });

    }

    deactivate() {
        this.subscription.dispose();
        this.subscription2.dispose();
    }


    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    save() {
        console.log("W");
        alert('SAVE');
        //    return this.userGateway.create(this.newUser)
        //        .then(() => this.router.navigateToRoute('login'));
        return this.newUser;
    }


    performSignup() {
        var msg = "Signup  " + this.newUser.toString();
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

        //  var txt = this.userGateway.testLocalHerokuDB();
        this.userGateway.getByMailAddress(this.newUser.mail);

    }
}
