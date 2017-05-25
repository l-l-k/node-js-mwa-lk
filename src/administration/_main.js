// child router instaed feature : 
// enable this file, disable ./index.js and disable feature in src/main.js
import { inlineView } from 'aurelia-framework';

@inlineView('<template><router-view></router-view></template>')
export class Administration {
    configureRouter(config) {
        config.map([
            {
                route: '', name: 'administration',
                moduleId: './components/home', title: 'Administration'
            },
            {
                route: 'new', name: 'add-user',
                moduleId: './components/add-user', title: 'Add User'
            },
            {
                route: ':id', name: 'remove-user',
                moduleId: './components/remove-user', title:"Remove User"
            },
            {
                route: ':id/edit', name: 'cleanup-content',
                moduleId: './components/cleanup-content', title: "Cleanup"
            },
            {
                route: ':id/photo', name: 'statistics',
                moduleId: './components/statistics', title: "Statistics"
            },
        ]);
    }
}