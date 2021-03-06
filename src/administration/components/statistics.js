import { inject, NewInstance } from 'aurelia-framework';
import { ValidationController } from 'aurelia-validation';
import { UserGateway } from './../../services/user-gateway';
import { User } from './../../models/user';

@inject(UserGateway, NewInstance.of(ValidationController))
export class Statistics {
    constructor(userGateway, validationController) {
        this.userGateway = userGateway;
        this.validationController = validationController;
    }

    validationFailed = false;

}