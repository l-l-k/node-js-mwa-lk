import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserGateway } from './../../services/user-gateway';
import { User } from './../../models/user';

@inject(EventAggregator, UserGateway, User)
export class AdminMenu {
    constructor(router, eventAggregator, userGateway, user) {
        this.router = router;
        this.ea = eventAggregator;
        this.userGateway = userGateway;
        this.user = user;
    }

    tryAddUser() {

    }


    tryDeleteUser() {
        if (confirm('Do you want to delete this user and all of his broadcasts?')) {
            // TODO delete selected items
        }
    }

}