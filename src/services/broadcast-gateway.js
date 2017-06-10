import { inject, NewInstance } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { UserGateway } from './user-gateway';
import { EventAggregator } from 'aurelia-event-aggregator';
import { User } from './../models/user';
import environment from './../environment';

@inject(EventAggregator,HttpClient, UserGateway, User)
export class BroadcastGateway {

    broadcasts = [];

    constructor(eventAggregator, httpClient, userGateway, user) {
        this.ea = eventAggregator;
        this.user = user;
        this.httpClient = httpClient.configure(config => {
            config
                //  .useStandardConfiguration()
                .withBaseUrl(environment.usersUrl);
        });
        this.userGateway = userGateway;
    }

    addVIP(userID, vipName) {
        var ToFollow = this.userGateway.getByName(vipName);
        // TODO : retrieve user data from storage
        // name must exist !
        //  compare case insensitive  ;  name is NOT stored as lower case string
        var x;
        this.httpClient.get('/FollowerAdd/' + userID + '/' + ToFollow.id).then(res => {
            x = res.content;
            console.log(x);
            return x;
        });


    }

    removeVIP(userID, vipName) {
        // TODO : retrieve user data from storage
        // remove vip from  must exist !
        //  compare case insensitive  ;  name is NOT stored as lower case string
        var ToUnFollow = this.userGateway.getByName(vipName);
        var x;
        this.httpClient.get('/FollowerRemove/' + userID + '/' + ToUnFollow.id).then(res => {
            x = res.content;
            console.log(x);
            return x;
        });


    }


    updateVIPStatus(userID, vipName, isActiveVIP) {
        var PriorityChanger = this.userGateway.getByName(vipName);
        // TODO : retrieve user data from storage
        // update entry in followers table !
        //  compare vip name case insensitive  ;  name is NOT stored as lower case string
        var x;
        this.httpClient.get('/FollowerActivate/' + userID + '/' + PriorityChanger.id + '/' + isActiveVIP).then(res => {
            x = res.content;
            console.log(x);
            return x;
        });


    }

    //____________________________________________________
    // Messages

    addMessage(text, image) {

        this.httpClient.post('/TweetAdd/' + this.user.id + '/' + text + '/' + image)
            .then(res => {
                try {
                    var success = Boolean(res.content);
                    console.log("content:" + res.content + " - success:" + success);
                    console.log("Raise Event message-sent ");
                    if (success) {
                        this.ea.publish('message-sent', { success });
                    }
           
                } catch (error) {
                    console.log(error);
                }
            });
    }

    getMessages(persons) {
        // TODO  
        var currentUser = persons[0]; // ids
        this.httpClient.get('/TweetGet/' + currentUser)
            .then(res => {
                try {
                    var messages=[];
                    if (!(res.content == "" || res.content == "[]"))
                    {  messages = JSON.parse(res.content); }
                    console.log("content:" + res.content);
                    this.ea.publish('messages-downloaded', { messages });

                } catch (error) {
                    console.log(error);
                }
            });
    }

    getSomeMessages(persons, firstDay, lastDay) {
        // Input: array, date, date
    }

    removeMessages(useriD) {
        // TODO 
        this.httpClient.post('/TweetsRemove/' + userID)
            .then(res => {
                try {
                    var success = Boolean(res.content);
                    console.log("content:" + res.content + " - success:" + success);
                    console.log("Raise Event message-removed ");
                    if (success) {
                        this.ea.publish('message-removed', { sucess });
                    }
           
                } catch (error) {
                    console.log(error);
                }
            });
    }


}