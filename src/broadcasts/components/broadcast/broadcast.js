import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { computedFrom } from 'aurelia-framework';
import { BroadcastGateway } from './../../../services/broadcast-gateway';
import { User } from './../../../models/user';
import { Message } from './../../../models/message';
import { Toolkit } from './../../../models/toolkit';

@inject(EventAggregator, BroadcastGateway, User, NewInstance.of(Message))
export class Broadcast {

    isBusy = false;
    isImageAttached = false;
    imageUrl = null;
    selectedFiles = null;
    selectedImage = null;

    constructor(eventAggregator,broadcastGateway, user, message) {
        this.ea = eventAggregator;
        this.broadcastGateway = broadcastGateway;
        this.user = user;
        this.message = message;
        this.toolkit = new Toolkit();
    }

    activate() {
        var self = this;

        this.subscription = this.ea.subscribe('message-sent', function (e) {
            console.log("Event handler for message-sent");
            self.isBusy = false;
            //this.message.reset();
            //  this.router.navigateToRoute('login'));
        });

    }

    deactivate() {
        this.subscription.dispose();
    }
    

    @computedFrom('isImageAttached')
    get computedImageUrl() {
        console.log("Return image URL :" + this.imageUrl);
        return this.imageUrl;
    }

    detachImage() {
        this.imageUrl = null;
        this.isImageAttached = false;
    }

    updateImageUrl() {
        console.log("Update Image URL");
        if (this.selectedFiles.length > 0) {
            this.isImageAttached = false;
            this.selectedImage = this.selectedFiles[0];
            this.readFileURL(this.selectedImage, this);
            this.isImageAttached = this.imageUrl != null;
        } else {
            detachImage();
        }
    }

    updatePreview() {
        console.log("Update Preview");
        this.updateImageUrl();
        console.log("Updated Image URL :" + this.imageUrl);
    }

    readFileURL(selectedFile, broadcast) {
        // load data asynchronously
        var reader = new FileReader();
        reader.onload = (function (selectedImage) {
            return function (e) {
                console.log("Selected image :" + e.target.result);
                broadcast.imageUrl = e.target.result;
            };
        })(selectedFile);
        reader.readAsDataURL(selectedFile);

    }

    sendMessage() {
        if (this.isBusy) {
            return;
        };

     //   this.isBusy = true;
        console.log("Send message");
        if (this.isValidMessage()) {
            this.message.image = this.imageUrl;
            this.message.userId = this.user.id;
            this.message.day = this.toolkit.getDay();
            this.message.time = this.toolkit.getTime();
            // send message --> add message to table 'tweets'
            this.broadcastGateway.addMessage(this.message.text, encodeURIComponent(this.imageUrl));
        }
    }

    isValidMessage() {
        if (this.isImageAttached) {
            return true;
        } else {
            return this.message.text.length > 0;
        }
    }

}