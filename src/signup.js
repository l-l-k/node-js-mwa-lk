import { inject , NewInstance} from 'aurelia-framework';
import { UserGateway } from './services/user-gateway';
import { User } from './models/user';

@inject(UserGateway, User)
export class Signup {
    constructor(userGateway, user) {
        this.userGateway = userGateway;
        this.user = user;
        this.newUser = NewInstance.of(User);
        this.newUser.mail = "";
        this.newUser.name = "";
        this.newUser.password = "";
 }

    isBusy = false;
    validationFailed = false;
    addressExists = false;
    nameExists = false;
    isValidPassword = true; // ER: validate PW-Security

    save() {
        console.log("W");
       alert('SAVE');
    //    return this.userGateway.create(this.newUser)
    //        .then(() => this.router.navigateToRoute('login'));
       return this.newUser;    
    }
    

    performSignup() {
       var msg = "Signup  " + this.newUser.toString();
        console.log(msg);

        // aurelia-validation is much more complex
        this.validationFailed =
            this.newUser.mail.length == 0 ||
        this.newUser.name.length == 0 ||
        this.newUser.password.length == 0;
        if (this.validationFailed) {
            console.log("Input-Validation failed");
            //  alert(msg);
            return;
        }

        // try retrieving user data from storage
        var msg = this.userGateway.testServerConnection();
        var txt = this.userGateway.testLocalHerokuDB();
        var existingUser = this.userGateway.getByMailAddress(this.newUser.mail);

        // display hints if registration fails
        this.addressExists = existingUser.mail != null && existingUser.mail.length > 0;
        this.nameExists = existingUser.name != null && existingUser.name.length > 0;

        // register as new user
        if (!addressExists && !nameExists) {
            this.userGateway.add(this.newUser);
        }

        this.router.navigateToRoute('login');
    }
}
