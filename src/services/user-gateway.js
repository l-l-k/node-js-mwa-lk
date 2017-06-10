import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { HttpClient } from 'aurelia-http-client';
import { User } from './../models/user';
import environment from './../environment';

@inject(HttpClient, EventAggregator)
export class UserGateway {

    users = [];
    admins = [];
    followers = [];

    constructor(httpClient, eventAggregator) {

        this.httpClient = httpClient.configure(config => {
            config
                //  .useStandardConfiguration()
                .withBaseUrl(environment.usersUrl);
        });
        this.ea = eventAggregator;
    }

    add(user) {
        // add user data to storage
        console.log('/Signup/' + user.id + '/' + user.mail.toLowerCase() + '/' + user.nickname + '/' + user.password);
        this.httpClient.post('/Signup/' + user.id + '/' + user.mail.toLowerCase() + '/' + user.nickname + '/' + user.password)
            .then(res => {
                try {
                    var success = Boolean(res.content);
                    console.log("content:" + res.content + " - success:" + success);
                    if (success)
                        console.log("Raise Event user-added " + user);
                    this.ea.publish('user-added', { user });
                } catch (error) {
                    console.log(error);
                }
            });
    }

    remove(user) {
        // remove user and related data from storage
        var success = true;
        this.httpClient.post('/AccountRemove/' + user.id + '/' + user.mail.toLowerCase() + '/' + user.nickname + '/' + user.password)
            .then(res => {
                success = Boolean(res.content);
                this.ea.publish('user-deleted', { success });
            });
    }


    // update accout data : mail, name, password    
    update(currentUser, modifiedUser) {

        this.httpClient.post('/AccountEdit/' + currentUser.id + '/' + modifiedUser.mail.toLowerCase() + '/' + modifiedUser.nickname + '/' + modifiedUser.password)
            .then(() => {
                this.ea.publish('user-updated', { modifiedUser });
            });


    }


    CheckNameAndMail(mail, username) {
        this.httpClient.get('/MailNameCheck/' + mail + '/' + username)
            .then(res => {
                var content = JSON.parse(res.content);
                this.ea.publish('user-mailNameCheck', { content });
            });

    }

    // TODO validate login data : mail and password    
    verify(user) {
        var existingUser = new User();
        console.log('/Login/' + user.mail.toLowerCase() + '/' + user.password);
        this.httpClient.post('/Login/' + user.mail.toLowerCase() + '/' + user.password)
            .then(res => {
                try {
                    var cont = res.content;
                    console.log("content:" + cont);

                    console.log("Raise Event verify " + cont);
                    this.transferContentToUser(cont, existingUser);
                    this.ea.publish('login-check', { existingUser });
                } catch (error) {
                    console.log(error);
                }
            });

    }

    getByMailAddress(mailAddress) {
        var existingUser = new User();
        // TODO : retrieve user data from storage
        //  compare case insensitive  ;  mail address is stored as lower case string
        this.httpClient.get('/UserGetByMail/' + mailAddress.toLowerCase())
            .then(res => {
                try {
                    this.transferContentToUser(res.content, existingUser);
                    console.log("Raise Event user-detected " + existingUser);
                    this.ea.publish('user-detected', { existingUser });
                } catch (error) {
                    console.log(error);
                }
            });
        // return existingUser;
    }

    getByName(username) {
        var existingUser = new User();

        // TODO : retrieve user data from storage     
        this.httpClient.get('/UserGetByName/' + username).then(res => {
            try {
                this.transferContentToUser(res.content, existingUser);
                this.ea.publish('user-detected', { existingUser });
            } catch (error) {
                console.log(error);
            }
        });
        return existingUser;
    }

    // TODO: delete, demo-code only
    getAll() {
        return this.httpClient.fetch('users')
            .then(response => response.json())
            .then(dto => dto.map(User.fromObject));
    }

    getById(id) {
        var existingUser = User;

        // TODO : retrieve user data from storage     
        this.httpClient.get('/UserGetByUid/' + id).then(res => {
            try {
                transferContentToUser(res.content, existingUser);
            } catch (error) {
                console.log(error);
            }
        });
        return existingUser;
    }


    transferContentToUser(content, existingUser) {
        console.log("transferContentToUser : " + content);
        if (content == "" || content === "[]") {
            return;
        }
        var dbusers = JSON.parse(content);
        if (dbusers.length == 0) {
            return;
        }
        existingUser.id = dbusers[0].uid;
        existingUser.mail = dbusers[0].mail;
        existingUser.password = dbusers[0].password;
        existingUser.nickname = dbusers[0].name;
    }

    isAdmin(userID) {
        this.httpClient.get('/AdminCheck/' + userID).then(res => {
            try {
                this.ea.publish('admin-check', { res });
            } catch (error) {
                console.log(error);
            }
        });

    }

    getVIPs(userID) {
        this.httpClient.get('/FollowerGetAR/' + userID).then(res => {
            var x = JSON.parse(res.content);
            try {
                this.ea.publish('vips-incoming', { x });
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        });

    }

    testServerConnection() {
        var x = new Object();
        this.httpClient.get('/test').then(res => {
            x = res.content
            //    res.send(res.content);
            // await x.value = res.content;
            // return await x;
        });
        return x; // expected result = Welcome ....
    }

    testLocalHerokuDB() {
        var x;
        this.httpClient.get('/db').then(res => {
            x = res.content;
        });
        return x;  // expected result = tbl:2
    }

    setupDB() {
        this.httpClient.post('/setupdb').then(res => {
            x = res.content;
        });
    }
}