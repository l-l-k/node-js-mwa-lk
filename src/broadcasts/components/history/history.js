import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
//import { ViewManager } from 'aurelia-view-manager';
import { BroadcastGateway } from './../../../services/broadcast-gateway';
import { User } from './../../../models/user';

@inject(EventAggregator, BroadcastGateway, User)
export class History {

    isBusy = false;
    vipName = "";
    isVeryImportant = false; // vipStatus
    tweets = [];

    constructor(eventAggregator, broadcastGateway, user) {
        this.ea = eventAggregator;
        this.user = user;
        this.broadcastGateway = broadcastGateway;
    }


    activate() {
        var self = this;

        this.subscription1 = this.ea.subscribe('messages-downloaded', function (e) {
            self.tweets = [];
            console.log("Event handler for messages-downloaded");
            console.log(e);
            e.messages.forEach(function(element) {
                self.tweets.push(element);
            }, this);
            
            self.isBusy = false;
        });

        this.subscription2 = this.ea.subscribe('messages-removed', function (e) {
            console.log("Event handler for messages-deletion");
            self.isBusy = false;
        });

    }

    deactivate() {
        this.subscription1.dispose();
        this.subscription2.dispose();
    }

    retrieveMessages() {
        if (this.isBusy) {
            return;
        };
        // TODO Create message filter from input 
        // Current version : My tweets only, no vips
        var persons = new Array();
        persons.push(this.user.id);

        this.isBusy = true;
        console.log("Request messages");
        this.broadcastGateway.getMessages(persons);
    }



    removeMessages() {
        if (this.isBusy) {
            return;
        };

        this.isBusy = true;
        console.log("Request message-deletion");
        this.broadcastGateway.removeMessages(this.user.id);
    }

}