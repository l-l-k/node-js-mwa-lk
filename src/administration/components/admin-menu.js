import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserGateway } from './../../services/user-gateway';
import { User } from './../../models/user';

@inject(EventAggregator, UserGateway, User)
export class AdminMenu {

    task = "";
    validationFailed = false;

    constructor(eventAggregator, userGateway, user) {
        this.ea = eventAggregator;
        this.userGateway = userGateway;
        this.user = user;
        this.obsoleteUser = new User();
        this.obsoleteUser.mail = "user@to.delete";
        this.obsoleteUser.nickname = "";
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
            if (existingUser.mail != "") {
                console.log("User exists");
                if (self.task = "AddUser") {
                    self.userGateway.add(self.newUser);
                }
                if (self.task = "DeleteUser") {
                    self.userGateway.remove(existingUser);
                }
            } else {
                console.log("User does not exist");
            }
        });

        this.subscription2 = this.ea.subscribe('user-deleted', function (e) {
            var success = e;
            if (success) {
                console.log("User deleted");
            } else {
                console.log("Deeleting user failed");
            }
        });

        this.subscription3 = this.ea.subscribe('user-added', function (e) {
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
        this.subscription3.dispose();
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
        this.task = "AddUser"

    }


    tryDeleteUser() {
        this.task = "DeleteUser"
        if (confirm('Do you want to delete this user and all of his broadcasts?')) {
            // TODO delete selected items
            if (this.obsoleteUser.mail.length > 0) {
                this.userGateway.getByMailAddress(this.newUser.mail);
                return;
            }

            if (this.obsoleteUser.nickname.length > 0) {
                this.userGateway.getByName(this.newUser.mail);
                return;
            }

        }
    }

}