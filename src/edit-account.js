import { inject, NewInstance } from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';
import { EventAggregator } from 'aurelia-event-aggregator';


@inject(EventAggregator, UserGateway, User)
export class EditAccount {
    nameAlreadyChecked = false;
    mailAlreadyChecked = false;
    hasAdressChanged = false;
    hasNameChanged = false;
    hasPasswordChanged = false;
    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    constructor(eventAggregator, userGateway, user) {
        this.ea = eventAggregator;
        this.userGateway = userGateway;
        this.user = user;
        console.log(user.toString());
        this.temporaryUser = new User();
        this.temporaryUser.mail = this.user.mail;
        this.temporaryUser.nickname = this.user.nickname;
        this.temporaryUser.password = this.user.password;

    }

    activate() {
        console.log("Edit-Account activted");
        var self = this;
        this.subscription = this.ea.subscribe('user-updated', function (updatedUser) {
            self.user.mail = updatedUser.mail;
            self.user.nickname = updatedUser.nickname;
            self.user.password = updatedUser.password;
            console.log("Changed user data : " + self.user.toString());
        });

       

        this.subscription3 = this.ea.subscribe('user-mailNameCheck', function (c) {          
            var uarray = c.content;
            uarray.forEach(function (element) {
           if (element.uid != self.user.id)
           {
               if (element.name == self.user.nickname)
               {
                   
                   self.nameExists = true;
               }    
               if (element.mail == self.user.mail)
               {
                   self.addressExists = true;
               }    
           }    
       }, self);

       if (self.addressExists == false && self.nameExists == false)
       {
           self.userGateway.update(self.user, self.temporaryUser);
       }    

        });

    }
    deactivate() {
        this.subscription.dispose();
        this.subscription3.dispose();        
    }

    applyChanges() {
        var msg1 = "Original user : " + this.user.toString();
        console.log(msg1);
        var msg = "Input :  " + this.temporaryUser.mail + " " + this.temporaryUser.nickname + " " + this.temporaryUser.password;
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


        this.nameAlreadyChecked = false
        this.mailAlreadyChecked = false;
        this.userGateway.CheckNameAndMail(this.temporaryUser.mail, this.temporaryUser.nickname);
     //   this.userGateway.update(this.user, this.temporaryUser, this.hasAdressChanged, this.hasNameChanged,this.hasPasswordChanged );
    }

    validateInputFields() {
        this.validationFailed =
            this.temporaryUser.mail.length == 0 ||
            this.temporaryUser.nickname.length == 0 ||
            this.temporaryUser.password.length == 0;
    }

    hasValidChanges() {
        this.hasAdressChanged = this.user.mail.toLowerCase() !== this.temporaryUser.mail.toLowerCase();
        this.hasNameChanged = this.user.nickname.toLowerCase() !== this.temporaryUser.nickname.toLowerCase();
        this.hasPasswordChanged = this.user.password !== this.temporaryUser.password;

        var hasChanges = this.hasAdressChanged || this.hasNameChanged || this.hasPasswordChanged;
        if (!hasChanges) {
            console.log("Input-Validation result : No changes");
            return false;
        }

        return true;

    }

}