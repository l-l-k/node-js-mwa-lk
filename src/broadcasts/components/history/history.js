import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
//import { ViewManager } from 'aurelia-view-manager';
import { BroadcastGateway } from './../../../services/broadcast-gateway';
import { UserGateway } from './../../../services/user-gateway';
import { User } from './../../../models/user';
import { BroadcastFilter } from './../../../models/broadcast-filter';
import { Toolkit } from './../../../models/toolkit';

@inject(EventAggregator, BroadcastGateway, UserGateway, User)
export class History {

    isBusy = false;
    vipName = "";
    isVeryImportant = false; // vipStatus

    receivedTweets = [];
    timeRange = [
        { firstDay: "" },
        { lastDay: "" }
    ];

    constructor(eventAggregator, broadcastGateway, userGateway, user) {
        this.ea = eventAggregator;
        this.broadcastGateway = broadcastGateway;
        this.userGateway = userGateway;
        this.user = user;
        this.senderFilter = new BroadcastFilter();
        this.toolkit = new Toolkit();

        this.showNoMessages = false;
        this.showMyMessages = true;
        this.showTweetsOfSpecialUser = false;
        this.nameOfSpecialUser = "";
        this.showTweetsOfActiveVips = false;

        this.useRerestrictedTimeRange = true;
        this.firstDay = null;
        this.lastDay = null;
    }

    activate() {
        var self = this;
        this.useRerestrictedTimeRange = true;

        this.subscription1 = this.ea.subscribe('messages-downloaded', function (e) {
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

        var d1 = new Date(2017, 1, 1);
        var d2 = new Date();
        this.timeRange.firstDay = this.toolkit.getTimestampOfFirstDay(d1);
        this.timeRange.lastDay = this.toolkit.getTimestampOfLastDay(d2);
        if (this.useRerestrictedTimeRange) {
            if (this.firstDay != null) {
                var d3 = new Date(this.firstDay);
                this.timeRange.firstDay = this.toolkit.getTimestampOfFirstDay(d3);
            }
            if (this.lastDay != null) {
                var d4 = new Date(this.lastDay);
                this.timeRange.lastDay = this.toolkit.getTimestampOfLastDay(d4);
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
            //return;
        };

        this.isBusy = true;
        if (this.user.id.length > 0) {
            console.log("Request message-deletion");
            this.broadcastGateway.removeMessages(this.user.id);
        }
    }

}