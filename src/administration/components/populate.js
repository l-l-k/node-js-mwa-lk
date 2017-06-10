import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserGateway } from './../../services/user-gateway';
import { User } from './../../models/user';

@inject(EventAggregator, UserGateway, User)
export class AddUser {

    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    constructor(eventAggregator, userGateway, user) {
        this.ea = eventAggregator;
        this.userGateway = userGateway;
        this.user = user;
        this.newUser = new User();
        this.newUser.mail = "";
        this.newUser.nickname = "";
        this.newUser.password = "";
    }

    activate() {
        console.log("Adm menu activated");
        // this.obsoleteUser.mail = "user@to.delete"
        // this.obsoleteUser.nickname = "";
        var self = this;

        this.subscription1 = this.ea.subscribe('user-detected', function (e) {
            var existingUser = e.existingUser;
            // display hints if registration fails
            self.addressExists = existingUser.mail != "";
            self.nameExists = existingUser.nickname != "";

            if (!self.addressExists && !self.nameExists) {
                console.log("User doesn't exist, add him");
                    self.userGateway.add(self.newUser);
            } else {
                console.log("User already exists");
            }
        });

        this.subscription2 = this.ea.subscribe('user-added', function (e) {
            var success = e;
            if (success) {
                console.log("User added");
            } else {
                console.log("Adding user failed");
            }
        });

    }

    deactivate() {
        this.subscription1.dispose();
        this.subscription2.dispose();
    }
    
    tryAddUser() {
        this.validationFailed =
            this.newUser.mail.length == 0 ||
            this.newUser.nickname.length == 0 ||
            this.newUser.password.length == 0;
        if (this.validationFailed) {
            console.log("Input-Validation failed");
            //  alert(msg);
            return;
        }
        this.userGateway.getByMailAddress(this.newUser.mail);
    }

}