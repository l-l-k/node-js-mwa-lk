// feature instead of child router : 
// enable this file, disable ./main.js and enable feature in src/main.js
import { Router } from 'aurelia-router';

const routes = [
    {
        route: 'administration', name: 'administration',
        moduleId: 'administration/adm', nav: false, title: 'Administration'
    },
    {
        route: 'administration/increase', name: 'add-user',
        moduleId: 'administration/components/add-user', title: 'Add User'
    },
   {
        route: 'administration/decrease', name: 'remove-user',
        moduleId: 'administration/components/remove-user', title: 'Remove User'
    },
    {
        route: 'administration/:id', name: 'cleanup-content',
        moduleId: 'administration/components/cleanup-content', title:'Cleanup'
    },
    {
        route: 'administration/:id/edit', name: 'statistics',
        moduleId: 'administration/components/statistics', title: "Statistics"
    },
];

export function configure(config) {
    const router = config.container.get(Router);
    routes.forEach(r => router.addRoute(r));
}