import { inject, NewInstance } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { User } from './../models/user';
import environment from './../environment';

@inject(HttpClient)
export class UserGateway {
    constructor(httpClient) {
        this.httpClient = httpClient.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.usersUrl);
        });
    }

    add(user) {
        // TODO : complete user data with id
        // TODO : add user data to storage
                // TODO : store mail address as lower case string    

    }

    // TODO update accout data : mail, name, password    
    update(currentUser, modifiedUser) {
        var success = true;
// validate changes
        // TODO : compare case insensitive    
        if (currentUser.mail.toLwerCase() !== modifiedUser.mail.toLwerCase() ) {
            var existingUser = getByMailAddress(modifi)

        }
        var hasChanges =
            this.user.mail.toLwerCase() !== this.temporaryUser.mail.toLwerCase() ||
            this.user.name.toLwerCase() !== this.temporaryUser.name.toLwerCase() ||
            this.user.password !== this.temporaryUser.password;
        
        var existingUser = getByMailAddress(modifi)
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

   getByMailAddress(mailAddress) {
       var existingUser = NewInstance.of(User);

       // TODO : retrieve user data from storage
        //  compare case insensitive  ;  mail address is stored as lower case string
       var x =  this.httpClient.fetch(`test`)
           .then(response => response.json())
           .then(User.fromObject);
       return x;
   }

   getByName(name) {
       var existingUser = NewInstance.of(User);

       // TODO : retrieve user data from storage
       //  compare case insensitive  ;  mail address is stored as lower case string

       return existingUser;
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


}