import { inject, NewInstance } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class EditAccount {
    constructor(userGateway, user) {
        this.userGateway = userGateway;
        this.user = user;
        this.temporaryUser = NewInstance.of(User);
        this.temporaryUser.mail = this.user.mail;
        this.temporaryUser.name = this.user.name;
        this.temporaryUser.password = this.user.password;
    }

    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    applyChanges() {
        var msg1 = "Original user : " + this.user.toString();
        console.log(msg1);
        var msg = "Input :  " + this.temporaryUser.mail + " " + this.temporaryUser.name + " " + this.temporaryUser.password;
        console.log(msg);
        //alert(msg);

        // aurelia-validation is much more complex
        this.validateInputFields();
        if (this.validationFailed) {
            console.log("Input-Validation failed : Empty fields");
            return;
        }

        if (!this.hasValidChanges()) {
            return;
        }

        // change user record in data base
        if (this.userGateway.update(this.user, this.temporaryUser)) {
            //  update active user
            this.user.mail = this.temporaryUser.mail;
            this.user.name = this.temporaryUser.name;
            this.user.password = this.temporaryUser.password;

            console.log("Changed user data : " + this.user.toString());
        }
    }

    validateInputFields() {
        this.validationFailed =
            this.temporaryUser.mail.length == 0 ||
            this.temporaryUser.name.length == 0 ||
            this.temporaryUser.password.length == 0;
    }

    hasValidChanges() {
        var hasAdressChanged = this.user.mail.toLwerCase() !== this.temporaryUser.mail.toLwerCase();
        var hasNameChanged = this.user.name.toLwerCase() !== this.temporaryUser.name.toLwerCase();
        var hasPasswordChanged = this.user.password !== this.temporaryUser.password;

        var hasChanges = hasAdressChanged || hasNameChanged || hasPasswordChanged;
        if (!hasChanges) {
            console.log("Input-Validation result : No changes");
            return false;
        }

        // TODO: allow changes        
        var anyUser = User;
        if (hasAdressChanged) {
            anyUser = this.userGateway.getByMailAddress(this.temporaryUser.mailAddress);
            this.addressExists = this.user.id !== anyUser.id;
        }

        if (hasNameChanged) {
            anyUser = this.userGateway.getByName(this.temporaryUser.name);
            this.nameExists = this.user.id !== anyUser.id;
        }

        if (addressExists || nameExists || !hasPasswordChanged) {
            console.log("Input-Validation result : Invalid changes");
            return false;
        }
    }

}