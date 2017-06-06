import { inject, NewInstance } from 'aurelia-framework';
import { BroadcastGateway } from './../../services/broadcast-gateway';
import { User } from './../../models/user';

@inject(BroadcastGateway, User)
export class History {
    constructor(broadcastGateway, user) {
        this.user = User;
        this.broadcastGateway = BroadcastGateway;
    }

    vipName = "";
    isVeryImportant = false; // vipStatus

    addVIP(name, status) {
        var vip = NewInstance.of(User);
        // TODO : Add or overwrite entry in table 'Followers'
            //    return this.broadcastGateway.addVip(this.vipName,this.isVeryImportant)
    //        .then(() => this.router.navigateToRoute('login'));

    }   

   

    removeVIP(name, status) {
        var vip = NewInstance.of(User);
        //    return this.broadcastGateway.removeVip(this.vipName,this.isVeryImportant)
        //        .then(() => this.router.navigateToRoute('login'));

    }   
    
}