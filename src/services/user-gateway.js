import { inject, NewInstance } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { User } from './../models/user';
import environment from './../environment';

@inject(HttpClient)
export class UserGateway {
    constructor(httpClient) {
        this.httpClient = httpClient.configure(config => {
            config
                //  .useStandardConfiguration()
                .withBaseUrl(environment.usersUrl);
        });
    }

    add(user) {
        // add user data to storage
        // store mail address as lower case string    
        var success = true;
        this.httpClient.post('/Signup/' + user.id + '/' + user.mail.toLwerCase() + '/' + user.name + '/' + user.password)
            .then(res => {
                success = boolean.parse(res.content);
            });
        return success;
    }

    // TODO update accout data : mail, name, password    
    update(currentUser, modifiedUser) {
        // validate changes
        var hasChanges =
            currentUser.mail.toLwerCase() !== modifiedUser.mail.toLwerCase() ||
            currentUser.name !== modifiedUser.name ||
            currentUser.password !== modifiedUser.password;
        if (hasChanges == false) {
            return true;
        }

        if (currentUser.mail.toLwerCase() !== modifiedUser.mail.toLwerCase()) {
            var existingUser = getByMailAddress(modifiedUser.mail)
            if (existingUser != null) {
                return false;
            }
        }

        var success = true;
        if (hasChanges) {
            this.httpClient.post('/AccountEdit/' + modifiedUser.mail.toLwerCase() + '/' + modifiedUser.name + '/' + modifiedUser.password)
                .then(res => {
                    success = boolean.parse(res.content);
                });
        }
        return success;
    }

    // TODO validate login data : mail and password    
    verify(user) {
        console.log("Called : getLoginDummy");
        var existingUser = NewInstance.of(User);
        existingUser.mail = 'm@w.a';
        console.log("Created : " + existingUser.mail);
        existingUser.name = 'dummy';
        existingUser.password = '1';
        existingUser.id = '1';

        existingUser.isAuthenticated = true;
        existingUser.isAdmin = false;
        var msg = "Return : " + existingUser.isAuthenticated;
        console.log(msg);

        return existingUser.isAuthenticated;
    }

    validateLogin(user) {
        var success = true;
        this.httpClient.get('/Login/' + modifiedUser.mail.toLwerCase() + '/' + modifiedUser.password)
            .then(res => {
                success = boolean.parse(res.content);
            });
        return success;
    }

    testServerConnection() {
        var x;
        this.httpClient.get('/test').then(res => {
            x = res.content;
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

    getByMailAddress(mailAddress) {
        var existingUser = User; //NewInstance.of(User);
        // TODO : retrieve user data from storage
        //  compare case insensitive  ;  mail address is stored as lower case string
        this.httpClient.get('/UserGetByMail/' + mailAddress.toLwerCase()).then(res => {
            try {
                existingUser = JSON.parse(res.content);
                //  existingUser = transferContentToUser(res.content, existingUser);
            } catch (error) {
                console.log(error);
            }
        });
        return existingUser;
    }

    getByName(name) {
        var existingUser = User; //NewInstance.of(User);

        // TODO : retrieve user data from storage     
        this.httpClient.get('/UserGetByName/' + name).then(res => {
            try {
                existingUser = JSON.parse(res.content);
                // existingUser = transferContentToUser(res.content, existingUser);
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
        var existingUser = User; // NewInstance.of(User);

        // TODO : retrieve user data from storage     
        this.httpClient.get('/UserGetByUid/' + id).then(res => {
            try {
                existingUser = JSON.parse(res.content);
                //   existingUser = transferContentToUser(res.content, existingUser);
            } catch (error) {
                console.log(error);
            }
        });
        return existingUser;
    }


    // temporary code:    
    transferContentToUser(content, existingUser) {
        var obj = JSON.parse(content);
        existingUser.id = x.rows[0];
        existingUser.mail = x.rows[1];
        existingUser.password = x.rows[2];
        existingUser.name = x.rows[3];
        return existingUser;
    }


}