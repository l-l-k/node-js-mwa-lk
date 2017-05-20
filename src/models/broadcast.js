import { ValidationRules } from 'aurelia-validation';

export class Tweet {
    static fromObject(src) {
        const user = Object.assign(new Tweet(), src);
        return user;
    }

    constructor() {
        ValidationRules
            .on(this);
    }

    message = '';
    image = '';
    timestamp = '';
    id = '';
}