//import { ValidationRules } from 'aurelia-validation';

///@inject(ValidationRules);
export class User {
    static fromObject(src) {
        const user = Object.assign(new User(), src);
        return user;
    }

    mail = 'a@b.c';
    name = 'otto';
    password = '1';
    id = '0';

    isAuthenticated = false;    
    isAdmin = false;

    // Lists of tweeters whom this user wants to follow
    vips = []; // Very Important Persons (alwasy visible)
    nips = []; // Normal Important Persons (visible on demand)

    // constructor() {
    //     ValidationRules
    //         .ensure('mail')
    //         .required()
    //         .maxLength(250)
    //         .ensure('name')
    //         .required()
    //         .maxLength(100)
    //         .ensure('password')
    //         .required()
    //         .maxLength(100)
    //         .ensure('id')
    //         .required()
    //         .maxLength(100)
    //         .on(this);
    // }

    toString() {
        var msg = "Current user (ID = " + this.id + ") : " + this.mail + " " + this.name + " " + this.password;
        return msg;
    }
    
    reset() {
        this.mail = '';
        this.name = '';
        this.password = '';
        this.id = '0';

        this.isAuthenticated = false;
        this.isAdmin = false;

        // Lists of tweeters whom this user wants to follow
        this.vips = []; // Very Important Persons (alwasy visible)
        this.nips = []; // Normal Important Persons (visible on demand)
    }
}