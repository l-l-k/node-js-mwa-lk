import { inject } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

@inject(Router, EventAggregator, UserGateway, User)
export class Login {
    constructor(router, eventAggregator, userGateway, user) {
        this.Lrouter = router;
        this.ea = eventAggregator;
        this.userGateway = userGateway;
        this.user = user;
        this.user.mail = "a@a.a";
        this.user.password = "a";
    }

    isBusy = false;
    validationFailed = false;
    addressExists = true;
    isValidPassword = true; // ER: validate PW-Security

    activate() {
        console.log("Login activted");
        var self = this;
        this.subscription = this.ea.subscribe('login-check', function (e) {
            console.log("Login Event raised");
            console.log(e);
            if (e != "[]") {
                self.user.id = e.existingUser.id;
                self.user.mail = e.existingUser.mail;
                self.user.nickname = e.existingUser.nickname;
                self.user.password = e.existingUser.password;
                self.user.isAuthenticated = "true";

                self.userGateway.isAdmin(self.user.id);

            }
        });

        this.subscription1 = this.ea.subscribe('admin-check', function (e) {
            console.log("AdminCheck Event raised");
            console.log(e);
            self.user.isAdmin = e.isSuccess;
            var msg = "After Login : " + self.user.toString();
            console.log(msg);
            self.userGateway.getVIPs(self.user.id);

        });


        this.subscription2 = this.ea.subscribe('vips-incoming', function (e) {
            console.log(e.x);
            if (!(e.x == "[]" || e.x == "")) {


                var a = e.x;
                console.log("wir haben " + a);
                a.forEach(function (element) {
                    if (element.active == true) {
                        self.user.vips.push(element.vip);
                    } else {
                        self.user.nips.push(element.vip);
                    }
                }, this);
            }
            self.Lrouter.navigateToRoute('tweet');
        });

    }
    deactivate() {
        this.subscription.dispose();
        this.subscription1.dispose();
        this.subscription2.dispose();
    }
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

        this.userGateway.verify(this.user);

    }
}
