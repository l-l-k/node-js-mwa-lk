import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BroadcastGateway } from './../../services/broadcast-gateway';
import { User } from './../../models/user';

@inject(EventAggregator, BroadcastGateway, User)
export class History {
    constructor(eventAggregator, broadcastGateway, user) {
        this.ea = eventAggregator;
        this.user = user;
        this.broadcastGateway = broadcastGateway;
    }

    vipName = "";
    isVeryImportant = false; // vipStatus

    addVIP(name, status) {
        var vip = new User();
        // TODO : Add or overwrite entry in table 'Followers'
        //    return this.broadcastGateway.addVip(this.vipName,this.isVeryImportant)
        //        .then(() => this.router.navigateToRoute('login'));

    }



    removeVIP(name, status) {
        var vip = new User();
        //    return this.broadcastGateway.removeVip(this.vipName,this.isVeryImportant)
        //        .then(() => this.router.navigateToRoute('login'));

    }

}