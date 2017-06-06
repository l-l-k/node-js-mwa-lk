import { ValidationRules } from 'aurelia-validation';

export class Message {
    static fromObject(src) {
        const msg = Object.assign(new Message(), src);
        return msg;
    }

    constructor() {
    }

    text = 'My very first tweet';
    image = null;
    day = '';
    time = '';
    userId = '';

    reset() {
        text = '';
        image = null;
        day = '';
        time = '';
        userId = '';
    }
}