import { inject, NewInstance } from 'aurelia-framework';
import { ValidationController } from 'aurelia-validation';
import { UserGateway } from './../../services/user-gateway';
import { User } from './../../models/user';

@inject(UserGateway, NewInstance.of(ValidationController))
export class Cleanup{
    constructor(userGateway, validationController) {
        this.userGateway = userGateway;
        this.validationController = validationController;
        this.temporaryUser = NewInstance.of(User);
        this.temporaryUser.name = "X"; 
        this.temporaryUser.mail = 'a@b.c';
        this.temporaryUser.password = '1';
    }

    validationFailed = false;
    displayMessages = false;  

    activateUser() {
        console.log("Activate user " + this.temporaryUser.name + " with messages : " +this.displayMessages );
    }

    processTask() {
       console.log("Process deletion task for user : " + this.temporaryUser.name);
    }

    testSubmitButton3() {
        console.log("Test Submit Buton 3 : ");//+ this.temporaryUser.name);
    }
}