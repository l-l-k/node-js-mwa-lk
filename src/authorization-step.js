import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
// import { User } from 'user';

//@inject(User)
export class AuthorizationStep {
    // constructor(user) {
    //     this.user = user;
    // }

    run(instruction, next) {
        var isRestrictedRoute = instruction.getAllInstructions()
            .some(i => i.config.settings.restrictedToAdmins);

        console.log('Is route restricted ? ' + isRestrictedRoute);       
        if (isRestrictedRoute) {
            var isAdmin = false; //this.user.isAuthenticated
            console.log('Is Admin ? ' + isAdmin);       
            if (!isAdmin) {
                alert('Please register as administrator.');
               console.log('Redirect to login');
                return next.cancel(new Redirect('login'));
             }
        }


        isRestrictedRoute = instruction.getAllInstructions()
            .some(i => i.config.settings.logonRequired);

        console.log('Is route restricted ? ' + isRestrictedRoute);
        if (isRestrictedRoute) {
            var isValidUser = false; //this.user.isAuthenticated
            console.log('Is valid User ? ' + isValidUser);
            if (!isValidUser) {
                alert('Please login first.');
                console.log('Redirect to login');
                return next.cancel(new Redirect('login'));
            }
        }
        
        return next();
    }
}