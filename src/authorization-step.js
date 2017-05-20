import { inject, NewInstance } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { User } from './models/user';

@inject(User)
export class AuthorizationStep {
    constructor(user) {
        this.user = user;
    }

    run(instruction, next) {
        //console.log(user.toString());
        console.log("Checking route permissions of user " + this.user.mail);
        var instructions = instruction.getAllInstructions()

        // Administration         
        var isRestrictedRoute = instructions.some(
            i => i.config.settings.restrictedToAdmins);

        console.log('Is route restricted for admins ? ' + isRestrictedRoute);
        if (isRestrictedRoute) {
            console.log(this.user.toString());
            var isAdmin = this.user.isAdmin;
            console.log('Is Admin ? ' + isAdmin);
            if (!isAdmin) {
                alert('Please register as administrator.');
                console.log('Redirect to login');
                return next.cancel(new Redirect('login'));
            }
        }

        // Run core application
        isRestrictedRoute = instructions.some(
            i => i.config.settings.logonRequired);

        console.log('Does route require login ? ' + isRestrictedRoute);
        if (isRestrictedRoute) {
            console.log(this.user.toString());
            var isValidUser = this.user.isAuthenticated;
            console.log('Is valid User ? ' + isValidUser);
            if (!isValidUser) {
                alert('Please login first.');
                console.log('Redirect to login');
                return next.cancel(new Redirect('login'));
            }
        }

        // Logout
        // isRestrictedRoute = instructions.some(
        //     i => i.config.settings.logoutRequired);

        // console.log('Does route require logout ? ' + isRestrictedRoute);
        // if (isRestrictedRoute) {
        //     console.log("Logout " + this.user.mail)
        //     if (this.user !== null) {
        //         console.log("Before : " + this.user.mail);
        //         this.user = NewInstance.of(User)
        //         console.log("After : " + this.user.mail);
        //     }
        // }

        // Continue        
        return next();
    }
}