import { Toolkit } from './toolkit';

export class User {
    static fromObject(src) {
        const user = Object.assign(new User(), src);
        return user;
    }

    mail = ''; //a@b.c';
    nickname = ''; //otto';
    password = ''; //1';
    id = "0";
    
    isAuthenticated = false;
    isAdmin = true;

    // Lists of tweeters whom this user wants to follow
    vips = []; // Very Important Persons (alwasy visible)
    nips = []; // Normal Important Persons (visible on demand)

    constructor() {
        var tool = new Toolkit();
        this.id = tool.createGuid();
        console.log("User created : " + this.toString());
    }

    toString() {
        var msg = "Current user (ID = " + this.id + ") : " + this.mail + " " + this.nickname + " " + this.password;
        return msg;
    }

    becomeFollower(id, isVeryImportantPerson) {
        if (isVeryImportantPerson) {
            this.vips.push(id);
        } else {
            this.nips.push(id);
        }
    }

reset() {
    this.mail = '';
    this.nickname = '';
    this.password = '';
    this.id = '0';

    this.isAuthenticated = false;
    this.isAdmin = false;

    // Lists of tweeters whom this user wants to follow
    this.vips = []; // Very Important Persons (alwasy visible)
    this.nips = []; // Normal Important Persons (visible on demand)
}
}