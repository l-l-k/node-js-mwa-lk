import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
//import { ViewManager } from 'aurelia-view-manager';
import { BroadcastGateway } from './../../../services/broadcast-gateway';
import { UserGateway } from './../../../services/user-gateway';
import { User } from './../../../models/user';
import { BroadcastFilter } from './../../../models/broadcast-filter';

@inject(EventAggregator, BroadcastGateway, UserGateway, User)
export class History {

    isBusy = false;
    vipName = "";

    receivedTweets = [];
    timeRange = [
        { firstDay: null },
        { lastDay: null }
    ];

    constructor(eventAggregator, broadcastGateway, userGateway, user) {
        this.ea = eventAggregator;
        this.broadcastGateway = broadcastGateway;
        this.userGateway = userGateway;
        this.user = user;
        this.senderFilter = new BroadcastFilter();

        this.showNoMessages = false;
        this.showMyMessages = true;
        this.showTweetsOfSpecialUser = false;
        this.nameOfSpecialUser = "";
        this.showTweetsOfActiveVips = false;

        this.useRerestrictedTimeRange = true;
        this.firstDay = null;
        this.lastDay = null;
    }

    isVeryImportant = false; // vipStatus
    // showNoMessages = false;
    // showMyMessages = true;
    // showTweetsOfSpecialUser = false;
    // nameOfSpecialUser = "";
    // showTweetsOfActiveVips = false;    

    activate() {
        var self = this;
        this.useRerestrictedTimeRange = true;

        this.subscription1 = this.ea.subscribe('messages-downloaded', function (e) {
            self.receivedTweets = [];
            console.log("Event handler for messages-downloaded");
            console.log(e);
            e.messages.forEach(function (element) {
                self.receivedTweets.push(element);
            }, this);

            self.isBusy = false;
        });

        this.subscription2 = this.ea.subscribe('user-detected', function (e) {
            console.log("Event handler for messages-detected");
            console.log(e);
            var existingUser = e.existingUser;
            if (existingUser.mail != "") {
                console.log("Add " + existingUser.nickname + " to list");
                self.persons.push(existingUser.id);
                console.log("Request messages for " + persons);
                self.broadcastGateway.getSomeMessages(persons, self.timeRange.firstDay, self.timeRange.lastDay);
            } else {
                console.log("User does not exist");
            }

            self.isBusy = false;
        });

        this.subscription3 = this.ea.subscribe('messages-removed', function (e) {
            console.log("Event handler for messages-deletion");
            self.isBusy = false;
        });

    }

    deactivate() {
        this.subscription1.dispose();
        this.subscription2.dispose();
        this.subscription3.dispose();
    }

    xshowTweetsOfActiveVipsChanged(e) {
        this.showTweetsOfActiveVips = e.currentTarget.activeElement.checked;
        console.log(this.showTweetsOfActiveVips);
    }

    timeRangeUsageChanged(e) {
        this.useRerestrictedTimeRange = e.currentTarget.activeElement.checked;
        console.log(this.showTweetsOfActiveVips);
    }

    cleanupTable() {
        this.receivedTweets = [];
    }

    retrieveMessages() {
        if (this.isBusy) {
            // return;
        };

        // Create message filter from input 
        var persons = new Array();
        this.cleanupTable();

        this.timeRange.firstDay = new Date(2017, 1, 1, 0, 0, 0, 0);
        this.timeRange.lastDay = now();
        if (this.useRerestrictedTimeRange) {
            if (this.firstDay != null) {
                this.timeRange.firstDay = this.firstDay;
            }
            if (this.lastDay != null) {
                this.timeRange.lastDay = this.lastDay;
            }
        }

        if (this.showTweetsOfActiveVips) {
            this.user.vips.forEach(function (element) {
                persons.push(element);
            }, this);
        };

        if (this.showMyMessages) {
            persons.push(this.user.id);
        };

        if (this.showTweetsOfSpecialUser) {
            this.userGateway.getByName(this.nameOfSpecialUser);
            return;
        };

        this.isBusy = true;
        console.log("Request messages");
        this.broadcastGateway.getSomeMessages(persons, this.timeRange.firstDay, this.timeRange.lastDay);
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