import { inject, NewInstance } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { User } from './../models/user';
import environment from './../environment';

@inject(HttpClient)
export class UserGateway {
    constructor(httpClient) {
        // this.httpClient = httpClient.configure(config => {
        //     config
        //         .useStandardConfiguration()
        //         .withBaseUrl(environment.usersUrl);
        // });
    }

     // TODO check accout data : mail and name    
   tryRegister(user) {
    
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

    getAll() {
        return this.httpClient.fetch('users')
            .then(response => response.json())
            .then(dto => dto.map(User.fromObject));
    }

    getById(id) {
        return this.httpClient.fetch(`users/${id}`)
            .then(response => response.json())
            .then(User.fromObject);
    }

    // TODO update accout data : mail, name, password    
    updateRecord(user) {

    }

}