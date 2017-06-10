export class BroadcastFilter {
    static fromObject(src) {
        const filter = Object.assign(new BroadcastFilter(), src);
        return filter;
    }

    isBusy = false;
  
    constructor() {
        this.persons = new Array();   
        this.showNoMessages = false;
        this.showMyMessages = true;
        this.showTweetsOfSpecialUser = false;
        this.nameOfSpecialUser = "";
        this.showTweetsOfActiveVips = false;

        console.log("Filter created : " );
    }


    activate() {
        console.log("Filter activated");

        var self = this;

        this.subscription2 = this.ea.subscribe('user-detected', function (e) {
            console.log("Event handler for messages-detected");
            console.log(e);
            var existingUser = e.existingUser;
            if (existingUser.mail != "") {
                console.log("Request messages for " + existingUser.nickname);
                self.persons.push(existingUser.id);
                self.broadcastGateway.getsomeMessages(persons, self.firstday, self.lastDay);
            } else {
                console.log("User does not exist");
            }

            self.isBusy = false;
        });

        this.subscription3 = this.ea.subscribe('messages-removed', function (e) {
            console.log("Event handler for messages-deletion");
            self.isBusy = false;
        });

    }

    deactivate() {
        this.subscription1.dispose();
        this.subscription2.dispose();
        this.subscription3.dispose();
    }


}