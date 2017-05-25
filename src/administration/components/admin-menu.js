export class AdminMenu {

    tryAddUser() {
    
    }


    tryDeleteUser() {
        if (confirm('Do you want to delete this user and all of his broadcasts?')) {
            //   this.contactGateway.delete(this.contact.id)
            //     .then(() => { this.router.navigateToRoute('contacts'); });
           // this.router.navigateToRoute('contacts');
        }
    }

}