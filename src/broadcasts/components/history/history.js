import { inject, NewInstance } from 'aurelia-framework';
import { BroadcastGateway } from './../../../services/broadcast-gateway';
import { User } from './../../../models/user';

@inject(BroadcastGateway, User)
export class History {
    constructor(broadcastGateway, user) {
        this.user = User;
        this.broadcastGateway = BroadcastGateway;
    }

    vipName = "";
    isVeryImportant = false; // vipStatus

    retrieveMessages() {
        // TODO Create message filter from input 
        var persons = new array();
        // TODO : Add or overwrite entry in table 'Followers'
        //    return this.broadcastGateway.retrieveMessages(persons)
        //        .then(() => this.router.navigateToRoute('login'));

    }



    removeMessages() {
        // TODO Create message filter from input 
        var messages = new array();
        //    return this.broadcastGateway.removeMessages(messages)
        //        .then(() => this.router.navigateToRoute('login'));

    }

}