//import { ValidationRules } from 'aurelia-validation';

///@inject(ValidationRules);
export class User {
    static fromObject(src) {
        const user = Object.assign(new User(), src);
        return user;
    }

    mail = '';
    name = '';
    password = '';
    id = '';

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

}