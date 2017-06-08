import { inject, NewInstance } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { UserGateway } from './user-gateway';
import { User } from './../models/user';
import environment from './../environment';

@inject(HttpClient, UserGateway)
export class BroadcastGateway {
    constructor(httpClient, userGateway) {
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

}